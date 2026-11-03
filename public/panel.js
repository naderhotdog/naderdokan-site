// Shared sign-in + helpers for the kitchen, manager and owner panels.
(function () {
  const mem = {};
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return mem[k] ?? null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del: (k) => { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } },
  };
  const LEVEL = { kitchen: 1, manager: 2, owner: 3 };
  const NAMES = { kitchen: 'آشپزخانه', manager: 'مدیر فروشگاه', owner: 'مدیر کل' };
  const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const money = (n) => fa(Math.round(n || 0).toLocaleString('en-US')).replace(/,/g, '٬');
  const TZ = 'Asia/Tehran';
  const dayKey = (ms) => new Date(ms).toLocaleDateString('en-CA', { timeZone: TZ });
  const hourOf = (ms) => parseInt(new Date(ms).toLocaleString('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }), 10) % 24;
  const time = (ms) => fa(new Date(ms).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }));
  const faDate = (ms) => new Date(ms).toLocaleDateString('fa-IR', { timeZone: TZ, month: 'long', day: 'numeric', weekday: 'short' });
  // Start of the Tehran day that contains ms (Tehran is UTC+03:30, no DST).
  const OFF = 3.5 * 3600 * 1000, DAY = 86400000;
  const dayStart = (ms) => Math.floor((ms + OFF) / DAY) * DAY - OFF;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let audio;
  function beep() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.18, 0.36].forEach((t) => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
        g.gain.setValueAtTime(0.3, audio.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + t + 0.15);
        o.start(audio.currentTime + t); o.stop(audio.currentTime + t + 0.16);
      });
    } catch (e) {}
  }

  let key = null;
  async function api(path, opts = {}) {
    const r = await fetch(path, { ...opts, headers: { 'content-type': 'application/json', 'x-key': key || '', ...(opts.headers || {}) } });
    if (r.status === 401) { store.del('nd_key_' + Panel.need); location.reload(); throw new Error('auth'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || 'error'), { status: r.status });
    return j;
  }

  function loginCard(app, need, msg, onDone) {
    app.innerHTML = `<div class="card login"><h2 style="margin-top:0">ورود ${NAMES[need]}</h2>
      <p class="muted">کد ${NAMES[need]} رو وارد کنید</p>${msg ? `<p class="err">${msg}</p>` : ''}
      <input id="k" type="password" autocomplete="current-password"><button class="btn red" id="go" style="width:100%">ورود</button></div>`;
    const go = async () => {
      const k = document.getElementById('k').value.trim();
      const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'x-key': k } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return loginCard(app, need, 'کد اشتباهه', onDone);
      if (LEVEL[j.role] < LEVEL[need]) return loginCard(app, need, 'این کد اجازه‌ی ورود به این پنل رو نداره', onDone);
      key = k; store.set('nd_key_' + need, k); onDone(j.role);
    };
    document.getElementById('go').onclick = go;
    document.getElementById('k').onkeydown = (e) => { if (e.key === 'Enter') go(); };
  }

  function ownerSetup(app, msg, onDone) {
    app.innerHTML = `<div class="card login"><h2 style="margin-top:0">راه‌اندازی پنل مدیر کل</h2>
      <p class="muted">یک کد برای خودتون انتخاب کنید (حداقل ۶ کاراکتر). این کد همه‌چیز رو کنترل می‌کنه؛ به هیچ‌کس ندید.</p>${msg ? `<p class="err">${msg}</p>` : ''}
      <input id="k1" type="password" autocomplete="new-password" placeholder="کد جدید"><input id="k2" type="password" autocomplete="new-password" placeholder="تکرار کد" style="margin-top:0">
      <button class="btn red" id="save" style="width:100%">ذخیره و ورود</button></div>`;
    document.getElementById('save').onclick = async () => {
      const a = document.getElementById('k1').value.trim(), b = document.getElementById('k2').value.trim();
      if (a.length < 6) return ownerSetup(app, 'کد باید حداقل ۶ کاراکتر باشه', onDone);
      if (a !== b) return ownerSetup(app, 'دو کد یکی نیستن', onDone);
      const r = await fetch('/api/auth/setup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key: a }) });
      if (!r.ok) return loginCard(app, 'owner', 'کد قبلاً تنظیم شده؛ وارد شوید', onDone);
      key = a; store.set('nd_key_owner', a); onDone('owner');
    };
  }

  window.Panel = {
    fa, money, time, faDate, dayKey, hourOf, dayStart, DAY, esc, beep, api, store, NAMES,
    need: null, role: null,
    async start(need, onReady) {
      Panel.need = need;
      const app = document.getElementById('app');
      const done = (role) => {
        Panel.role = role;
        const who = document.getElementById('who');
        if (who) who.innerHTML = `${NAMES[role]} · <button class="link" id="logout">خروج</button>`;
        const lo = document.getElementById('logout');
        if (lo) lo.onclick = () => { store.del('nd_key_' + need); location.reload(); };
        onReady(role);
      };
      const saved = store.get('nd_key_' + need);
      if (saved) {
        const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'x-key': saved } }).catch(() => null);
        const j = r && r.ok ? await r.json() : null;
        if (j && LEVEL[j.role] >= LEVEL[need]) { key = saved; return done(j.role); }
        store.del('nd_key_' + need);
      }
      if (need === 'owner') {
        const s = await (await fetch('/api/auth/status')).json().catch(() => ({ owner: true }));
        if (!s.owner) return ownerSetup(app, '', done);
      }
      loginCard(app, need, '', done);
    },
  };
})();
