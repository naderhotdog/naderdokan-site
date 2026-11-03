// Illustrated hotdogs for Nader Hotdog — shared by the homepage, the menu and the "build your own" game.
(function () {
  const OUT = '#3A2418';
  const BUN = { plain: ['#F2B66B', '#D9893E'], baguette: ['#EBB466', '#B9742F'] };
  const SAUSAGE = { regular: ['#D8613F', '#A5381F'], beef: ['#9C4A2C', '#5E2412'], chicken: ['#EDB98A', '#C98B55'], cheesy: ['#EDB98A', '#C98B55'] };
  const COLOR = {
    bacon: '#C8553D', pepperoni: '#B8321F', mince: '#7A4026', mozzarella: '#F6E7B8', pizzacheese: '#FFD45C', caramelonion: '#B8742A',
    house: '#F08A3C', cheddar: '#FFA21F', bbq: '#6B2412', mustard: '#F2C200', pickle: '#9CB33A', jalapeno: '#3E8E3A'
  };
  const SAUCES = new Set(['house', 'cheddar', 'bbq', 'mustard', 'pickle', 'jalapeno']);
  const rnd = (s) => { let t = Math.abs(Math.round(s)) * 9301 + 49297; return () => ((t = (t * 9301 + 49297) % 233280) / 233280); };
  let uid = 0;

  // One ingredient drawn around x (centre) at height y. `anim` adds the squeeze animation class to sauces.
  function piece(id, x, y, seed, color, anim) {
    const r = rnd(seed + 3), c = color || COLOR[id] || '#C8102E';
    const spread = (n, w) => Array.from({ length: n }, (_, i) => x - w / 2 + (w / (n - 1)) * i + (r() * 8 - 4));
    switch (id) {
      case 'bacon': return [-1, 1].map((k) => { const yy = y + k * 5 - 2, x0 = x - 58 + k * 6;
        const d = `M${x0} ${yy} q10 -9 20 0 t20 0 t20 0 t20 0 t20 0 t16 0 l0 9 q-8 -9 -16 0 t-20 0 t-20 0 t-20 0 t-20 0 t-20 0 Z`;
        return `<path d="${d}" fill="${c}" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x0+4} ${yy+4} q8 -7 16 0 t20 0 t20 0 t20 0 t20 0 t12 0" fill="none" stroke="#F4C3A8" stroke-width="2.4" stroke-linecap="round"/>`; }).join('');
      case 'pepperoni': return spread(4, 78).map((px) => { const py = y + r() * 5 - 2;
        return `<circle cx="${px}" cy="${py}" r="11.5" fill="${c}" stroke="${OUT}" stroke-width="2.5"/><circle cx="${px - 4}" cy="${py - 3}" r="2" fill="#7E1D10"/><circle cx="${px + 4}" cy="${py + 2}" r="1.8" fill="#7E1D10"/><circle cx="${px + 3}" cy="${py - 5}" r="1.4" fill="#E87A5E"/>`; }).join('');
      case 'mince': return Array.from({ length: 16 }, (_, i) => { const px = x - 54 + i * 7.2 + r() * 4, py = y + r() * 10 - 4, s = 4 + r() * 3;
        return `<path d="M${px - s} ${py} q${s * .4} ${-s} ${s} ${-s * .8} q${s} ${-s * .2} ${s} ${s * .9} q${-s * .5} ${s * .8} ${-s * 1.2} ${s * .5} z" fill="${i % 3 ? c : '#5E2E1A'}" stroke="${OUT}" stroke-width="1.4"/>`; }).join('');
      case 'mozzarella': return `<path d="M${x - 56} ${y - 6} Q${x} ${y - 14} ${x + 56} ${y - 6} L${x + 50} ${y + 8} Q${x + 42} ${y + 2} ${x + 36} ${y + 16} Q${x + 30} ${y + 4} ${x + 18} ${y + 10} Q${x + 8} ${y + 2} ${x} ${y + 18} Q${x - 8} ${y + 4} ${x - 18} ${y + 12} Q${x - 30} ${y + 2} ${x - 38} ${y + 16} Q${x - 44} ${y + 2} ${x - 52} ${y + 8} Z" fill="${c}" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="${x - 22}" cy="${y - 3}" r="3" fill="#C99A55" opacity=".6"/><circle cx="${x + 16}" cy="${y - 1}" r="2.4" fill="#C99A55" opacity=".6"/><circle cx="${x + 36}" cy="${y - 4}" r="2" fill="#C99A55" opacity=".6"/>`;
      case 'pizzacheese': return Array.from({ length: 14 }, (_, i) => { const px = x - 52 + i * 8 + r() * 4, py = y + r() * 10 - 5, a = r() * 50 - 25;
        return `<path d="M${px} ${py} q5 -5 10 0 q5 5 9 0" transform="rotate(${a} ${px + 9} ${py})" fill="none" stroke="${OUT}" stroke-width="5.5" stroke-linecap="round"/><path d="M${px} ${py} q5 -5 10 0 q5 5 9 0" transform="rotate(${a} ${px + 9} ${py})" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/>`; }).join('');
      case 'caramelonion': return Array.from({ length: 11 }, (_, i) => { const px = x - 44 + i * 9 + r() * 4, py = y + r() * 8 - 2;
        return `<path d="M${px} ${py + 4} q4 -9 9 -2 q3 5 7 -1" fill="none" stroke="${c}" stroke-width="4.4" stroke-linecap="round"/><path d="M${px} ${py + 4} q4 -9 9 -2" fill="none" stroke="#6E3E12" stroke-width="1" stroke-linecap="round"/>`; }).join('');
      default: { // a squeezed sauce zigzag along the hotdog
        const thick = id === 'cheddar' ? 10 : 7, pts = [];
        for (let k = 0, px = 44; px <= 356; px += 13, k++) pts.push(`${px},${y + (k % 2 ? -8 : 8)}`);
        const p = 'M' + pts.join(' L'), cls = anim ? 'squeeze' : '';
        const dots = id === 'pickle' ? pts.filter((_, k) => k % 3 === 1).map((q) => { const [a, b] = q.split(','); return `<circle cx="${a}" cy="${b}" r="1.6" fill="#E9F2B8"/>`; }).join('') : '';
        return `<path class="${cls}" d="${p}" fill="none" stroke="${OUT}" stroke-width="${thick + 2.5}" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><path class="${cls}" d="${p}" fill="none" stroke="${c}" stroke-width="${thick}" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
      }
    }
  }

  const grad = (n, a, b) => `<linearGradient id="${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  function defs(bun, sausage, id) { return `<defs>${grad('b' + id, ...(BUN[bun] || BUN.plain))}${grad('s' + id, ...(SAUSAGE[sausage] || SAUSAGE.regular))}</defs>`; }
  function bunBack(bun, id) {
    return `<path d="M34 128 C30 92 60 82 92 84 L308 84 C340 82 370 92 366 128 Z" fill="url(#b${id})" stroke="${OUT}" stroke-width="4"/><path d="M60 100 Q200 88 340 100" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/>`;
  }
  function sausageArt(sausage, id) {
    let o = `<rect x="20" y="92" width="360" height="46" rx="23" fill="url(#s${id})" stroke="${OUT}" stroke-width="4"/><rect x="40" y="98" width="320" height="12" rx="6" fill="#fff" opacity=".28"/>`;
    if (sausage === 'beef' || sausage === 'regular') o += [90, 150, 210, 270, 330].map((x) => `<path d="M${x} 96 l-14 38" stroke="#3E1608" stroke-width="4" opacity="${sausage === 'beef' ? .55 : .25}"/>`).join('');
    if (sausage === 'cheesy') o += [70, 118, 170, 222, 272, 326].map((x, i) => `<ellipse cx="${x}" cy="${118 + (i % 2) * 8}" rx="6" ry="4" fill="#FFC93C" stroke="#D9921A" stroke-width="1.2"/>`).join('');
    if (sausage === 'chicken') o += [80, 160, 240, 320].map((x) => `<path d="M${x} 100 q6 14 0 30" fill="none" stroke="#B97A45" stroke-width="2" opacity=".5"/>`).join('');
    return o;
  }
  function bunFront(bun, id) {
    let o = `<path d="M28 122 Q22 206 96 212 L304 212 Q378 206 372 122 Q352 148 300 148 L100 148 Q48 148 28 122 Z" fill="url(#b${id})" stroke="${OUT}" stroke-width="4"/><path d="M60 184 Q200 204 340 184" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="8" stroke-linecap="round"/>`;
    if (bun === 'baguette') o += [90, 145, 200, 255, 310].map((x) => `<path d="M${x - 18} 196 q18 -26 36 -24" fill="none" stroke="#8E5320" stroke-width="4" stroke-linecap="round" opacity=".65"/><path d="M${x - 14} 192 q15 -20 30 -19" fill="none" stroke="#F8D9A0" stroke-width="2" stroke-linecap="round" opacity=".7"/>`).join('');
    return o;
  }
  // Where each layer sits: toppings spread along the sausage, sauces stacked on top.
  function layout(layers) {
    const tops = layers.filter((l) => !SAUCES.has(l)), out = [];
    let ti = 0, si = 0;
    layers.forEach((l) => {
      if (SAUCES.has(l)) out.push({ id: l, x: 200, y: 114 - (si++) * 6 });
      else { const n = tops.length, i = ti++, x = n === 1 ? 200 : 110 + (180 / (n - 1)) * i;
        const wide = ['bacon', 'mozzarella', 'mince', 'pizzacheese', 'caramelonion'].includes(l);
        out.push({ id: l, x: wide ? Math.max(130, Math.min(270, x)) : x, y: 93 - (i % 2) * 5 }); }
    });
    return out;
  }

  // DogArt.svg({ bun, sausage, layers: ['bacon','mozzarella','bbq'] }) -> complete picture
  function svg({ bun = 'plain', sausage = 'regular', layers = [] } = {}, colors = {}) {
    const id = 'd' + (++uid);
    let out = defs(bun, sausage, id) + `<ellipse cx="200" cy="220" rx="170" ry="9" fill="#000" opacity=".18"/>` + bunBack(bun, id) + sausageArt(sausage, id);
    layout(layers).forEach((p, i) => { out += piece(p.id, p.x, p.y, i * 17 + 5, colors[p.id]); });
    out += bunFront(bun, id);
    return `<svg viewBox="0 40 400 192" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`;
  }

  // Picture for each menu hotdog (by menu item id). New items fall back to the classic look.
  const LOOKS = {
    smokedog:    { bun: 'plain', sausage: 'regular', layers: ['bacon', 'mozzarella', 'bbq'] },
    cheddarslam: { bun: 'plain', sausage: 'regular', layers: ['caramelonion', 'house', 'cheddar'] },
    monsterbite: { bun: 'plain', sausage: 'regular', layers: ['mince', 'bacon', 'house', 'cheddar'] },
    lavadog:     { bun: 'plain', sausage: 'regular', layers: ['pepperoni', 'mozzarella', 'house'] },
    loadeddog:   { bun: 'plain', sausage: 'regular', layers: ['bacon', 'house', 'cheddar'] },
    sausagedog:  { bun: 'plain', sausage: 'regular', layers: ['mince', 'house', 'cheddar'] },
    jizzdog:     { bun: 'plain', sausage: 'regular', layers: ['pepperoni', 'pizzacheese', 'jalapeno'] },
    specialclassic: { bun: 'plain', sausage: 'regular', layers: ['pickle', 'mustard'] },
    beefclassic:    { bun: 'baguette', sausage: 'beef', layers: ['house'] },
    chickenclassic: { bun: 'baguette', sausage: 'chicken', layers: ['house'] },
    cheeseclassic:  { bun: 'baguette', sausage: 'cheesy', layers: ['house'] },
    _default:       { bun: 'plain', sausage: 'regular', layers: ['house', 'mustard'] }
  };
  const look = (itemId) => LOOKS[itemId] || LOOKS._default;

  window.DogArt = { svg, LOOKS, look, piece, defs, bunBack, sausageArt, bunFront, BUN, SAUSAGE, COLOR, SAUCES, OUT };
})();
