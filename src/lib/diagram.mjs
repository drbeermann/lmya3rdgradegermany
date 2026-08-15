// Coaching-diagram renderer: a tiny declarative DSL → inline SVG.
//
// Coordinates are in yards. (0,0) is the top-left of the drawing area; the
// diagram is `w` × `h` yards. Elements:
//   { t:'grid',   x,y,w,h, dashed?, label?, cones?:false, c? }  cone-marked area
//   { t:'zone',   x,y,w,h, tone?:'red'|'dark' }         shaded area
//   { t:'field',  x,y,w,h, buildout? }                  7v7 field with markings
//   { t:'goal',   x,y, w?, side:'top'|'bottom'|'left'|'right', small? }
//   { t:'cone',   x,y, c? }                             c: orange|red|blue|yellow|white
//   { t:'disc',   x,y, c? }                             flat marker
//   { t:'gate',   x,y, w?, vertical?, c? }              two cones forming a gate
//   { t:'player', x,y, team?:'a'|'b'|'c', label?, ball? }
//        team a = our players (white), b = defenders/opponents (black), c = coach (red)
//   { t:'coach',  x,y, label?, ball? }
//   { t:'gk',     x,y, label?, ball? }
//   { t:'ball',   x,y }   { t:'balls', x,y }             one ball / a pile of balls
//   { t:'pass'|'run'|'dribble'|'shot'|'throw', from:[x,y], to:[x,y], via?:[x,y], n? }
//   { t:'text',   x,y, s, size?, anchor?, tone?, bold? }
// Top-level: { w, h, title, legend?:false, items:[...] }

const SCALE = 12; // px per yard
const PAD = 22; // px around the drawing area

const C = {
  ink: '#111111',
  soft: '#8b8f96',
  line: '#c9cbd0',
  grass: '#eef1ea',
  grassLine: '#cfd5c7',
  red: '#d61f26',
  orange: '#f28c28',
  yellow: '#f2c94c',
  blue: '#3b6fd6',
  white: '#ffffff',
  silver: '#c9cbd0',
};
const CONE = { orange: C.orange, red: C.red, blue: C.blue, yellow: C.yellow, white: C.white };
const FONT = 'font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"';

// yards → px
const X = (v) => PAD + v * SCALE;
const Y = (v) => PAD + v * SCALE;
const f = (n) => Number(n).toFixed(1);

/* ---------- pixel-space primitives ---------- */

function coneP(cx, cy, color = 'orange') {
  const s = 5.2;
  const fill = CONE[color] || CONE.orange;
  const stroke = color === 'white' ? C.soft : 'rgba(0,0,0,.35)';
  return `<path d="M ${f(cx - s)} ${f(cy + s * 0.9)} L ${f(cx)} ${f(cy - s)} L ${f(cx + s)} ${f(cy + s * 0.9)} Z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}
function discP(cx, cy, color = 'orange') {
  const fill = CONE[color] || CONE.orange;
  return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="5" ry="3.2" fill="${fill}" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`;
}
function ballP(cx, cy) {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="3.6" fill="${C.white}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="${f(cx)}" cy="${f(cy)}" r="1.3" fill="${C.ink}"/>`;
}
function playerP(cx, cy, team = 'a', label = '', hasBall = false) {
  const r = 7.5;
  const style = {
    a: { fill: C.white, stroke: C.ink, text: C.ink },
    b: { fill: C.ink, stroke: C.ink, text: C.white },
    c: { fill: C.red, stroke: C.red, text: C.white },
    gk: { fill: C.yellow, stroke: C.ink, text: C.ink },
  }[team] || { fill: C.white, stroke: C.ink, text: C.ink };
  let out = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${style.fill}" stroke="${style.stroke}" stroke-width="1.6"/>`;
  if (label !== '' && label != null) {
    const fs = String(label).length > 1 ? 6.5 : 8.5;
    out += `<text x="${f(cx)}" y="${f(cy + 3)}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${style.text}" ${FONT}>${label}</text>`;
  }
  if (hasBall) out += ballP(cx + 10, cy + 8);
  return out;
}

