// Shared cart for /menu and /build. Kept per table in the browser.
(function () {
  const params = new URLSearchParams(location.search);
  let table = parseInt(params.get("t"), 10);
  const mem = {};
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return mem[k] ?? null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } },
  };
  // Table numbers are switched off for now: every order is a plain order.
  table = null; store.del("nd_table");

  const key = () => "nd_cart_" + (table || 0);
  const read = () => { try { return JSON.parse(store.get(key()) || "[]"); } catch (e) { return []; } };
  const write = (c) => store.set(key(), JSON.stringify(c));

  const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

  window.Cart = {
    table, fa, store,
    items: read,
    count() { return read().reduce((s, l) => s + l.qty, 0); },
    addItem(id, delta) {
      const c = read();
      const l = c.find((x) => x.type === "item" && x.id === id);
      if (l) l.qty += delta; else if (delta > 0) c.push({ type: "item", id, qty: delta });
      write(c.filter((x) => x.qty > 0));
    },
    qtyOf(id) { const l = read().find((x) => x.type === "item" && x.id === id); return l ? l.qty : 0; },
    addCustom(d) { const c = read(); c.push({ type: "custom", qty: 1, ...d }); write(c); },
    setQtyAt(i, q) { const c = read(); if (!c[i]) return; c[i].qty = q; write(c.filter((x) => x.qty > 0)); },
    clear() { write([]); },
    tableLink(path) { return path + (table ? "?t=" + table : ""); },
    toast(msg) {
      let t = document.querySelector(".toast");
      if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
      t.textContent = msg; t.classList.add("show");
      clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1800);
    },
  };
})();
