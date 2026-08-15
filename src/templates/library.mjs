import { esc, inline, md, list, fmtDate, fmtRange } from '../lib/html.mjs';
import { diagram } from '../lib/diagram.mjs';
import { team, calendar, season, events } from '../data/season.mjs';
import { weeks } from '../data/weeks.mjs';
import { drills, drillById } from '../data/drills.mjs';
import { games, gameById } from '../data/games.mjs';
import { challenges, challengeById } from '../data/home.mjs';
import { rules, quickFacts, rulesSource } from '../data/rules.mjs';
import { practiceFormat, principles, gearCoach, gearPlayer, gameDay } from '../data/coaching.mjs';
import { icon, pill, skillPill, levelCard, gameCard, challengeCard, levelBadge, videoCard, section, eventLine } from './components.mjs';

/* Which weeks use a given drill level / game / challenge */
function weeksUsingDrill(id, n) {
  return weeks.filter((w) =>
    w.blocks.some(
      (b) =>
        ((b.kind === 'drill' || b.kind === 'arrival') && b.drill === id && (n == null || b.levels.includes(n))) ||
        (b.kind === 'scrimmage' && (b.drills || []).some((x) => x.drill === id && (n == null || x.levels.includes(n))))
    )
  );
}
function weeksUsingGame(id) {
  return weeks.filter((w) => w.blocks.some((b) => b.kind === 'game' && b.game === id));
}
function weekChips(list, rel) {
  if (!list.length) return '<span class="muted small">Not scheduled yet — a good option to swap in.</span>';
  return list.map((w) => `<a class="chip-week" href="${rel}weeks/${w.n}/">W${w.n}</a>`).join('');
}