/* ---------- yard-space elements ---------- */

function pathD(from, to, via) {
  if (via) return `M ${f(X(from[0]))} ${f(Y(from[1]))} Q ${f(X(via[0]))} ${f(Y(via[1]))} ${f(X(to[0]))} ${f(Y(to[1]))}`;
  return `M ${f(X(from[0]))} ${f(Y(from[1]))} L ${f(X(to[0]))} ${f(Y(to[1]))}`;
}

// Wavy line for a dribble: sample along the (possibly curved) path and offset
// perpendicular by a sine wave that fades out before the arrowhead.
function wavyD(from, to, via) {
  const P = (t) => {
    if (!via) return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
    const mt = 1 - t;
    return [
      mt * mt * from[0] + 2 * mt * t * via[0] + t * t * to[0],
      mt * mt * from[1] + 2 * mt * t * via[1] + t * t * to[1],
    ];
  };
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) * SCALE;
  const steps = Math.max(14, Math.round(len / 2.5));
  const amp = 2.4;
  const waves = Math.max(2, Math.round(len / 13));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [x, y] = P(t);
    const [xa, ya] = P(Math.min(1, t + 0.01));
    const [xb, yb] = P(Math.max(0, t - 0.01));
    const dx = xa - xb, dy = ya - yb;
    const d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d, ny = dx / d;
    const env = t < 0.88 ? 1 : (1 - t) / 0.12;
    const off = Math.sin(t * Math.PI * 2 * waves) * amp * env;
    pts.push(`${f(X(x) + nx * off)} ${f(Y(y) + ny * off)}`);
  }
  return `M ${pts.join(' L ')}`;
}

function goal(g) {
  const w = g.w ?? 6;
  const depth = g.small ? 1 : 1.6;
  let x, y, W, H;
  switch (g.side || 'top') {
    case 'top': x = g.x - w / 2; y = g.y - depth; W = w; H = depth; break;
    case 'bottom': x = g.x - w / 2; y = g.y; W = w; H = depth; break;
    case 'left': x = g.x - depth; y = g.y - w / 2; W = depth; H = w; break;
    case 'right': x = g.x; y = g.y - w / 2; W = depth; H = w; break;
  }
  return `<rect x="${f(X(x))}" y="${f(Y(y))}" width="${f(W * SCALE)}" height="${f(H * SCALE)}" fill="url(#net)" stroke="${C.ink}" stroke-width="2.2"/>`;
}

