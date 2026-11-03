import { MENU, TABLES } from "./menu.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.exec(
    "CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, created INTEGER NOT NULL, table_no INTEGER NOT NULL, lines TEXT NOT NULL, note TEXT, status TEXT NOT NULL DEFAULT 'new')"
  );
  await db.exec("CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)");
  schemaReady = true;
}

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
const ITEMS = byId(MENU.items);
const C = MENU.custom;
const BUNS = byId(C.buns), SAUSAGES = byId(C.sausages), TOPPINGS = byId(C.toppings), SAUCES = byId(C.sauces);

// Turn the customer's cart into clean, validated kitchen lines.
function validateLines(raw) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;
  const out = [];
  for (const l of raw) {
    const qty = Math.min(20, Math.max(1, parseInt(l?.qty, 10) || 1));
    if (l?.type === "item") {
      const it = ITEMS[l.id];
      if (!it) return null;
      out.push({ type: "item", id: it.id, name: it.name, qty });
    } else if (l?.type === "custom") {
      const bun = BUNS[l.bun], sausage = SAUSAGES[l.sausage];
      if (!bun || !sausage) return null;
      const layers = (Array.isArray(l.layers) ? l.layers : []).slice(0, 20);
      const names = [];
      for (const id of layers) {
        const t = TOPPINGS[id] || SAUCES[id];
        if (!t) return null;
        names.push(t.name);
      }
      out.push({ type: "custom", name: "هات‌داگ سفارشی", qty, bun: bun.name, sausage: sausage.name, layers: names });
    } else return null;
  }
  return out;
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("naderdokan:" + text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function kitchenHash(db) {
  const row = await db.prepare("SELECT v FROM settings WHERE k = 'kitchen_hash'").first();
  return row ? row.v : null;
}
// The owner picks the kitchen code on first visit; only its hash is stored.
async function kitchenAuthorized(request, env) {
  const key = request.headers.get("x-kitchen-key") || "";
  const stored = await kitchenHash(env.DB);
  return !!stored && key.length >= 4 && (await sha256(key)) === stored;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (!pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    if (pathname === "/api/menu" && method === "GET") {
      return json({ ...MENU, tables: TABLES });
    }

    await ensureSchema(env.DB);

    // Customer places an order
    if (pathname === "/api/order" && method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
      const table = parseInt(body?.table, 10);
      if (!(table >= 1 && table <= TABLES)) return json({ error: "table" }, 400);
      const lines = validateLines(body?.lines);
      if (!lines) return json({ error: "lines" }, 400);
      const note = String(body?.note || "").slice(0, 200);
      const res = await env.DB.prepare(
        "INSERT INTO orders (created, table_no, lines, note) VALUES (?, ?, ?, ?) RETURNING id"
      ).bind(Date.now(), table, JSON.stringify(lines), note).first();
      return json({ id: res.id });
    }

    // Customer checks their order status
    const statusMatch = pathname.match(/^\/api\/order\/(\d+)$/);
    if (statusMatch && method === "GET") {
      const row = await env.DB.prepare("SELECT status FROM orders WHERE id = ?").bind(statusMatch[1]).first();
      return row ? json({ status: row.status }) : json({ error: "not found" }, 404);
    }

    // Kitchen: has a code been chosen yet? / choose it once
    if (pathname === "/api/kitchen/setup" && method === "GET") {
      return json({ configured: !!(await kitchenHash(env.DB)) });
    }
    if (pathname === "/api/kitchen/setup" && method === "POST") {
      if (await kitchenHash(env.DB)) return json({ error: "already set" }, 409);
      const { key } = await request.json().catch(() => ({}));
      if (typeof key !== "string" || key.trim().length < 4) return json({ error: "short" }, 400);
      await env.DB.prepare("INSERT INTO settings (k, v) VALUES ('kitchen_hash', ?)").bind(await sha256(key.trim())).run();
      return json({ ok: true });
    }

    // Kitchen: list recent orders
    if (pathname === "/api/orders" && method === "GET") {
      if (!(await kitchenAuthorized(request, env))) return json({ error: "unauthorized" }, 401);
      const since = Date.now() - 12 * 3600 * 1000;
      const { results } = await env.DB.prepare(
        "SELECT * FROM orders WHERE created > ? ORDER BY id DESC LIMIT 100"
      ).bind(since).all();
      return json(results.map((r) => ({ ...r, lines: JSON.parse(r.lines) })));
    }

    // Kitchen: mark an order done / new
    const doneMatch = pathname.match(/^\/api\/orders\/(\d+)\/status$/);
    if (doneMatch && method === "POST") {
      if (!(await kitchenAuthorized(request, env))) return json({ error: "unauthorized" }, 401);
      const { status } = await request.json().catch(() => ({}));
      if (!["new", "done"].includes(status)) return json({ error: "status" }, 400);
      await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, doneMatch[1]).run();
      return json({ ok: true });
    }

    return json({ error: "not found" }, 404);
  },
};
