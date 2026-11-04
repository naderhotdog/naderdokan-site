import { MENU as DEFAULT_MENU, TABLES as DEFAULT_TABLES } from "./menu.js";
import { PHOTOS } from "./photos.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// ---------------- database ----------------
let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.exec("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, created INTEGER NOT NULL, table_no INTEGER NOT NULL, lines TEXT NOT NULL, note TEXT, status TEXT NOT NULL DEFAULT 'new')");
  await db.exec("CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)");
  for (const col of ["total INTEGER", "done_at INTEGER", "paid_at INTEGER"]) {
    try { await db.exec("ALTER TABLE orders ADD COLUMN " + col); } catch (e) { /* already there */ }
  }
  schemaReady = true;
}
async function getSetting(db, k) {
  const row = await db.prepare("SELECT v FROM settings WHERE k = ?").bind(k).first();
  return row ? row.v : null;
}
async function setSetting(db, k, v) {
  await db.prepare("INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(k, v).run();
}
async function getMenu(db) {
  const saved = await getSetting(db, "menu");
  if (saved) { const m = JSON.parse(saved); if ((m.v || 0) >= DEFAULT_MENU.v) return m; }
  return DEFAULT_MENU;
}
async function getTables(db) {
  return parseInt((await getSetting(db, "tables")) || DEFAULT_TABLES, 10);
}

// ---------------- access codes ----------------
const LEVEL = { kitchen: 1, manager: 2, owner: 3 };
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("naderdokan:" + text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function roleOf(request, db) {
  const key = (request.headers.get("x-key") || request.headers.get("x-kitchen-key") || "").trim();
  if (key.length < 4) return null;
  const h = await sha256(key);
  for (const r of ["owner", "manager", "kitchen"]) if ((await getSetting(db, r + "_hash")) === h) return r;
  return null;
}
const atLeast = (role, need) => !!role && LEVEL[role] >= LEVEL[need];

// ---------------- orders ----------------
const byId = (list) => Object.fromEntries((list || []).map((x) => [x.id, x]));
const isOn = (x) => x && x.available !== false;

function priceLines(raw, menu) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;
  const ITEMS = byId(menu.items), C = menu.custom;
  const BUNS = byId(C.buns), SAUSAGES = byId(C.sausages), EXTRA = byId([...(C.toppings || []), ...(C.sauces || [])]);
  const out = [];
  for (const l of raw) {
    const qty = Math.min(20, Math.max(1, parseInt(l?.qty, 10) || 1));
    if (l?.type === "item") {
      const it = ITEMS[l.id];
      if (!isOn(it)) return null;
      out.push({ type: "item", id: it.id, name: it.name, qty, price: it.price || 0 });
    } else if (l?.type === "custom") {
      const bun = BUNS[l.bun], sausage = SAUSAGES[l.sausage];
      if (!isOn(bun) || !isOn(sausage)) return null;
      const layers = (Array.isArray(l.layers) ? l.layers : []).slice(0, 20);
      const names = []; let price = (C.basePrice || 0) + (bun.price || 0) + (sausage.price || 0);
      for (const id of layers) {
        const t = EXTRA[id];
        if (!isOn(t)) return null;
        names.push(t.name); price += t.price || 0;
      }
      out.push({ type: "custom", name: "هات‌داگ سفارشی", qty, bun: bun.name, sausage: sausage.name, layers: names, price });
    } else return null;
  }
  return out;
}

const ORDER_STATUSES = ["new", "done", "paid", "cancelled"];
const HOUR = 3600 * 1000;

// Manager may only change which things are available, not names or prices.
function mergeAvailability(stored, sent) {
  const copy = JSON.parse(JSON.stringify(stored));
  const flags = (dst, src) => { const s = byId(src); for (const x of dst || []) if (s[x.id]) x.available = s[x.id].available !== false; };
  flags(copy.items, sent.items);
  for (const k of ["buns", "sausages", "toppings", "sauces"]) flags(copy.custom[k], sent.custom?.[k]);
  return copy;
}
function validMenu(m) {
  return m && Array.isArray(m.items) && m.items.length <= 80 && m.custom &&
    ["buns", "sausages", "toppings", "sauces"].every((k) => Array.isArray(m.custom[k])) &&
    m.items.every((i) => i && typeof i.id === "string" && typeof i.name === "string" && (i.price == null || Number.isFinite(i.price)));
}

// Serve a homepage photo from our own domain (fetched once from Unsplash, then cached at the edge).
async function photo(name, request, ctx) {
  const src = PHOTOS[name];
  if (!src) return new Response("not found", { status: 404 });
  const cache = caches.default, key = new Request(new URL(request.url).origin + "/img/w/" + name);
  let res = await cache.match(key);
  if (res) return res;
  const up = await fetch(src, { cf: { cacheTtl: 2592000, cacheEverything: true } });
  if (!up.ok) return new Response("photo unavailable", { status: 502 });
  res = new Response(up.body, { headers: { "content-type": up.headers.get("content-type") || "image/jpeg", "cache-control": "public, max-age=2592000, immutable" } });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;
    if (pathname.startsWith("/img/w/")) return photo(pathname.slice(7), request, ctx);
    if (!pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    const db = env.DB;
    await ensureSchema(db);
    const body = async () => { try { return await request.json(); } catch { return {}; } };

    // ---- public ----
    if (pathname === "/api/menu" && method === "GET") {
      return json({ ...(await getMenu(db)), tables: await getTables(db) });
    }
    if (pathname === "/api/order" && method === "POST") {
      const b = await body();
      const tables = await getTables(db);
      const table = parseInt(b?.table, 10);
      if (!(table >= 1 && table <= tables)) return json({ error: "table" }, 400);
      const lines = priceLines(b?.lines, await getMenu(db));
      if (!lines) return json({ error: "lines" }, 400);
      const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
      const note = String(b?.note || "").slice(0, 200);
      const res = await db.prepare("INSERT INTO orders (created, table_no, lines, note, total) VALUES (?, ?, ?, ?, ?) RETURNING id")
        .bind(Date.now(), table, JSON.stringify(lines), note, total).first();
      return json({ id: res.id, total });
    }
    const statusMatch = pathname.match(/^\/api\/order\/(\d+)$/);
    if (statusMatch && method === "GET") {
      const row = await db.prepare("SELECT status FROM orders WHERE id = ?").bind(statusMatch[1]).first();
      return row ? json({ status: row.status }) : json({ error: "not found" }, 404);
    }

    // ---- sign in ----
    if (pathname === "/api/auth/status" && method === "GET") {
      const out = {};
      for (const r of ["owner", "manager", "kitchen"]) out[r] = !!(await getSetting(db, r + "_hash"));
      return json(out);
    }
    if (pathname === "/api/auth/login" && method === "POST") {
      const role = await roleOf(request, db);
      return role ? json({ role }) : json({ error: "wrong code" }, 401);
    }
    // The head manager claims the owner panel once; after that only they can change codes.
    if (pathname === "/api/auth/setup" && method === "POST") {
      if (await getSetting(db, "owner_hash")) return json({ error: "already set" }, 409);
      const { key } = await body();
      if (typeof key !== "string" || key.trim().length < 6) return json({ error: "short" }, 400);
      await setSetting(db, "owner_hash", await sha256(key.trim()));
      return json({ ok: true, role: "owner" });
    }

    const role = await roleOf(request, db);
    if (!role) return json({ error: "unauthorized" }, 401);

    // ---- orders (all panels) ----
    if (pathname === "/api/orders" && method === "GET") {
      const now = Date.now();
      let from = parseInt(url.searchParams.get("from"), 10) || now - 12 * HOUR;
      let to = parseInt(url.searchParams.get("to"), 10) || now + 60000;
      if (role === "kitchen") from = Math.max(from, now - 12 * HOUR);
      if (role === "manager") from = Math.max(from, now - 48 * HOUR);
      const { results } = await db.prepare("SELECT * FROM orders WHERE created >= ? AND created < ? ORDER BY id DESC LIMIT 5000").bind(from, to).all();
      return json(results.map((r) => {
        const o = { ...r, lines: JSON.parse(r.lines) };
        if (role === "kitchen") { delete o.total; o.lines = o.lines.map(({ price, ...l }) => l); }
        return o;
      }));
    }
    const st = pathname.match(/^\/api\/orders\/(\d+)\/status$/);
    if (st && method === "POST") {
      const { status } = await body();
      const allowed = role === "kitchen" ? ["new", "done"] : ORDER_STATUSES;
      if (!allowed.includes(status)) return json({ error: "status" }, 403);
      const now = Date.now();
      const extra = status === "done" ? ", done_at = " + now : status === "paid" ? ", paid_at = " + now : "";
      await db.prepare("UPDATE orders SET status = ?" + extra + " WHERE id = ?").bind(status, st[1]).run();
      return json({ ok: true });
    }

    // ---- menu: manager toggles availability, owner edits everything ----
    if (pathname === "/api/admin/menu" && method === "PUT") {
      if (!atLeast(role, "manager")) return json({ error: "forbidden" }, 403);
      const sent = await body();
      if (!validMenu(sent)) return json({ error: "menu" }, 400);
      const next = role === "owner" ? sent : mergeAvailability(await getMenu(db), sent);
      await setSetting(db, "menu", JSON.stringify(next));
      return json({ ok: true });
    }

    // ---- owner only ----
    if (pathname === "/api/admin/codes" && method === "POST") {
      if (role !== "owner") return json({ error: "forbidden" }, 403);
      const { role: target, key } = await body();
      if (!["owner", "manager", "kitchen"].includes(target)) return json({ error: "role" }, 400);
      if (typeof key !== "string" || key.trim().length < (target === "owner" ? 6 : 4)) return json({ error: "short" }, 400);
      const h = await sha256(key.trim());
      for (const r of ["owner", "manager", "kitchen"]) if (r !== target && (await getSetting(db, r + "_hash")) === h) return json({ error: "duplicate" }, 409);
      await setSetting(db, target + "_hash", h);
      return json({ ok: true });
    }
    if (pathname === "/api/admin/settings" && method === "PUT") {
      if (role !== "owner") return json({ error: "forbidden" }, 403);
      const { tables } = await body();
      const t = parseInt(tables, 10);
      if (!(t >= 1 && t <= 60)) return json({ error: "tables" }, 400);
      await setSetting(db, "tables", String(t));
      return json({ ok: true });
    }

    return json({ error: "not found" }, 404);
  },
};