/* ================= DRILLS INDEX ================= */
export function drillsIndexPage({ rel }) {
  const cards = drills
    .map((d) => {
      const rungs = d.levels
        .map((l) => {
          const used = weeksUsingDrill(d.id, l.n);
          return `<li><a href="${rel}drills/${d.id}/#level-${l.n}">${levelBadge(l.n, d.levels.length)}<span class="rung-name">${esc(l.name)}</span><span class="rung-weeks">${used.map((w) => `W${w.n}`).join(' ')}</span></a></li>`;
        })
        .join('');
      return `<article class="card fam-block fam-${d.color}" id="${d.id}">
        <div class="fam-block-head">
          <h2><a href="${rel}drills/${d.id}/">${esc(d.name)}</a></h2>
          <p>${inline(d.summary)}</p>
        </div>
        <ol class="rungs">${rungs}</ol>
        <a class="btn btn-ghost btn-sm" href="${rel}drills/${d.id}/">Open progression ${icon('arrow')}</a>
      </article>`;
    })
    .join('');
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">Drills</p>
  <h1>Six skills, each a ladder</h1>
  <p class="lede">Every drill is a level of a progression: same setup, one new idea. Start where the group is, climb when about 80% of them can do it, drop back down when it falls apart. Each level has a diagram, coaching points, a question to ask, and an easier / harder version.</p>
  <div class="legend-card">
    <strong>Diagram key</strong>
    ${diagram({ w: 46, h: 7.5, legend: false, title: 'Diagram key', items: [
      { t: 'cone', x: 2, y: 2 }, { t: 'text', x: 3.4, y: 2.4, s: 'cone', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'player', x: 8.5, y: 2, label: '1' }, { t: 'text', x: 9.9, y: 2.4, s: 'player', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'player', x: 16.5, y: 2, team: 'b', label: 'D' }, { t: 'text', x: 17.9, y: 2.4, s: 'defender', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'coach', x: 26, y: 2 }, { t: 'text', x: 27.4, y: 2.4, s: 'coach', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'gk', x: 33.5, y: 2 }, { t: 'text', x: 34.9, y: 2.4, s: 'keeper', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'ball', x: 41.5, y: 2 }, { t: 'text', x: 42.6, y: 2.4, s: 'ball', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'pass', from: [1, 5.6], to: [6, 5.6] }, { t: 'text', x: 7, y: 6, s: 'pass', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'run', from: [11.5, 5.6], to: [16.5, 5.6] }, { t: 'text', x: 17.5, y: 6, s: 'run (no ball)', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'dribble', from: [25, 5.6], to: [30, 5.6] }, { t: 'text', x: 31, y: 6, s: 'dribble', anchor: 'start', size: 8.5, tone: 'soft' },
      { t: 'shot', from: [36.5, 5.6], to: [41.5, 5.6] }, { t: 'text', x: 42.6, y: 6, s: 'shot', anchor: 'start', size: 8.5, tone: 'soft' },
    ] })}
    <p class="small muted">Solid arrow = pass or shot (ball moves). Dashed arrow = player run without the ball. Wavy = dribble. Red = shot. Numbers show the order.</p>
  </div>
</section>
<section class="wrap fam-list">${cards}</section>`;
  return { body };
}

/* ================= DRILL FAMILY PAGE ================= */
export function drillFamilyPage(d, { rel }) {
  const idx = drills.findIndex((x) => x.id === d.id);
  const prev = drills[idx - 1];
  const next = drills[idx + 1];
  const stepper = d.levels
    .map((l) => `<a class="stepper-item" href="#level-${l.n}"><span class="stepper-n">L${l.n}</span><span class="stepper-name">${esc(l.name)}</span><span class="stepper-weeks">${weeksUsingDrill(d.id, l.n).map((w) => `W${w.n}`).join(' ') || '—'}</span></a>`)
    .join('');
  const levels = d.levels
    .map((l) => {
      const used = weeksUsingDrill(d.id, l.n);
      return `${levelCard(d, l, { rel })}<p class="used-in">${icon('calendar')} Used in: ${weekChips(used, rel)}</p>`;
    })
    .join('');
  const body = `
<section class="wrap page-head fam-${d.color}">
  <p class="eyebrow"><a href="${rel}drills/">Drills</a> · ${d.levels.length}-level progression</p>
  <h1>${esc(d.name)}</h1>
  <p class="lede">${inline(d.summary)}</p>
  <div class="why card">
    <h2 class="card-title">${icon('info')} Why it matters</h2>
    ${md(d.why)}
    <h3 class="sub-title">${icon('whistle')} Fundamentals at every level</h3>
    ${list(d.fundamentals, 'cues')}
  </div>
  <nav class="stepper" aria-label="Levels">${stepper}</nav>
</section>
<section class="wrap levels">${levels}</section>
<section class="wrap week-foot">
  ${prev ? `<a class="btn btn-ghost" href="${rel}drills/${prev.id}/">${icon('back')} ${esc(prev.name)}</a>` : '<span></span>'}
  ${next ? `<a class="btn btn-ghost" href="${rel}drills/${next.id}/">${esc(next.name)} ${icon('arrow')}</a>` : ''}
</section>`;
  return { body };
}

/* ================= GAMES INDEX ================= */
export function gamesIndexPage({ rel }) {
  const skills = [...new Set(games.flatMap((g) => g.skills))];
  const cards = games
    .map((g) => {
      const used = weeksUsingGame(g.id);
      return `<a class="game-tile" href="${rel}games/${g.id}/" data-skills="${g.skills.join(' ')}" data-home="${g.atHome ? '1' : '0'}">
        <span class="game-tile-name">${esc(g.name)}</span>
        <span class="game-tile-hook">${esc(g.hook)}</span>
        <span class="game-tile-meta">${icon('users')} ${esc(g.players)} &nbsp; ${icon('clock')} ${esc(g.minutes)} min</span>
        <span class="game-tile-tags">${g.skills.map(skillPill).join('')}${g.atHome ? '<em class="tag-home">at home</em>' : ''}</span>
        <span class="game-tile-weeks">${used.map((w) => `W${w.n}`).join(' ') || ''}</span>
      </a>`;
    })
    .join('');
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">Games &amp; challenges</p>
  <h1>Small games kids ask for</h1>
  <p class="lede">Fifteen to twenty minutes of every practice is games — the skills from the drills, hidden inside something with a score. Most of these work in a backyard too: look for the <em class="tag-home">at home</em> tag.</p>
  <div class="filters" id="game-filters" role="group" aria-label="Filter games">
    <button class="filter is-on" type="button" data-filter="all">All</button>
    ${skills.map((s) => `<button class="filter" type="button" data-filter="${esc(s)}">${esc(s)}</button>`).join('')}
    <button class="filter filter-home" type="button" data-filter="home">${icon('home')} At home</button>
  </div>
</section>
<section class="wrap"><div class="game-grid" id="game-grid">${cards}</div></section>`;
  return { body, scripts: ['filters.js'] };
}

