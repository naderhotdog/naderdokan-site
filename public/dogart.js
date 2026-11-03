// Illustrated hotdogs (same artwork as the "build your own" game), for the homepage and menu.
(function () {
  const OUT = '#3A2418';
  const BUN = { plain: ['#F2B66B', '#D9893E'], sesame: ['#EDB067', '#CF8238'] };
  const SAUSAGE = { regular: ['#D8613F', '#A5381F'], smoked: ['#9C4A2C', '#6A2A16'], spicy: ['#E2462F', '#A8231A'] };
  const COLOR = { cheese: '#FFB627', pickles: '#7BA428', onion: '#EFE3F1', friedonion: '#B8742A', tomato: '#E2352B', mushroom: '#A98B6D', jalapeno: '#3E8E3A', lettuce: '#8BC34A', ketchup: '#C8102E', mustard: '#F2C200', mayo: '#FFF6D8', special: '#F08A3C' };
  const SAUCES = new Set(['ketchup', 'mustard', 'mayo', 'special']);
  const rnd = (s) => { let t = s * 9301 + 49297; return () => ((t = (t * 9301 + 49297) % 233280) / 233280); };
  let uid = 0;

  function piece(id, x, y, seed) {
    const r = rnd(seed + 3), c = COLOR[id] || '#C8102E';
    const spread = (n, w) => Array.from({ length: n }, (_, i) => x - w / 2 + (w / (n - 1)) * i + (r() * 8 - 4));
    switch (id) {
      case 'cheese': return `<path d="M${x-52} ${y-6} L${x+52} ${y-6} L${x+46} ${y+12} Q${x+30} ${y+4} ${x+24} ${y+18} Q${x+12} ${y+6} ${x+2} ${y+20} Q${x-10} ${y+6} ${x-20} ${y+16} Q${x-32} ${y+4} ${x-44} ${y+12} Z" fill="${c}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
      case 'pickles': return spread(3, 64).map((px) => `<ellipse cx="${px}" cy="${y + r() * 4}" rx="14" ry="10" fill="${c}" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="${px}" cy="${y}" rx="8" ry="5" fill="none" stroke="#C9DE8C" stroke-width="2"/>`).join('');
      case 'tomato': return spread(3, 64).map((px) => `<path d="M${px-15} ${y+6} A15 13 0 0 1 ${px+15} ${y+6} Z" fill="${c}" stroke="${OUT}" stroke-width="2.5"/><path d="M${px-9} ${y+5} A9 8 0 0 1 ${px+9} ${y+5}" fill="#F7836E"/>`).join('');
      case 'onion': return spread(3, 60).map((px) => `<ellipse cx="${px}" cy="${y+2}" rx="14" ry="8" fill="none" stroke="#B88CC6" stroke-width="5"/>`).join('');
      case 'friedonion': return Array.from({ length: 11 }, (_, i) => { const px = x - 44 + i * 9 + r() * 4, py = y + r() * 8 - 2; return `<path d="M${px} ${py+4} q4 -9 9 -2 q3 5 7 -1" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
      case 'mushroom': return spread(3, 60).map((px) => `<path d="M${px-13} ${y+4} Q${px-13} ${y-12} ${px} ${y-12} Q${px+13} ${y-12} ${px+13} ${y+4} Z" fill="${c}" stroke="${OUT}" stroke-width="2.5"/>`).join('');
      case 'jalapeno': return spread(4, 72).map((px) => `<circle cx="${px}" cy="${y + r() * 4}" r="10" fill="${c}" stroke="${OUT}" stroke-width="2.5"/><circle cx="${px}" cy="${y}" r="5" fill="#E8F5C8"/>`).join('');
      case 'lettuce': return `<path d="M${x-58} ${y+6} q10 -18 20 -4 q10 -18 20 -4 q10 -18 20 -4 q10 -18 20 -4 q10 -18 20 -4 q9 -14 16 4 Q${x} ${y+22} ${x-58} ${y+6} Z" fill="${c}" stroke="#4E7A1E" stroke-width="2.5" stroke-linejoin="round"/>`;
      default: {
        const pts = []; for (let k = 0, px = 44; px <= 356; px += 13, k++) pts.push(`${px},${y + (k % 2 ? -8 : 8)}`);
        const p = 'M' + pts.join(' L');
        return `<path d="${p}" fill="none" stroke="${OUT}" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><path d="${p}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    }
  }

  // DogArt.svg({ bun, sausage, layers: ['lettuce','cheese','ketchup'] })
  function svg({ bun = 'plain', sausage = 'regular', layers = [] } = {}) {
    const id = 'd' + (++uid);
    const g = (n, a, b) => `<linearGradient id="${n}${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
    let out = `<defs>${g('b', ...BUN[bun])}${g('s', ...SAUSAGE[sausage])}</defs>`;
    out += `<ellipse cx="200" cy="220" rx="170" ry="9" fill="#000" opacity=".22"/>`;
    out += `<path d="M34 128 C30 92 60 82 92 84 L308 84 C340 82 370 92 366 128 Z" fill="url(#b${id})" stroke="${OUT}" stroke-width="4"/>`;
    out += `<rect x="20" y="92" width="360" height="46" rx="23" fill="url(#s${id})" stroke="${OUT}" stroke-width="4"/><rect x="40" y="98" width="320" height="12" rx="6" fill="#fff" opacity=".28"/>`;
    if (sausage === 'smoked') out += [90, 150, 210, 270, 330].map((x) => `<path d="M${x} 96 l-14 38" stroke="#4A1C0C" stroke-width="4" opacity=".5"/>`).join('');
    const tops = layers.filter((l) => !SAUCES.has(l)), sauces = layers.filter((l) => SAUCES.has(l));
    // spread the toppings along the sausage so each one is visible
    tops.forEach((l, i) => {
      const n = tops.length, x = n === 1 ? 200 : 110 + (180 / (n - 1)) * i;
      out += piece(l, l === 'lettuce' || l === 'cheese' ? Math.max(120, Math.min(280, x)) : x, 104 - (i % 2) * 5, i * 17 + 5);
    });
    sauces.forEach((l, i) => { out += piece(l, 200, 112 - i * 7, 0); });
    const ses = bun === 'sesame' ? (() => { const r = rnd(7); return Array.from({ length: 22 }, (_, i) => { const x = 62 + i * 13 + r() * 6, y = 176 + Math.sin(i * 1.3) * 12 + r() * 6; return `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.3" fill="#FFF4DA"/>`; }).join(''); })() : '';
    out += `<path d="M28 122 Q22 206 96 212 L304 212 Q378 206 372 122 Q352 148 300 148 L100 148 Q48 148 28 122 Z" fill="url(#b${id})" stroke="${OUT}" stroke-width="4"/><path d="M60 184 Q200 204 340 184" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="8" stroke-linecap="round"/>${ses}`;
    return `<svg viewBox="0 40 400 192" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`;
  }

  // Default look for each menu hotdog (new items fall back to the classic look).
  const LOOKS = {
    classic: { bun: 'plain', sausage: 'regular', layers: ['ketchup', 'mustard'] },
    cheese: { bun: 'plain', sausage: 'regular', layers: ['cheese', 'friedonion', 'mayo'] },
    spicy: { bun: 'sesame', sausage: 'spicy', layers: ['jalapeno', 'friedonion', 'special'] },
    special: { bun: 'sesame', sausage: 'smoked', layers: ['lettuce', 'tomato', 'cheese', 'friedonion', 'pickles', 'mayo', 'ketchup'] },
  };
  window.DogArt = { svg, LOOKS };
})();
