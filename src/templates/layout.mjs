import { esc } from '../lib/html.mjs';
import { crest } from '../lib/crest.mjs';
import { team } from '../data/season.mjs';
import { icon } from './components.mjs';

const NAV = [
  { href: '', label: 'This week', id: 'home' },
  { href: 'weeks/', label: 'Season', id: 'weeks' },
  { href: 'drills/', label: 'Drills', id: 'drills' },
  { href: 'games/', label: 'Games', id: 'games' },
  { href: 'at-home/', label: 'At home', id: 'at-home' },
  { href: 'rules/', label: 'Rules', id: 'rules' },
  { href: 'team/', label: 'Team', id: 'team' },
];

export function layout({ title, description = '', body, rel = '', section = '', bodyClass = '', extraHead = '', scripts = [] }) {
  const fullTitle = title ? `${title} · Germany` : `Germany · ${team.league} ${team.division}`;
  const nav = NAV.map(
    (n) => `<a href="${rel}${n.href}"${section === n.id ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || `${team.name} — ${team.league} ${team.division} team site: weekly practice plans, drill progressions, games, at-home challenges and rules.`)}">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:type" content="website">
<link rel="icon" href="${rel}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${rel}assets/apple-touch-icon.png">
<link rel="manifest" href="${rel}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rel}assets/site.css">
${extraHead}
</head>
<body class="${esc(bodyClass)}" data-rel="${rel}">
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <div class="wrap topbar-inner">
    <a class="brand" href="${rel}">
      ${crest({ size: 40, mono: true, className: 'crest brand-crest' })}
      <span class="brand-text"><span class="brand-name">Germany</span><span class="brand-sub">${esc(team.league)} · ${esc(team.division)}</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icon('menu')}<span>Menu</span></button>
    <nav class="nav" id="site-nav" aria-label="Site">${nav}</nav>
  </div>
</header>
<main id="main" class="main">
${body}
</main>
<footer class="footer">
  <div class="wrap footer-inner">
    <div class="footer-brand">
      ${crest({ size: 56, mono: true, className: 'crest' })}
      <div>
        <strong>${esc(team.name)}</strong> · ${esc(team.league)} ${esc(team.division)} · ${esc(team.format)}<br>
        Coaches ${team.coaches.map((c) => esc(c.name)).join(' & ')}<br>
        Practice ${esc(team.practice.day)}s ${esc(team.practice.time)} · ${esc(team.practice.location)}
      </div>
    </div>
    <nav class="footer-nav" aria-label="Footer">${nav}<a href="${rel}schedule/">Schedule</a></nav>
    <p class="footer-fine">Rules summarized from the LMYA House Rules 2026 — the <a href="${rel}docs/LMYA-House-Rules-2026.pdf">full PDF</a> is the source of truth. Videos belong to their creators and open in place from YouTube.</p>
  </div>
</footer>
<script type="module" src="${rel}assets/site.js"></script>
${scripts.map((s) => `<script type="module" src="${rel}assets/${s}"></script>`).join('\n')}
</body>
</html>`;
}