function field(fl) {
  // A 7v7 field: goal areas, penalty areas, penalty spots, halfway line,
  // center circle and (optionally) build-out lines. Proportions are
  // approximate — a teaching picture, not a survey.
  const { x, y, w, h } = fl;
  const parts = [];
  const R = (X0, Y0, W, H) =>
    `<rect x="${f(X(X0))}" y="${f(Y(Y0))}" width="${f(W * SCALE)}" height="${f(H * SCALE)}" fill="none" stroke="${C.grassLine}" stroke-width="2"/>`;
  const L = (x1, y1, x2, y2, extra = '') =>
    `<line x1="${f(X(x1))}" y1="${f(Y(y1))}" x2="${f(X(x2))}" y2="${f(Y(y2))}" stroke="${C.grassLine}" stroke-width="2" ${extra}/>`;
  parts.push(`<rect x="${f(X(x))}" y="${f(Y(y))}" width="${f(w * SCALE)}" height="${f(h * SCALE)}" fill="${C.grass}" stroke="${C.grassLine}" stroke-width="2"/>`);
  const vertical = h >= w;
  if (vertical) {
    const pw = Math.min(w * 0.6, 24), pd = h * 0.2, gw = pw / 2, gd = pd / 3;
    parts.push(R(x + (w - pw) / 2, y, pw, pd), R(x + (w - pw) / 2, y + h - pd, pw, pd));
    parts.push(R(x + (w - gw) / 2, y, gw, gd), R(x + (w - gw) / 2, y + h - gd, gw, gd));
    parts.push(L(x, y + h / 2, x + w, y + h / 2));
    parts.push(`<circle cx="${f(X(x + w / 2))}" cy="${f(Y(y + h / 2))}" r="${f(h * 0.1 * SCALE)}" fill="none" stroke="${C.grassLine}" stroke-width="2"/>`);
    parts.push(`<circle cx="${f(X(x + w / 2))}" cy="${f(Y(y + pd * 0.66))}" r="1.6" fill="${C.grassLine}"/>`);
    parts.push(`<circle cx="${f(X(x + w / 2))}" cy="${f(Y(y + h - pd * 0.66))}" r="1.6" fill="${C.grassLine}"/>`);
    if (fl.buildout) {
      const b1 = y + (pd + h / 2) / 2, b2 = y + h - (pd + h / 2) / 2;
      for (const by of [b1, b2]) {
        parts.push(`<line x1="${f(X(x))}" y1="${f(Y(by))}" x2="${f(X(x + w))}" y2="${f(Y(by))}" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 4"/>`);
      }
    }
    parts.push(goal({ x: x + w / 2, y, w: 6, side: 'top' }), goal({ x: x + w / 2, y: y + h, w: 6, side: 'bottom' }));
  } else {
    const pd = w * 0.2, pw = Math.min(h * 0.6, 24), gd = pd / 3, gw = pw / 2;
    parts.push(R(x, y + (h - pw) / 2, pd, pw), R(x + w - pd, y + (h - pw) / 2, pd, pw));
    parts.push(R(x, y + (h - gw) / 2, gd, gw), R(x + w - gd, y + (h - gw) / 2, gd, gw));
    parts.push(L(x + w / 2, y, x + w / 2, y + h));
    parts.push(`<circle cx="${f(X(x + w / 2))}" cy="${f(Y(y + h / 2))}" r="${f(w * 0.1 * SCALE)}" fill="none" stroke="${C.grassLine}" stroke-width="2"/>`);
    parts.push(`<circle cx="${f(X(x + pd * 0.66))}" cy="${f(Y(y + h / 2))}" r="1.6" fill="${C.grassLine}"/>`);
    parts.push(`<circle cx="${f(X(x + w - pd * 0.66))}" cy="${f(Y(y + h / 2))}" r="1.6" fill="${C.grassLine}"/>`);
    if (fl.buildout) {
      const b1 = x + (pd + w / 2) / 2, b2 = x + w - (pd + w / 2) / 2;
      for (const bx of [b1, b2]) {
        parts.push(`<line x1="${f(X(bx))}" y1="${f(Y(y))}" x2="${f(X(bx))}" y2="${f(Y(y + h))}" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 4"/>`);
      }
      parts.push(`<text x="${f(X(b1))}" y="${f(Y(y) - 6)}" text-anchor="middle" font-size="8" fill="${C.red}" font-weight="700" ${FONT}>build-out line</text>`);
      parts.push(`<text x="${f(X(b2))}" y="${f(Y(y) - 6)}" text-anchor="middle" font-size="8" fill="${C.red}" font-weight="700" ${FONT}>build-out line</text>`);
    }
    parts.push(goal({ x, y: y + h / 2, w: 6, side: 'left' }), goal({ x: x + w, y: y + h / 2, w: 6, side: 'right' }));
  }
  return parts.join('');
}

