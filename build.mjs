#!/usr/bin/env node
// Zero-dependency static site build. `node build.mjs` → dist/
// Reads src/data (content), renders src/templates to HTML, copies assets.

import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

import { layout } from './src/templates/layout.mjs';
import { homePage, weeksIndexPage, weekPage, runPage } from './src/templates/pages.mjs';
import {
  drillsIndexPage, drillFamilyPage, gamesIndexPage, gamePage, atHomePage, rulesPage, schedulePage, teamPage,
} from './src/templates/library.mjs';
import { crest } from './src/lib/crest.mjs';
import { team, season, site, calendar, events } from './src/data/season.mjs';
import { weeks } from './src/data/weeks.mjs';
import { drills } from './src/data/drills.mjs';
import { games } from './src/data/games.mjs';
import { videos } from './src/data/videos.mjs';
import { challenges } from './src/data/home.mjs';
import { rules } from './src/data/rules.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');
const CHECK = process.argv.includes('--check');

/* ---------- helpers ---------- */
const relFor = (route) => {
  const depth = route.split('/').filter(Boolean).length;
  return depth === 0 ? './' : '../'.repeat(depth);
};
async function write(route, html) {
  const dir = path.join(OUT, route);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.html'), html);
}
async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

/* ---------- content validation ---------- */
function validate() {
  const problems = [];
  const drillIds = new Set(drills.map((d) => d.id));
  const gameIds = new Set(games.map((g) => g.id));
  const chIds = new Set(challenges.map((c) => c.id));
  const videoKeys = new Set(Object.keys(videos));
  const missingVideos = new Set();
  for (const w of weeks) {
    for (const b of w.blocks) {
      if ((b.kind === 'drill' || b.kind === 'arrival') && !drillIds.has(b.drill)) problems.push(`Week ${w.n}: unknown drill "${b.drill}"`);
      if (b.kind === 'game' && !gameIds.has(b.game)) problems.push(`Week ${w.n}: unknown game "${b.game}"`);
      if (b.kind === 'drill' || b.kind === 'arrival') {
        const fam = drills.find((d) => d.id === b.drill);
        for (const n of b.levels) if (fam && !fam.levels.some((l) => l.n === n)) problems.push(`Week ${w.n}: ${b.drill} has no level ${n}`);
      }
    }
    if (!chIds.has(w.home.challenge)) problems.push(`Week ${w.n}: unknown challenge "${w.home.challenge}"`);
    const total = w.blocks.reduce((a, b) => a + b.minutes, 0);
    if (total !== 60) problems.push(`Week ${w.n}: blocks total ${total} minutes, not 60 (used by the practice timer)`);
    if (!w.goals || !w.goals.length) problems.push(`Week ${w.n}: no goals`);
  }
  const checkVid = (v) => { for (const k of Array.isArray(v) ? v : v ? [v] : []) if (!videoKeys.has(k)) missingVideos.add(k); };
  for (const d of drills) for (const l of d.levels) checkVid(l.video);
  for (const g of games) checkVid(g.video);
  for (const c of challenges) checkVid(c.video);
  for (const r of rules) checkVid(r.video);
  return { problems, missingVideos: [...missingVideos] };
}

