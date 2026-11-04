/* Nader loading screen: the logo jumps while the page opens or is busy.
   Use Loader.show() / Loader.hide() anywhere; it also turns on by itself for
   page loads, page changes, slow first data loads and any sending (POST etc). */
(function () {
  if (window.Loader) return;
  var css = '#nd-loader{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:0;' +
    'background:rgba(248,239,220,.82);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);opacity:0;visibility:hidden;transition:opacity .2s,visibility 0s .2s}' +
    '#nd-loader.on{opacity:1;visibility:visible;transition:opacity .15s}' +
    '#nd-loader.first{background:#F8EFDC}' +
    '#nd-loader .nd-l{width:84px;height:84px;border-radius:50%;background:#fff url(/img/logo.png) center/cover no-repeat;box-shadow:0 0 0 3px #FA3225;' +
    'animation:nd-jump .7s cubic-bezier(.3,0,.4,1) infinite alternate;transform-origin:50% 100%}' +
    '#nd-loader .nd-s{width:62px;height:10px;margin-top:14px;border-radius:50%;background:rgba(20,16,16,.18);animation:nd-sh .7s cubic-bezier(.3,0,.4,1) infinite alternate}' +
    '@keyframes nd-jump{0%{transform:translateY(0) scale(1.08,.92)}18%{transform:translateY(-4px) scale(.96,1.05)}100%{transform:translateY(-34px) scale(1)}}' +
    '@keyframes nd-sh{0%{transform:scale(1);opacity:1}100%{transform:scale(.55);opacity:.45}}' +
    '@media (prefers-reduced-motion:reduce){#nd-loader .nd-l,#nd-loader .nd-s{animation:nd-pulse 1.2s ease-in-out infinite alternate}@keyframes nd-pulse{to{opacity:.55}}}';
  var st = document.createElement('style'); st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  var el = document.createElement('div');
  el.id = 'nd-loader'; el.className = 'on first';
  el.setAttribute('role', 'status'); el.setAttribute('aria-label', 'در حال بارگذاری');
  el.innerHTML = '<div class="nd-l"></div><div class="nd-s"></div>';
  document.documentElement.appendChild(el);
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(el); });

  var count = 1, shownAt = Date.now(), timer = null, start = Date.now();
  function show(now) {
    count++;
    if (el.classList.contains('on') || timer) return;
    timer = setTimeout(function () { timer = null; if (count > 0) { el.classList.add('on'); shownAt = Date.now(); } }, now ? 0 : 250);
  }
  function hide() {
    count = Math.max(0, count - 1);
    if (count) return;
    if (timer) { clearTimeout(timer); timer = null; }
    var wait = Math.max(0, 450 - (Date.now() - shownAt));
    setTimeout(function () { if (!count) { el.classList.remove('on'); setTimeout(function () { el.classList.remove('first'); }, 250); } }, wait);
  }
  window.Loader = { show: function () { show(true); }, hide: hide };

  // first page load
  window.addEventListener('load', function () { setTimeout(hide, 150); });
  setTimeout(function () { if (count) { count = 1; hide(); } }, 8000); // never stay stuck

  // network: first data of the page, and anything that sends (orders, saves)
  var f = window.fetch;
  if (f) window.fetch = function (input, init) {
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var watch = method !== 'GET' || Date.now() - start < 4000;
    if (!watch) return f.apply(this, arguments);
    show(false);
    var done = false, end = function () { if (!done) { done = true; hide(); } };
    var safety = setTimeout(end, 15000);
    return f.apply(this, arguments).then(function (r) { clearTimeout(safety); end(); return r; }, function (e) { clearTimeout(safety); end(); throw e; });
  };

  // leaving to another page of the site
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    show(true);
  });
  // coming back with the browser's back button: don't leave it spinning
  window.addEventListener('pageshow', function (e) { if (e.persisted) { count = 1; hide(); } });
})();