function line(kind, from, to, via, n) {
  const common = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  let out = '';
  switch (kind) {
    case 'pass':
      out = `<path d="${pathD(from, to, via)}" ${common} stroke="${C.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>`;
      break;
    case 'throw': {
      const v = via || [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - Math.max(2, Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.35)];
      out = `<path d="${pathD(from, to, v)}" ${common} stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ah-ink)"/>`;
      via = v;
      break;
    }
    case 'run':
      out = `<path d="${pathD(from, to, via)}" ${common} stroke="${C.ink}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ah-ink)"/>`;
      break;
    case 'dribble':
      out = `<path d="${wavyD(from, to, via)}" ${common} stroke="${C.ink}" stroke-width="1.7" marker-end="url(#ah-ink)"/>`;
      break;
    case 'shot':
      out = `<path d="${pathD(from, to, via)}" ${common} stroke="${C.red}" stroke-width="3" marker-end="url(#ah-red)"/>`;
      break;
  }
  if (n != null) {
    const mx = via ? 0.25 * from[0] + 0.5 * via[0] + 0.25 * to[0] : (from[0] + to[0]) / 2;
    const my = via ? 0.25 * from[1] + 0.5 * via[1] + 0.25 * to[1] : (from[1] + to[1]) / 2;
    out += `<circle cx="${f(X(mx))}" cy="${f(Y(my))}" r="6" fill="${C.white}" stroke="${C.ink}" stroke-width="1"/><text x="${f(X(mx))}" y="${f(Y(my) + 2.6)}" text-anchor="middle" font-size="7.5" font-weight="700" fill="${C.ink}" ${FONT}>${n}</text>`;
  }
  return out;
}

function legend(h, used) {
  const y = PAD + h * SCALE + 16;
  const all = [
    ['cone', coneP(0, y, 'orange'), 'cone'],
    ['player', playerP(0, y, 'a'), 'player'],
    ['defender', playerP(0, y, 'b'), 'defender'],
    ['coach', playerP(0, y, 'c', 'C'), 'coach'],
    ['gk', playerP(0, y, 'gk', 'GK'), 'keeper'],
    ['pass', `<path d="M -8 ${y} L 12 ${y}" stroke="${C.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>`, 'pass'],
    ['run', `<path d="M -8 ${y} L 12 ${y}" stroke="${C.ink}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ah-ink)"/>`, 'run'],
    ['dribble', `<path d="M -8 ${y} q 2.5 -3 5 0 t 5 0 t 5 0 t 5 0" fill="none" stroke="${C.ink}" stroke-width="1.7" marker-end="url(#ah-ink)"/>`, 'dribble'],
    ['shot', `<path d="M -8 ${y} L 12 ${y}" stroke="${C.red}" stroke-width="3" marker-end="url(#ah-red)"/>`, 'shot'],
    ['throw', `<path d="M -8 ${y} Q 2 ${y - 8} 12 ${y}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ah-ink)"/>`, 'throw'],
  ].filter(([key]) => used.has(key));
  let x = PAD + 8;
  const out = [];
  for (const [, icon, label] of all) {
    out.push(`<g transform="translate(${x} 0)">${icon}<text x="16" y="${y + 3}" font-size="8.5" fill="${C.soft}" ${FONT}>${label}</text></g>`);
    x += 16 + label.length * 5 + 18;
  }
  return out.join('');
}

let seq = 0;

