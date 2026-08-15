import { esc, inline, md, list, fmtDate, fmtRange } from '../lib/html.mjs';
import { diagram } from '../lib/diagram.mjs';
import { videos } from '../data/videos.mjs';
import { drillById } from '../data/drills.mjs';
import { gameById } from '../data/games.mjs';
import { challengeById } from '../data/home.mjs';

/* ---------- icons (inline SVG, currentColor) ---------- */
const ICONS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="3"/><path d="M15.5 14.5a5.5 5.5 0 0 1 6 5.5"/>',
  space: '<path d="M4 6h16v12H4z"/><path d="M12 6v12M4 12h16"/>',
  gear: '<path d="M6 20l6-16 6 16z"/><path d="M8.5 14h7"/>',
  play: '<path d="M8 6v12l10-6z"/>',
  print: '<path d="M7 9V4h10v5M7 17H4v-6h16v6h-3"/><path d="M7 14h10v6H7z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 5h-5L8 10z"/><path d="M12 3v4M20.5 9.5l-4.5.5M17 20l-2.5-5M7 20l2.5-5M3.5 9.5l4.5.5"/>',
  whistle: '<path d="M14 6l3-3M8 9h8a4 4 0 1 1 0 8h-1l-3-3H8a4 4 0 0 1 0-8z"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7"/><path d="M12 17h.01"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  yt: '<path d="M4 8.5a2.5 2.5 0 0 1 2.2-2.5C8 5.8 12 5.8 12 5.8s4 0 5.8.2A2.5 2.5 0 0 1 20 8.5v7a2.5 2.5 0 0 1-2.2 2.5c-1.8.2-5.8.2-5.8.2s-4 0-5.8-.2A2.5 2.5 0 0 1 4 15.5z"/><path d="M10 9.5v5l4.5-2.5z"/>',
  ig: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><path d="M16.5 7.5h.01"/>',
};
export function icon(name, cls = '') {
  const d = ICONS[name] || ICONS.info;
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

/* ---------- small pieces ---------- */
export const pill = (text, cls = '') => `<span class="pill ${cls}">${inline(text)}</span>`;
export const skillPill = (s) => `<span class="pill pill-skill pill-${esc(s)}">${esc(s)}</span>`;

export function metaStrip(items) {
  return `<ul class="meta">${items
    .filter((i) => i && i.v)
    .map((i) => `<li>${icon(i.icon)}<span class="meta-k">${esc(i.k)}</span><span class="meta-v">${inline(i.v)}</span></li>`)
    .join('')}</ul>`;
}

export function section(title, body, opts = {}) {
  if (!body) return '';
  return `<section class="${opts.cls || 'sub'}"><h4 class="sub-title">${opts.icon ? icon(opts.icon) : ''}${esc(title)}</h4>${body}</section>`;
}

/* ---------- video ---------- */
export function videoCard(keys, rel = '', cls = '') {
  if (!keys) return '';
  const list = Array.isArray(keys) ? keys : [keys];
  const cards = list.map((k) => oneVideo(k)).filter(Boolean);
  if (!cards.length) return '';
  return `<div class="videos${cls ? ` ${cls}` : ''}">${cards.join('')}</div>`;
}
function oneVideo(key) {
  const v = videos[key];
  if (!v) return '';
  if (v.ig) {
    return `<a class="video-link" href="${esc(v.ig)}" target="_blank" rel="noopener">${icon('ig')}<span><strong>${esc(v.title || 'Watch on Instagram')}</strong>${v.note ? `<small>${esc(v.note)}</small>` : ''}</span>${icon('arrow')}</a>`;
  }
  const params = ['autoplay=1', 'rel=0', 'modestbranding=1', 'playsinline=1'];
  if (v.start) params.push(`start=${v.start}`);
  if (v.end) params.push(`end=${v.end}`);
  const url = `https://www.youtube-nocookie.com/embed/${esc(v.yt)}?${params.join('&')}`;
  const watch = `https://www.youtube.com/watch?v=${esc(v.yt)}${v.start ? `&t=${v.start}s` : ''}`;
  return `<figure class="video" data-embed="${esc(url)}">
  <button class="video-facade" type="button" aria-label="Play video: ${esc(v.title)}">
    <img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.yt)}/hqdefault.jpg" alt="" width="480" height="360">
    <span class="video-play">${icon('play')}</span>
    ${v.len ? `<span class="video-len">${esc(v.len)}</span>` : ''}
  </button>
  <figcaption><strong>${esc(v.title)}</strong>${v.channel ? ` <span class="video-channel">${esc(v.channel)}</span>` : ''}${v.note ? `<span class="video-note">${inline(v.note)}</span>` : ''} <a class="video-ext" href="${watch}" target="_blank" rel="noopener">${icon('yt')} YouTube</a></figcaption>
</figure>`;
}

/* ---------- drills ---------- */
export function levelBadge(n, total, cls = '') {
  return `<span class="lvl ${cls}" aria-label="Level ${n} of ${total}"><span class="lvl-n">L${n}</span><span class="lvl-pips">${Array.from({ length: total }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span></span>`;
}

export function levelCard(family, level, { rel = '', compact = false, id = '' } = {}) {
  const total = family.levels.length;
  const anchor = id || `level-${level.n}`;
  const dia = level.diagram ? `<div class="dia">${diagram(level.diagram)}</div>` : '';
  const meta = metaStrip([
    { icon: 'users', k: 'Players', v: level.players },
    { icon: 'space', k: 'Space', v: level.space },
    { icon: 'clock', k: 'Time', v: level.time },
    { icon: 'gear', k: 'Equipment', v: level.equipment },
  ]);
  return `<article class="card level-card${compact ? ' level-card--compact' : ''}" id="${anchor}">
  <header class="level-head">
    ${levelBadge(level.n, total)}
    <h3 class="level-name">${compact ? `<a href="${rel}drills/${family.id}/#level-${level.n}">${esc(level.name)}</a>` : esc(level.name)}</h3>
    ${compact ? `<span class="level-family">${esc(family.name)}</span>` : ''}
  </header>
  ${meta}
  <div class="level-body">
    <div class="level-text">
      ${section('Set up', md(level.setup))}
      ${section('How it works', md(level.how))}
      ${section('Coaching points', list(level.cues, 'cues'), { icon: 'whistle' })}
      ${level.ask ? `<p class="ask">${icon('question')}<span><strong>Ask them:</strong> ${inline(level.ask)}</span></p>` : ''}
      <div class="step">
        ${level.easier ? `<div class="step-item step-easier"><strong>Easier</strong><span>${inline(level.easier)}</span></div>` : ''}
        ${level.harder ? `<div class="step-item step-harder"><strong>Harder</strong><span>${inline(level.harder)}</span></div>` : ''}
      </div>
      ${level.mistakes && level.mistakes.length ? `<details class="more"><summary>Common mistakes</summary>${list(level.mistakes)}</details>` : ''}
    </div>
    ${dia ? `<div class="level-media">${dia}</div>` : ''}
    ${videoCard(level.video, rel, 'level-videos')}
  </div>
</article>`;
}

/* ---------- games ---------- */
export function gameCard(game, { rel = '', compact = false, note = '' } = {}) {
  const dia = game.diagram ? `<div class="dia">${diagram(game.diagram)}</div>` : '';
  const meta = metaStrip([
    { icon: 'users', k: 'Players', v: game.players },
    { icon: 'space', k: 'Space', v: game.space },
    { icon: 'clock', k: 'Time', v: game.minutes ? `${game.minutes} min` : '' },
    { icon: 'gear', k: 'Equipment', v: game.equipment },
  ]);
  return `<article class="card game-card${compact ? ' game-card--compact' : ''}" id="${compact ? `game-${game.id}` : 'game'}">
  <header class="level-head">
    <span class="lvl lvl-game">${icon('bolt')}<span class="lvl-n">Game</span></span>
    <h3 class="level-name">${compact ? `<a href="${rel}games/${game.id}/">${esc(game.name)}</a>` : esc(game.name)}</h3>
    <span class="level-family">${esc(game.hook)}</span>
  </header>
  ${note ? `<p class="block-note">${icon('info')}${inline(note)}</p>` : ''}
  ${meta}
  <div class="level-body">
    <div class="level-text">
      ${section('Set up', md(game.setup))}
      ${section('How to play', md(game.how))}
      ${section('Scoring', md(game.scoring))}
      ${section('Coaching points', list(game.cues, 'cues'), { icon: 'whistle' })}
      ${game.variations && game.variations.length ? `<details class="more"${compact ? '' : ' open'}><summary>Make it harder / variations</summary>${list(game.variations)}</details>` : ''}
      ${game.home && game.home !== '—' ? `<div class="athome-tip">${icon('home')}<span><strong>At home:</strong> ${inline(game.home)}</span></div>` : ''}
    </div>
    ${dia ? `<div class="level-media">${dia}</div>` : ''}
    ${videoCard(game.video, rel, 'level-videos')}
  </div>
</article>`;
}

/* ---------- at-home challenges ---------- */
export function challengeCard(ch, { rel = '', compact = false, note = '' } = {}) {
  const levels = ch.levels
    .map((l) => `<li class="ch-level"><span class="ch-level-name">${esc(l.name)}</span><span class="ch-level-target">${ch.lowerIsBetter ? '≤ ' : ''}${l.target}</span>${l.note ? `<small>${esc(l.note)}</small>` : ''}</li>`)
    .join('');
  return `<article class="card ch-card" id="ch-${ch.id}" data-challenge="${ch.id}" data-lower="${ch.lowerIsBetter ? '1' : '0'}" data-targets="${ch.levels.map((l) => l.target).join(',')}">
  <header class="ch-head">
    <span class="ch-icon" aria-hidden="true">${ch.icon || '⚽'}</span>
    <div>
      <h3 class="level-name">${compact ? `<a href="${rel}at-home/#ch-${ch.id}">${esc(ch.name)}</a>` : esc(ch.name)}</h3>
      <span class="level-family">${esc(ch.metric)}</span>
    </div>
  </header>
  ${note ? `<p class="block-note">${icon('info')}${inline(note)}</p>` : ''}
  <div class="level-body">
    <div class="level-text">
      ${md(ch.how)}
      <ol class="ch-levels">${levels}</ol>
      ${ch.tips ? `<p class="ch-tip">${icon('whistle')}<span>${inline(ch.tips)}</span></p>` : ''}
      ${ch.parent ? `<p class="ch-tip ch-parent">${icon('users')}<span><strong>Parents:</strong> ${inline(ch.parent)}</span></p>` : ''}
    </div>
    <div class="level-media">
      <form class="pb" data-pb="${ch.id}">
        <label class="pb-label" for="pb-${ch.id}">My best <small>(${esc(ch.metric)})</small></label>
        <div class="pb-row">
          <input id="pb-${ch.id}" class="pb-input" type="number" inputmode="numeric" min="0" step="1" placeholder="—">
          <button class="btn btn-sm" type="submit">Save</button>
        </div>
        <p class="pb-status" aria-live="polite"></p>
      </form>
      ${videoCard(ch.video, rel)}
    </div>
  </div>
</article>`;
}

/* ---------- week pieces ---------- */
export const KIND_LABEL = { arrival: 'Arrival', drill: 'Drill', game: 'Game', scrimmage: 'Scrimmage', huddle: 'Huddle' };
export const GROUPS = [
  { key: 'arrival', label: 'Arrival', lede: 'Grab a ball and get going while everyone arrives.' },
  { key: 'drill', label: 'Drills', lede: 'Small groups, lots of touches — one rung up the ladder from last week.' },
  { key: 'game', label: 'Games', lede: 'The same skills, hidden inside something with a score.' },
  { key: 'scrimmage', label: 'Scrimmage', lede: 'A real game with real rules, and one thing to focus on.' },
  { key: 'huddle', label: 'Huddle', lede: 'Bring it in: one question, one cheer, and this week\'s at-home challenge.' },
];

export function blockTitle(block) {
  switch (block.kind) {
    case 'arrival':
      return 'Arrival: ball mastery';
    case 'drill': {
      const fam = drillById[block.drill];
      const names = block.levels.map((n) => fam.levels.find((l) => l.n === n)?.name).filter(Boolean);
      return `${fam.short}: ${names.join(' → ')}`;
    }
    case 'game':
      return gameById[block.game].name;
    case 'scrimmage':
      return `Scrimmage: ${block.title}`;
    case 'huddle':
      return 'Huddle';
  }
  return block.kind;
}

export function blockShort(block) {
  switch (block.kind) {
    case 'arrival':
      return block.note || '';
    case 'drill': {
      const fam = drillById[block.drill];
      return block.levels.map((n) => `Level ${n} of ${fam.levels.length}`).join(', ');
    }
    case 'game':
      return gameById[block.game].hook;
    case 'scrimmage':
      return (block.cues || [])[0] || '';
    case 'huddle':
      return block.note || '';
  }
  return '';
}

export function timeline(week) {
  const total = week.blocks.reduce((a, b) => a + b.minutes, 0);
  let t = 0;
  const segs = week.blocks
    .map((b, i) => {
      const start = t;
      t += b.minutes;
      const w = ((b.minutes / total) * 100).toFixed(2);
      return `<a class="tl-seg tl-${b.kind}${b.minutes <= 5 ? ' tl-narrow' : ''}" style="--w:${w}%" href="#block-${i + 1}" title="${esc(blockTitle(b))} · ${b.minutes} min · starts ${mmss(start)}"><span class="tl-label">${esc(KIND_LABEL[b.kind])}</span><span class="tl-min">${b.minutes}′</span><span class="tl-start">${mmss(start)}</span></a>`;
    })
    .join('');
  return `<div class="timeline" role="navigation" aria-label="Practice timeline (${total} minutes)">${segs}</div>`;
}

export function mmss(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

export function weekEquipment(week) {
  const items = new Set();
  for (const b of week.blocks) {
    if (b.kind === 'drill' || b.kind === 'arrival') {
      const fam = drillById[b.drill];
      for (const n of b.levels) {
        const lv = fam.levels.find((l) => l.n === n);
        if (lv?.equipment) items.add(lv.equipment);
      }
    }
    if (b.kind === 'game') items.add(gameById[b.game].equipment);
  }
  items.add('Pinnies and 2 goals for the scrimmage');
  return [...items];
}

export function weekCard(week, cal, rel = '', { current = false } = {}) {
  const drills = week.blocks.filter((b) => b.kind === 'drill').map((b) => drillById[b.drill].short);
  const games = week.blocks.filter((b) => b.kind === 'game').map((b) => gameById[b.game].name);
  const g = cal.game;
  const gameLine = g
    ? `${fmtDate(g.date, { weekday: true })} · ${esc(g.time)} · ${esc(g.title)}`
    : cal.notes.find((n) => /no games/i.test(n)) ? 'No game — Labor Day weekend' : 'No game on the league schedule yet';
  const notes = cal.notes.filter((n) => !/no games/i.test(n));
  return `<a class="wk-card${current ? ' is-current' : ''}" href="${rel}weeks/${week.n}/" data-week="${week.n}" data-start="${cal.start}" data-end="${cal.end}">
  <span class="wk-n">Week ${week.n}</span>
  <span class="wk-dates">${fmtRange(cal.start, cal.end)}</span>
  <span class="wk-theme">${esc(week.theme)}</span>
  <span class="wk-tag">${esc(week.tagline)}</span>
  <span class="wk-line"><strong>Drills</strong> ${esc(drills.join(' · '))}</span>
  <span class="wk-line"><strong>Games</strong> ${esc(games.join(' · '))}</span>
  <span class="wk-line wk-game"><strong>Game</strong> ${gameLine}</span>
  ${notes.length ? `<p class="wk-note">${esc(notes.join(' · '))}</p>` : ''}
  <span class="wk-current-badge">This week</span>
</a>`;
}

/* ---------- schedule pieces ---------- */
// One line for a practice or game: "Wed Aug 19 · 6:00–7:00 pm · Lafayette Elementary (Field #2)"
export function eventLine(ev, { withDate = true } = {}) {
  if (!ev) return '';
  const parts = [];
  if (withDate) parts.push(fmtDate(ev.date, { weekday: true }));
  parts.push(esc(ev.when));
  if (ev.type === 'game') parts.push(`<strong>${esc(ev.title)}</strong>${ev.home != null ? ` <span class="muted">(${ev.home ? 'home' : 'away'})</span>` : ''}`);
  if (ev.location) parts.push(ev.directions ? `<a href="${esc(ev.directions)}" target="_blank" rel="noopener">${esc(ev.location)}</a>` : esc(ev.location));
  return parts.join(' · ');
}

// Practice + game summary for a week, as icon items (used in the hero and week head)
export function whenItems(cal, { noGameText = 'No game this weekend' } = {}) {
  const item = (ic, html) => `<span class="when-item">${icon(ic)}<span class="when-text">${html}</span></span>`;
  const items = [];
  const p = cal.practice;
  items.push(item('calendar', p ? `Practice ${eventLine(p)}` : 'No practice this week'));
  const g = cal.game;
  if (g) items.push(item('flag', `Game ${eventLine(g)}`));
  else if (cal.notes.some((n) => /no games/i.test(n))) items.push(item('flag', 'No games — Labor Day weekend'));
  else items.push(item('flag', noGameText));
  for (const o of cal.others || []) items.push(item('star', `${esc(o.title)} ${eventLine(o)}`));
  return items.join('');
}

export function homeChallengeChip(week, rel = '') {
  const ch = challengeById[week.home.challenge];
  return `<a class="chip-home" href="${rel}at-home/#ch-${ch.id}"><span class="ch-icon">${ch.icon}</span><span><strong>${esc(ch.name)}</strong><small>${esc(ch.metric)}</small></span></a>`;
}

export { fmtDate, fmtRange };