/* ---------- generated files ---------- */
function icsForSeason() {
  // Practices and games from the league feed, with our weekly theme attached to
  // each practice. Times are written in UTC (Z), so calendars show local time.
  const esc = (t = '') => String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const stamp = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LMYA Germany//Season//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:Germany — ${team.league} ${team.division}`,
  ];
  for (const e of events) {
    if (!e.startISO) continue;
    const week = calendar.find((c) => e.date >= c.start && e.date <= c.end);
    const w = week ? weeks[week.n - 1] : null;
    const summary = e.type === 'practice' ? `Germany practice${w ? ` — Week ${week.n}: ${w.theme}` : ''}` : e.type === 'game' ? `Germany ${e.title}${e.home != null ? ` (${e.home ? 'home' : 'away'})` : ''}` : e.title;
    const desc = [e.type === 'practice' && w ? w.tagline : '', e.listedAs ? `Listed as: ${e.listedAs}` : '', e.rsvp ? `RSVP: ${e.rsvp}` : ''].filter(Boolean).join('\n');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid ? (e.uid.includes('@') ? e.uid : `${e.uid}@lmya-germany`) : `${e.type}-${e.date}@lmya-germany`}`,
      `DTSTAMP:${stamp(new Date().toISOString())}`,
      `DTSTART:${stamp(e.startISO)}`,
      e.endISO ? `DTEND:${stamp(e.endISO)}` : `DTEND:${stamp(e.startISO)}`,
      `SUMMARY:${esc(summary)}`,
      e.location ? `LOCATION:${esc(e.location)}` : null,
      desc ? `DESCRIPTION:${esc(desc)}` : null,
      'END:VEVENT'
    );
  }
  lines.push('END:VCALENDAR');
  return lines.filter(Boolean).join('\r\n') + '\r\n';
}

// Minimal PNG writer (RGBA) — used only for the 180×180 home-screen icon so
// we don't need an image library. Draws a black square with the badge rings.
function pngIcon(size = 180) {
  const px = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / size;
      let r = 10, g = 10, b = 10;
      if (d < 0.43) { r = 255; g = 255; b = 255; }
      if (d < 0.36 && d > 0.325) { r = 214; g = 31; b = 38; }
      if (d < 0.30 && d > 0.28) { r = 17; g = 17; b = 17; }
      const i = (y * size + x) * 4;
      px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
    }
  }
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const crcTable = new Int32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c;
  });
  const crc = (buf) => {
    let c = -1;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

function manifest() {
  return JSON.stringify(
    {
      name: `Germany — ${team.league} ${team.division}`,
      short_name: 'Germany',
      start_url: './',
      display: 'standalone',
      background_color: '#0a0a0a',
      theme_color: '#0a0a0a',
      icons: [
        { src: 'assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: 'assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  );
}

/* ---------- pages ---------- */
function pageList() {
  const pages = [
    { route: '', section: 'home', title: '', render: homePage },
    { route: 'weeks/', section: 'weeks', title: 'Season plan', render: weeksIndexPage },
    { route: 'drills/', section: 'drills', title: 'Drills', render: drillsIndexPage },
    { route: 'games/', section: 'games', title: 'Games', render: gamesIndexPage },
    { route: 'at-home/', section: 'at-home', title: 'At home', render: atHomePage },
    { route: 'rules/', section: 'rules', title: 'Rules', render: rulesPage },
    { route: 'schedule/', section: 'weeks', title: 'Schedule', render: schedulePage },
    { route: 'team/', section: 'team', title: 'Team', render: teamPage },
  ];
  for (const w of weeks) {
    pages.push({ route: `weeks/${w.n}/`, section: 'weeks', title: `Week ${w.n}: ${w.theme}`, render: (ctx) => weekPage(w, ctx) });
    pages.push({ route: `weeks/${w.n}/run/`, section: 'weeks', title: `Run practice — Week ${w.n}`, render: (ctx) => runPage(w, ctx) });
  }
  for (const d of drills) pages.push({ route: `drills/${d.id}/`, section: 'drills', title: d.name, render: (ctx) => drillFamilyPage(d, ctx) });
  for (const g of games) pages.push({ route: `games/${g.id}/`, section: 'games', title: g.name, render: (ctx) => gamePage(g, ctx) });
  return pages;
}

async function build() {
  const t0 = Date.now();
  const { problems, missingVideos } = validate();
  if (problems.length) {
    console.error('Content problems:\n  ' + problems.join('\n  '));
    process.exit(1);
  }
  if (CHECK) {
    console.log(`OK — ${weeks.length} weeks, ${drills.length} drill families (${drills.reduce((a, d) => a + d.levels.length, 0)} levels), ${games.length} games, ${challenges.length} challenges, ${Object.keys(videos).length} videos, ${events.length} schedule events (${events.filter((e) => e.type === 'practice').length} practices, ${events.filter((e) => e.type === 'game').length} games).`);
    if (missingVideos.length) console.log(`Video keys referenced but not in videos.mjs (cards are skipped): ${missingVideos.join(', ')}`);
    return;
  }

  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  // assets
  await copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));
  await fs.copyFile(path.join(SRC, 'styles', 'site.css'), path.join(OUT, 'assets', 'site.css'));
  await copyDir(path.join(SRC, 'js'), path.join(OUT, 'assets'));
  await fs.mkdir(path.join(OUT, 'docs'), { recursive: true });
  for (const f of ['LMYA-House-Rules-2026.pdf']) {
    try { await fs.copyFile(path.join(ROOT, 'docs', f), path.join(OUT, 'docs', f)); } catch { /* optional */ }
  }
  await fs.writeFile(path.join(OUT, 'assets', 'favicon.svg'), crest({ size: 64, className: 'crest', title: 'Germany' }));
  await fs.writeFile(path.join(OUT, 'assets', 'apple-touch-icon.png'), pngIcon(180));
  await fs.writeFile(path.join(OUT, 'manifest.webmanifest'), manifest());
  await fs.writeFile(path.join(OUT, 'germany-schedule.ics'), icsForSeason());
  await fs.writeFile(path.join(OUT, '.nojekyll'), '');
  if (site.domain) await fs.writeFile(path.join(OUT, 'CNAME'), site.domain.trim() + '\n');

  // pages
  const pages = pageList();
  const routes = [];
  for (const p of pages) {
    const rel = relFor(p.route);
    const out = p.render({ rel });
    const html = layout({
      title: p.title,
      body: out.body,
      rel,
      section: p.section,
      bodyClass: out.bodyClass || `page-${p.section}`,
      scripts: out.scripts || [],
      extraHead: out.extraHead || '',
      description: out.description,
    });
    await write(p.route, html);
    routes.push(p.route);
  }

  // service worker: precache every page + asset for use on the field
  const assetFiles = (await fs.readdir(path.join(OUT, 'assets'))).map((f) => 'assets/' + f);
  const precache = [...routes, ...assetFiles, 'manifest.webmanifest', 'germany-schedule.ics'];
  const swSrc = await fs.readFile(path.join(SRC, 'sw.template.js'), 'utf8');
  await fs.writeFile(path.join(OUT, 'sw.js'), swSrc.replaceAll('__PRECACHE__', JSON.stringify(precache)).replaceAll('__VERSION__', String(Date.now())));

  console.log(`Built ${pages.length} pages → dist/ in ${Date.now() - t0} ms`);
  if (missingVideos.length) console.log(`Note: ${missingVideos.length} video keys referenced but not in videos.mjs (cards skipped): ${missingVideos.join(', ')}`);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