/* ================= GAME PAGE ================= */
export function gamePage(g, { rel }) {
  const idx = games.findIndex((x) => x.id === g.id);
  const prev = games[idx - 1];
  const next = games[idx + 1];
  const used = weeksUsingGame(g.id);
  const body = `
<section class="wrap page-head">
  <p class="eyebrow"><a href="${rel}games/">Games</a> · ${g.skills.map(skillPill).join(' ')}${g.atHome ? ' <em class="tag-home">at home</em>' : ''}</p>
  <h1>${esc(g.name)}</h1>
  <p class="lede">${esc(g.hook)}</p>
</section>
<section class="wrap">
  ${gameCard(g, { rel })}
  <p class="used-in">${icon('calendar')} Used in: ${weekChips(used, rel)}</p>
</section>
<section class="wrap week-foot">
  ${prev ? `<a class="btn btn-ghost" href="${rel}games/${prev.id}/">${icon('back')} ${esc(prev.name)}</a>` : '<span></span>'}
  ${next ? `<a class="btn btn-ghost" href="${rel}games/${next.id}/">${esc(next.name)} ${icon('arrow')}</a>` : ''}
</section>`;
  return { body };
}

/* ================= AT HOME ================= */
export function atHomePage({ rel }) {
  const w1 = weeks[0];
  const weekly = weeks
    .map((w) => {
      const c = challengeById[w.home.challenge];
      const cal = calendar[w.n - 1];
      return `<li data-week="${w.n}" data-start="${cal.start}" data-end="${cal.end}"><a href="#ch-${c.id}"><span class="wk-n">W${w.n}</span><span class="ch-icon">${c.icon}</span><span><strong>${esc(c.name)}</strong><small>${esc(w.home.note || c.metric)}</small></span></a></li>`;
    })
    .join('');
  const cards = challenges.map((c) => challengeCard(c, { rel })).join('');
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">At home</p>
  <h1>Five minutes a day beats an hour on Wednesday</h1>
  <p class="lede">One challenge is assigned each week at the huddle — it matches what we practiced. Each has three levels: <strong>Rookie</strong>, <strong>Starter</strong>, <strong>Captain</strong>. Kids type their best score into the card and this page remembers it (on that phone or computer — nothing is uploaded anywhere). Beat your own record, not anyone else's.</p>
  <div class="card athome-week" id="athome-week">
    <h2 class="card-title">${icon('star')} This week's challenge</h2>
    <div id="athome-current"></div>
    <details class="more"><summary>All ten weeks</summary><ol class="weekly-list" id="weekly-list">${weekly}</ol></details>
  </div>
  <div class="athome-actions">
    <button class="btn btn-ghost" type="button" data-print>${icon('print')} Print the challenge card</button>
    <button class="btn btn-ghost btn-sm" type="button" id="pb-reset">Reset my scores</button>
  </div>
</section>
<section class="wrap ch-grid">${cards}</section>
<section class="wrap band">
  <h2>Watch: at-home routines</h2>
  <div class="cols-2">${videoCard(['home-workout', 'ball-mastery-homework'], rel)}</div>
</section>
<section class="wrap band">
  <h2>For parents</h2>
  <div class="cols-2">
    <div>
      <p><strong>Keep it short and fun.</strong> Five focused minutes with a ball beats an hour of nagging. Do it together when you can — kids love beating a parent at toe taps.</p>
      <p><strong>Ask, don't fix.</strong> "What would make you faster?" works better than instructions. Celebrate the record, not the number: going from 3 juggles to 4 is a big deal.</p>
    </div>
    <div>
      <p><strong>Space & gear.</strong> Any patch of grass or a driveway. Shoes, cups and sticks make fine cones. A wall or garage door is a great passing partner (ask first).</p>
      <p><strong>Safety.</strong> No heading at this age. Shin guards for anything with a sibling. Soft balls indoors.</p>
    </div>
  </div>
</section>
<section class="print-card" aria-hidden="true">
  <h2>Germany · At-home challenge card</h2>
  <table>
    <thead><tr><th>Week</th><th>Challenge</th><th>Rookie</th><th>Starter</th><th>Captain</th><th>My best</th></tr></thead>
    <tbody>${weeks.map((w) => { const c = challengeById[w.home.challenge]; return `<tr><td>W${w.n}</td><td>${esc(c.name)} <small>(${esc(c.metric)})</small></td>${c.levels.map((l) => `<td>${c.lowerIsBetter ? '≤' : ''}${l.target}</td>`).join('')}<td></td></tr>`; }).join('')}</tbody>
  </table>
</section>`;
  return { body, scripts: ['athome.js'] };
}

/* ================= RULES ================= */
export function rulesPage({ rel }) {
  const toc = rules.map((r) => `<a href="#${r.id}">${esc(r.title)}</a>`).join('');
  const sections = rules
    .map(
      (r) => `<article class="card rule" id="${r.id}">
      <h2>${esc(r.title)}</h2>
      <div class="level-body">
        <div class="level-text">
          ${md(r.summary)}
          ${r.kids?.length ? section('What we tell the kids', list(r.kids, 'cues'), { icon: 'whistle' }) : ''}
          ${r.coach ? `<p class="ask">${icon('info')}<span><strong>Coach note:</strong> ${inline(r.coach)}</span></p>` : ''}
          ${r.saturday?.length ? section('What this means on Saturday', list(r.saturday), { icon: 'flag' }) : ''}
        </div>
        ${r.diagram || r.video ? `<div class="level-media">${r.diagram ? `<div class="dia">${diagram(r.diagram)}</div>` : ''}${videoCard(r.video, rel)}</div>` : ''}
      </div>
    </article>`
    )
    .join('');
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">Rules</p>
  <h1>3rd grade rules, in plain English</h1>
  <p class="lede">A digest of the <a href="${rel}${rulesSource.file}">${esc(rulesSource.title)}</a> as it applies to our division, plus what we tell the kids and what it means on game day. The PDF is the source of truth; where it is silent, IFAB Laws of the Game apply.</p>
  <div class="card facts">
    <h2 class="card-title">${icon('info')} Quick facts</h2>
    <dl class="facts-list">${quickFacts.map((f) => `<div><dt>${esc(f.k)}</dt><dd>${inline(f.v)}</dd></div>`).join('')}</dl>
  </div>
  <nav class="toc" aria-label="Rules sections">${toc}</nav>
</section>
<section class="wrap rules-list">${sections}</section>
<section class="wrap band">
  <p class="small muted">Full documents: <a href="${rel}${rulesSource.file}">House Rules 2026 (PDF)</a> · <a href="${esc(rulesSource.conduct)}" target="_blank" rel="noopener">LMYA rules &amp; conduct</a> · <a href="https://www.theifab.com/laws" target="_blank" rel="noopener">IFAB Laws of the Game</a></p>
</section>`;
  return { body };
}