export function diagram(spec) {
  const uid = `d${++seq}`;
  const w = spec.w ?? 30;
  const h = spec.h ?? 20;
  const showLegend = spec.legend !== false;
  const items = spec.items || [];
  const layers = { base: [], marks: [], lines: [], actors: [], text: [] };
  const used = new Set();

  for (const it of items) {
    switch (it.t) {
      case 'field':
        layers.base.push(field(it));
        break;
      case 'zone':
        layers.base.push(`<rect x="${f(X(it.x))}" y="${f(Y(it.y))}" width="${f(it.w * SCALE)}" height="${f(it.h * SCALE)}" fill="${it.tone === 'red' ? 'rgba(214,31,38,.08)' : it.tone === 'dark' ? 'rgba(17,17,17,.07)' : C.grass}" rx="2"/>`);
        break;
      case 'grid': {
        layers.base.push(`<rect x="${f(X(it.x))}" y="${f(Y(it.y))}" width="${f(it.w * SCALE)}" height="${f(it.h * SCALE)}" fill="${it.fill === false ? 'none' : C.grass}" stroke="${C.line}" stroke-width="1.5" ${it.dashed ? 'stroke-dasharray="4 4"' : ''} rx="2"/>`);
        if (it.cones !== false) {
          used.add('cone');
          for (const [cx, cy] of [[it.x, it.y], [it.x + it.w, it.y], [it.x, it.y + it.h], [it.x + it.w, it.y + it.h]]) {
            layers.marks.push(coneP(X(cx), Y(cy), it.c || 'orange'));
          }
        }
        if (it.label) layers.text.push(`<text x="${f(X(it.x + it.w / 2))}" y="${f(Y(it.y + it.h) - 5)}" text-anchor="middle" font-size="8.5" fill="${C.soft}" ${FONT}>${it.label}</text>`);
        break;
      }
      case 'goal':
        layers.marks.push(goal(it));
        break;
      case 'cone':
        used.add('cone');
        layers.marks.push(coneP(X(it.x), Y(it.y), it.c));
        break;
      case 'disc':
        layers.marks.push(discP(X(it.x), Y(it.y), it.c));
        break;
      case 'gate': {
        used.add('cone');
        const half = (it.w ?? 2) / 2;
        if (it.vertical) layers.marks.push(coneP(X(it.x), Y(it.y - half), it.c), coneP(X(it.x), Y(it.y + half), it.c));
        else layers.marks.push(coneP(X(it.x - half), Y(it.y), it.c), coneP(X(it.x + half), Y(it.y), it.c));
        break;
      }
      case 'player':
        used.add(it.team === 'b' ? 'defender' : it.team === 'c' ? 'coach' : 'player');
        layers.actors.push(playerP(X(it.x), Y(it.y), it.team || 'a', it.label ?? '', !!it.ball));
        break;
      case 'coach':
        used.add('coach');
        layers.actors.push(playerP(X(it.x), Y(it.y), 'c', it.label ?? 'C', !!it.ball));
        break;
      case 'gk':
        used.add('gk');
        layers.actors.push(playerP(X(it.x), Y(it.y), 'gk', it.label ?? 'GK', !!it.ball));
        break;
      case 'ball':
        layers.actors.push(ballP(X(it.x), Y(it.y)));
        break;
      case 'balls':
        layers.actors.push(ballP(X(it.x), Y(it.y)), ballP(X(it.x) + 8, Y(it.y) + 5), ballP(X(it.x) - 7, Y(it.y) + 6));
        break;
      case 'pass':
      case 'run':
      case 'dribble':
      case 'shot':
      case 'throw':
        used.add(it.t);
        layers.lines.push(line(it.t, it.from, it.to, it.via, it.n));
        break;
      case 'text':
        layers.text.push(`<text x="${f(X(it.x))}" y="${f(Y(it.y))}" text-anchor="${it.anchor || 'middle'}" font-size="${it.size || 9}" font-weight="${it.bold ? 700 : 500}" fill="${it.tone === 'red' ? C.red : it.tone === 'soft' ? C.soft : C.ink}" ${FONT}>${it.s}</text>`);
        break;
      default:
        throw new Error(`Unknown diagram item type: ${it.t}`);
    }
  }

  const W = PAD * 2 + w * SCALE;
  const H = PAD * 2 + h * SCALE + (showLegend && used.size ? 26 : 0);
  const label = (spec.title || 'Drill diagram').replace(/"/g, '&quot;');
  return `<svg class="diagram" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
<defs>
  <marker id="ah-ink-${uid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${C.ink}"/></marker>
  <marker id="ah-red-${uid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${C.red}"/></marker>
  <pattern id="net-${uid}" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M 0 0 L 4 4 M 4 0 L 0 4" stroke="${C.soft}" stroke-width=".6"/></pattern>
</defs>
${layers.base.join('')}${layers.marks.join('')}${layers.lines.join('')}${layers.actors.join('')}${layers.text.join('')}
${showLegend && used.size ? legend(h, used) : ''}
</svg>`.replace(/url\(#(ah-ink|ah-red|net)\)/g, `url(#$1-${uid})`);
}
