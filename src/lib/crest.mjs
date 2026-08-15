// Team crest, drawn to echo the jersey badge: segmented black ring, red inner
// ring, an arc of red stars, a black eagle and "GERMANY" along the bottom.
// `mono` uses currentColor for the black parts so it can sit on a dark header.

function star(cx, cy, r, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.42;
    const a = ((rot + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}"/>`;
}

export function crest({ size = 64, mono = false, className = 'crest', title = 'Germany crest' } = {}) {
  const ink = mono ? 'currentColor' : '#111111';
  const red = '#d61f26';
  const paper = mono ? 'none' : '#ffffff';
  const stars = [];
  for (let i = 0; i < 7; i++) {
    const a = ((-160 + i * 23.3) * Math.PI) / 180;
    const cx = 100 + 62 * Math.cos(a);
    const cy = 100 + 62 * Math.sin(a);
    stars.push(star(cx, cy, 7));
  }
  const ringLen = 2 * Math.PI * 92;
  const seg = ringLen / 4 - 14;
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<circle cx="100" cy="100" r="99" fill="${paper}"/>
<circle cx="100" cy="100" r="92" fill="none" stroke="${ink}" stroke-width="7" stroke-dasharray="${seg.toFixed(1)} 14" transform="rotate(-70 100 100)"/>
<circle cx="100" cy="100" r="80" fill="none" stroke="${red}" stroke-width="4"/>
<g fill="${red}">${stars.join('')}</g>
<g fill="${ink}">
  <circle cx="100" cy="64" r="8.5"/>
  <polygon points="93,61.5 82,66 93,68.5"/>
  <rect x="95.5" y="66" width="9" height="16"/>
  <ellipse cx="100" cy="98" rx="11" ry="22"/>
  <polygon points="92,84 58,66 64,81 49,84 62,94 52,101 66,105 60,115 75,110 92,110"/>
  <polygon points="108,84 142,66 136,81 151,84 138,94 148,101 134,105 140,115 125,110 108,110"/>
  <polygon points="91,114 109,114 113,137 106,132 100,141 94,132 87,137"/>
</g>
<defs><path id="crest-arc" d="M 40 100 A 60 60 0 0 0 160 100"/></defs>
<text font-family="'Barlow Condensed', 'Arial Narrow', Impact, sans-serif" font-weight="800" font-size="17" letter-spacing="2.4" fill="${ink}"><textPath href="#crest-arc" startOffset="50%" text-anchor="middle">GERMANY</textPath></text>
</svg>`;
}