/* ================= SCHEDULE ================= */
export function schedulePage({ rel }) {
  const typeBadge = (t) => `<span class="ev-type ev-type-${t}">${t === 'game' ? 'Game' : t === 'practice' ? 'Practice' : 'Event'}</span>`;
  const rows = calendar
    .map((c) => {
      const w = weeks[c.n - 1];
      const evs = c.events.length
        ? c.events
            .map(
              (e) => `<li class="ev ev-${e.type}">
              ${typeBadge(e.type)}
              <span class="ev-when">${fmtDate(e.date, { weekday: true })} · ${esc(e.when)}</span>
              <span class="ev-title">${e.type === 'game' ? `<strong>${esc(e.title)}</strong>${e.home != null ? ` <span class="muted">(${e.home ? 'home' : 'away'})</span>` : ''}` : e.type === 'practice' ? `<span class="muted">Week ${c.n}: ${esc(w.theme)}</span>` : esc(e.title)}</span>
              <span class="ev-where">${e.location ? (e.directions ? `<a href="${esc(e.directions)}" target="_blank" rel="noopener">${icon('pin')} ${esc(e.location)}</a>` : `${icon('pin')} ${esc(e.location)}`) : ''}</span>
              ${e.rsvp ? `<a class="ev-rsvp" href="${esc(e.rsvp)}" target="_blank" rel="noopener">RSVP ${icon('arrow')}</a>` : ''}
            </li>`
            )
            .join('')
        : '<li class="ev ev-none"><span>Nothing on the league schedule this week.</span></li>';
      const noGame = !c.game ? (c.notes.find((n) => /no games/i.test(n)) ? `<li class="ev ev-none"><span>${icon('flag')} No games — Labor Day weekend</span></li>` : `<li class="ev ev-none"><span>${icon('flag')} Game not on the league schedule yet</span></li>`) : '';
      const notes = c.notes.filter((n) => !/no games/i.test(n));
      return `<article class="sched-week" data-week="${c.n}" data-start="${c.start}" data-end="${c.end}">
        <header class="sched-head">
          <a class="sched-title" href="${rel}weeks/${c.n}/"><span class="wk-n">Week ${c.n}</span> <span class="sched-theme">${esc(w.theme)}</span></a>
          <span class="sched-dates">${fmtRange(c.start, c.end)}</span>
          <span class="wk-current-badge">This week</span>
        </header>
        <ul class="ev-list">${evs}${noGame}</ul>
        ${notes.length ? `<p class="wk-note">${esc(notes.join(' · '))}</p>` : ''}
      </article>`;
    })
    .join('');
  const firstP = team.practice;
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">Schedule</p>
  <h1>Practices &amp; games</h1>
  <p class="lede">Practices are ${esc(firstP.day)}s ${esc(firstP.time)} at ${esc(firstP.location)}. Games are ${esc(team.gameDay)}s — times, fields and opponents below come straight from the LMYA schedule (${events.length} events; last games ${fmtDate(season.lastGames, { weekday: true })}). RSVP links open the league site.</p>
  <div class="hero-actions">
    <a class="btn btn-ghost" href="${rel}germany-schedule.ics" download>${icon('calendar')} Add everything to my calendar (.ics)</a>
    ${firstP.directions ? `<a class="btn btn-ghost" href="${esc(firstP.directions)}" target="_blank" rel="noopener">${icon('pin')} Directions to practice</a>` : ''}
    <a class="btn btn-ghost" href="${esc(season.leagueSchedule)}" target="_blank" rel="noopener">${icon('flag')} League schedule</a>
  </div>
</section>
<section class="wrap sched-list">${rows}</section>`;
  return { body, scripts: ['home.js'] };
}

/* ================= TEAM ================= */
export function teamPage({ rel }) {
  const p = team.practice;
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">Team</p>
  <h1>${esc(team.name)}</h1>
  <p class="lede">${esc(team.league)} · ${esc(team.division)} · ${esc(team.format)}. Coached by ${team.coaches.map((c) => esc(c.name)).join(' and ')}.</p>
  <ul class="plain when-list team-when">
    <li>${icon('calendar')} <strong>Practice</strong> ${esc(p.day)}s ${esc(p.time)} · ${p.directions ? `<a href="${esc(p.directions)}" target="_blank" rel="noopener">${esc(p.location)}</a>` : esc(p.location)}</li>
    <li>${icon('flag')} <strong>Games</strong> ${esc(team.gameDay)}s — see the <a href="${rel}schedule/">schedule</a> for times, fields and opponents</li>
    <li>${icon('ball')} <strong>Ball</strong> ${esc(team.ball)} · <strong>Colors</strong> ${esc(team.colors)}</li>
  </ul>
</section>
<section class="wrap band">
  <h2>What a practice looks like</h2>
  <p class="lede small">Same shape every week so the kids know what's coming — the order matters more than the clock.</p>
  <ol class="format-list">${practiceFormat.map((f) => `<li><span class="fmt-time">${esc(f.t)}</span><span class="fmt-body">${inline(f.d)}</span></li>`).join('')}</ol>
</section>
<section class="wrap band cols-2">
  <div class="card side-card"><h3 class="card-title">${icon('gear')} Players bring</h3>${list(gearPlayer)}</div>
  <div class="card side-card"><h3 class="card-title">${icon('flag')} Game day for families</h3>
    <ul>${gameDay.map((g) => `<li><strong>${esc(g.t)}.</strong> ${inline(g.d)}</li>`).join('')}</ul>
    <div class="videos" style="margin-top:.6rem">${videoCard('warmup', rel)}</div>
  </div>
</section>
<section class="wrap band coaches-corner">
  <details class="corner">
    <summary>${icon('whistle')} Coaches' corner <span class="muted">— how we run things</span></summary>
    <div class="corner-body">
      <h4>How we coach</h4>
      <div class="principles">${principles.map((x) => `<div class="principle"><strong>${esc(x.t)}</strong><p>${inline(x.d)}</p></div>`).join('')}</div>
      <h4>Coaches bring</h4>
      ${list(gearCoach)}
      <p class="small muted">Rules digest: <a href="${rel}rules/">rules</a>. Practice timer: on each week page under Coaches' corner.</p>
    </div>
  </details>
</section>`;
  return { body };
}
