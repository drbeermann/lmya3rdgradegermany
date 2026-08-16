import { esc, inline, md, list, fmtDate, fmtRange } from '../lib/html.mjs';
import { diagram } from '../lib/diagram.mjs';
import { crest } from '../lib/crest.mjs';
import { team, calendar } from '../data/season.mjs';
import { weeks } from '../data/weeks.mjs';
import { drills, drillById } from '../data/drills.mjs';
import { games, gameById } from '../data/games.mjs';
import { challenges, challengeById } from '../data/home.mjs';
import { rules } from '../data/rules.mjs';
import {
  icon, pill, levelCard, gameCard, challengeCard, weekCard, GROUPS, blockHref,
  blockTitle, KIND_LABEL, mmss, homeChallengeChip, videoCard, section, whenItems, eventLine,
} from './components.mjs';

const calFor = (n) => calendar[n - 1];

/* ================= HOME ================= */
export function homePage({ rel }) {
  const w = weeks[0];
  const cal = calFor(w.n);
  const summaries = weeks.map((wk) => {
    const c = calFor(wk.n);
    const evJson = (e) => (e ? { date: e.date, when: e.when, time: e.time, title: e.title, location: e.location, home: e.home ?? null, directions: e.directions || null } : null);
    return {
      n: wk.n, theme: wk.theme, tagline: wk.tagline, goals: wk.goals || [], start: c.start, end: c.end,
      practice: evJson(c.practice), game: evJson(c.game), noGameNote: c.notes.find((n) => /no games/i.test(n)) || null,
      drills: wk.blocks.map((b, i) => ({ b, i })).filter(({ b }) => b.kind === 'drill').map(({ b, i }) => ({ title: blockTitle(b), href: blockHref(rel, wk.n, i) })),
      games: wk.blocks.map((b, i) => ({ b, i })).filter(({ b }) => b.kind === 'game').map(({ b, i }) => ({ title: gameById[b.game].name, href: blockHref(rel, wk.n, i) })),
      scrimmage: (() => { const i = wk.blocks.findIndex((b) => b.kind === 'scrimmage'); return { title: wk.blocks[i]?.title || '', href: blockHref(rel, wk.n, i) }; })(),
      home: challengeById[wk.home.challenge].name,
      homeId: wk.home.challenge,
      homeIcon: challengeById[wk.home.challenge].icon,
      homeHref: `${rel}at-home/#ch-${wk.home.challenge}`,
    };
  });

  const hero = heroFor(w, cal, rel);

  const familyCards = drills
    .map(
      (d) => `<a class="fam-card fam-${d.color}" href="${rel}drills/${d.id}/">
      <span class="fam-name">${esc(d.name)}</span>
      <span class="fam-levels">${d.levels.length} levels</span>
      <span class="fam-sum">${esc(d.summary)}</span>
      <span class="fam-ladder">${d.levels.map((l) => `<i title="L${l.n}: ${esc(l.name)}"></i>`).join('')}</span>
    </a>`
    )
    .join('');

  const body = `
<section class="hero" id="hero">
  ${hero}
</section>

<section class="wrap band">
  <div class="band-head">
    <h2>The season at a glance</h2>
    <a class="more-link" href="${rel}weeks/">All weeks ${icon('arrow')}</a>
  </div>
  <div class="wk-grid" id="week-grid">
    ${weeks.map((wk) => weekCard(wk, calFor(wk.n), rel, { current: wk.n === 1 })).join('')}
  </div>
</section>

<section class="wrap band">
  <div class="band-head">
    <h2>Drills are progressions</h2>
    <a class="more-link" href="${rel}drills/">All drills ${icon('arrow')}</a>
  </div>
  <p class="lede">Every drill on this site is one rung of a ladder from easy to hard. We start where the kids are and climb one level at a time — same setup, one new idea.</p>
  <div class="fam-grid">${familyCards}</div>
</section>

<section class="wrap band band-split">
  <div>
    <div class="band-head"><h2>Games kids ask for</h2><a class="more-link" href="${rel}games/">All games ${icon('arrow')}</a></div>
    <ul class="link-list">
      ${games.slice(0, 8).map((g) => `<li><a href="${rel}games/${g.id}/"><strong>${esc(g.name)}</strong><span>${esc(g.hook)}</span>${g.atHome ? '<em class="tag-home">at home</em>' : ''}</a></li>`).join('')}
    </ul>
  </div>
  <div>
    <div class="band-head"><h2>At home this week</h2><a class="more-link" href="${rel}at-home/">All challenges ${icon('arrow')}</a></div>
    <div id="home-challenge-slot">${homeChallengeChip(w, rel)}</div>
    <p class="lede small">Ten five-minute challenges, three levels each. Kids save their best score right on the page — no accounts, it just remembers on that phone.</p>
    <div class="band-head"><h2>New rules this year</h2><a class="more-link" href="${rel}rules/">Rules digest ${icon('arrow')}</a></div>
    <ul class="link-list">
      ${rules.slice(0, 4).map((r) => `<li><a href="${rel}rules/#${r.id}"><strong>${esc(r.title)}</strong></a></li>`).join('')}
    </ul>
  </div>
</section>
<script type="application/json" id="week-data">${JSON.stringify({ weeks: summaries, team: { practiceDay: team.practice.day, practiceTime: team.practice.time, location: team.practice.location, gameDay: team.gameDay } })}</script>
`;
  return { body, scripts: ['home.js'] };
}

function heroFor(w, cal, rel) {
  const indexed = w.blocks.map((b, i) => ({ b, i }));
  const drillBlocks = indexed.filter(({ b }) => b.kind === 'drill');
  const gameBlocks = indexed.filter(({ b }) => b.kind === 'game');
  const scrim = indexed.find(({ b }) => b.kind === 'scrimmage');
  return `<div class="wrap hero-inner">
    <div class="hero-text">
      <p class="eyebrow" id="hero-eyebrow">Week ${w.n} · ${fmtRange(cal.start, cal.end)}</p>
      <h1 class="display" id="hero-title">${esc(w.theme)}</h1>
      <p class="hero-tag" id="hero-tagline">${esc(w.tagline)}</p>
      <p class="hero-when" id="hero-when">${whenItems(cal)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" id="hero-cta" href="${rel}weeks/${w.n}/">Open the plan ${icon('arrow')}</a>
        <a class="btn btn-ghost" href="${rel}schedule/">${icon('calendar')} Schedule</a>
      </div>
    </div>
    <div class="hero-plan" id="hero-plan">
      <div class="hp-goals"><span class="hp-k">This week we're working on</span><ul class="hp-goal-list">${(w.goals || []).map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
      <div class="hp-col"><span class="hp-k">Drills</span>${drillBlocks.map(({ b, i }) => `<a class="hp-v" href="${blockHref(rel, w.n, i)}">${esc(blockTitle(b))}</a>`).join('')}</div>
      <div class="hp-col"><span class="hp-k">Games</span>${gameBlocks.map(({ b, i }) => `<a class="hp-v" href="${blockHref(rel, w.n, i)}">${esc(gameById[b.game].name)}</a>`).join('')}</div>
      <div class="hp-col"><span class="hp-k">Scrimmage</span><a class="hp-v" href="${blockHref(rel, w.n, scrim.i)}">${esc(scrim.b.title)}</a></div>
      <div class="hp-col"><span class="hp-k">At home</span><a class="hp-v" href="${rel}at-home/#ch-${w.home.challenge}">${challengeById[w.home.challenge].icon} ${esc(challengeById[w.home.challenge].name)}</a></div>
    </div>
  </div>
  <div class="hero-crest" aria-hidden="true">${crest({ size: 260, mono: true, className: 'crest crest-bg' })}</div>`;
}

/* ================= WEEKS INDEX ================= */
export function weeksIndexPage({ rel }) {
  const body = `
<section class="wrap page-head">
  <p class="eyebrow">Season plan</p>
  <h1>Ten weeks, one hour each</h1>
  <p class="lede">Every practice has the same shape — <strong>arrival ball mastery → two drills → games → scrimmage → huddle</strong> — and each week climbs one rung on a few progressions. Tap a week for its goals, the drills and games with diagrams and videos, and that week's game details.</p>
</section>
<section class="wrap">
  <div class="wk-grid" id="week-grid">${weeks.map((wk) => weekCard(wk, calFor(wk.n), rel)).join('')}</div>
</section>
<section class="wrap band">
  <h2>How the progressions climb</h2>
  <p class="lede small">Which level of each skill family we use each week. Blank means that family rests that week.</p>
  <div class="table-scroll"><table class="ladder-table">
    <thead><tr><th>Skill</th>${weeks.map((wk) => `<th><a href="${rel}weeks/${wk.n}/">W${wk.n}</a></th>`).join('')}</tr></thead>
    <tbody>
    ${drills
      .map((d) => {
        const cells = weeks
          .map((wk) => {
            const lv = [];
            for (const b of wk.blocks) {
              if ((b.kind === 'drill' || b.kind === 'arrival') && b.drill === d.id) lv.push(...b.levels);
              if (b.kind === 'scrimmage' && b.drills) for (const x of b.drills) if (x.drill === d.id) lv.push(...x.levels);
            }
            const u = [...new Set(lv)].sort((a, b) => a - b);
            return `<td>${u.length ? `<span class="ladder-cell">${u.map((n) => `<a href="${rel}drills/${d.id}/#level-${n}">L${n}</a>`).join(' ')}</span>` : ''}</td>`;
          })
          .join('');
        return `<tr><th><a href="${rel}drills/${d.id}/">${esc(d.short)}</a></th>${cells}</tr>`;
      })
      .join('')}
    <tr><th>Games</th>${weeks.map((wk) => `<td><span class="ladder-cell small">${wk.blocks.filter((b) => b.kind === 'game').map((b) => `<a href="${rel}games/${b.game}/">${esc(gameById[b.game].name.split(' (')[0])}</a>`).join('<br>')}</span></td>`).join('')}</tr>
    <tr><th>Scrimmage focus</th>${weeks.map((wk) => `<td><span class="ladder-cell small"><a href="${blockHref(rel, wk.n, wk.blocks.findIndex((b) => b.kind === 'scrimmage'))}">${esc(wk.blocks.find((b) => b.kind === 'scrimmage').title)}</a></span></td>`).join('')}</tr>
    <tr><th>At home</th>${weeks.map((wk) => `<td><span class="ladder-cell small"><a href="${rel}at-home/#ch-${wk.home.challenge}">${challengeById[wk.home.challenge].icon} ${esc(challengeById[wk.home.challenge].name)}</a></span></td>`).join('')}</tr>
    </tbody>
  </table></div>
</section>`;
  return { body, scripts: ['home.js'] };
}

/* ================= WEEK PAGE ================= */
export function weekPage(w, { rel }) {
  const cal = calFor(w.n);
  const prev = weeks.find((x) => x.n === w.n - 1);
  const next = weeks.find((x) => x.n === w.n + 1);
  const ch = challengeById[w.home.challenge];

  // Group blocks by kind, preserving order: arrival → drills → games → scrimmage → huddle
  const groups = GROUPS.map((g) => ({ ...g, blocks: w.blocks.filter((b) => b.kind === g.key) })).filter((g) => g.blocks.length);

  const overviewRows = groups.map((g) => {
    const items = g.blocks.map((b) => overviewTitle(b, `#block-${w.blocks.indexOf(b) + 1}`));
    return `<div class="ov-row"><a class="ov-k" href="#${g.key}">${esc(g.label)}</a><div class="ov-v">${items.join('')}</div></div>`;
  });
  overviewRows.push(`<div class="ov-row"><a class="ov-k" href="${rel}at-home/#ch-${ch.id}">At home</a><div class="ov-v"><span class="ov-item">${ch.icon} ${esc(ch.name)}${w.home.note ? ` <span class="muted">— ${inline(w.home.note)}</span>` : ''}</span></div></div>`);

  const sections = groups
    .map((g) => `<section class="plan-group" id="${g.key}">
      <header class="group-head">
        <h2 class="group-title"><span class="block-kind block-kind-${g.key}">${esc(g.label)}</span></h2>
        <p class="group-lede">${esc(g.lede)}</p>
      </header>
      <ol class="blocks">${g.blocks.map((b) => renderBlock(b, w.blocks.indexOf(b) + 1, rel)).join('')}</ol>
    </section>`)
    .join('');

  const rulesUsed = [...new Set(w.blocks.flatMap((b) => b.rules || []))].map((id) => rules.find((r) => r.id === id)).filter(Boolean);
  const blockNotes = w.blocks.filter((b) => b.note).map((b) => `<li><strong>${esc(KIND_LABEL[b.kind])}${b.kind === 'drill' || b.kind === 'game' || b.kind === 'arrival' ? ` — ${esc(blockTitle(b))}` : ''}:</strong> ${inline(b.note)}</li>`);

  const body = `
<section class="wrap page-head week-head">
  <div class="week-head-top">
    <p class="eyebrow">Week ${w.n} of ${weeks.length} · ${fmtRange(cal.start, cal.end)}</p>
    <div class="week-nav">
      ${prev ? `<a class="btn btn-ghost btn-sm" href="${rel}weeks/${prev.n}/">${icon('back')} Week ${prev.n}</a>` : ''}
      ${next ? `<a class="btn btn-ghost btn-sm" href="${rel}weeks/${next.n}/">Week ${next.n} ${icon('arrow')}</a>` : ''}
    </div>
  </div>
  <h1>${esc(w.theme)}</h1>
  <p class="lede">${esc(w.tagline)}</p>
  <p class="hero-when">${whenItems(cal, { noGameText: 'No game on the league schedule yet' })}</p>
  <p class="focus-pills">${w.focus.map((f) => `<a class="pill pill-skill pill-${f}" href="${rel}drills/${f}/">${esc(drillById[f]?.short || f)}</a>`).join('')}</p>
</section>

<section class="wrap">
  <div class="week-grid">
    <div class="week-main">
      <div class="card overview">
        <h2 class="card-title">${icon('target')} This week's goals</h2>
        <ul class="goals">${(w.goals || []).map((g) => `<li>${inline(g)}</li>`).join('')}</ul>
        <h3 class="ov-title">The plan, loosely</h3>
        <div class="ov">${overviewRows.join('')}</div>
        <p class="small muted ov-foot">Third graders don't follow scripts — think of this as the order of the evening, not a timetable. Tap any section for the details, diagrams and videos.</p>
      </div>
      ${sections}
    </div>
    <aside class="week-side">
      <div class="card side-card">
        <h3 class="card-title">${icon('home')} At home this week</h3>
        ${homeChallengeChip(w, rel)}
        ${w.home.note ? `<p class="small">${inline(w.home.note)}</p>` : ''}
      </div>
      <div class="card side-card">
        <h3 class="card-title">${icon('calendar')} This week</h3>
        <ul class="plain when-list">
          <li><strong>Practice</strong><br>${cal.practice ? eventLine(cal.practice) : 'None this week'}</li>
          <li><strong>Game</strong><br>${cal.game ? eventLine(cal.game) : cal.notes.some((n) => /no games/i.test(n)) ? 'No games — Labor Day weekend' : 'Not on the league schedule yet — check the <a href="' + rel + 'schedule/">schedule</a>'}</li>
          ${(cal.others || []).map((o) => `<li><strong>${esc(o.title)}</strong><br>${eventLine(o)}</li>`).join('')}
        </ul>
        <p class="small"><a href="${rel}schedule/">Full schedule ${icon('arrow')}</a></p>
      </div>
      ${rulesUsed.length ? `<div class="card side-card side-quiet">
        <h3 class="card-title">${icon('flag')} Rules we'll use</h3>
        <ul class="plain">${rulesUsed.map((r) => `<li><a href="${rel}rules/#${r.id}">${esc(r.title)}</a></li>`).join('')}</ul>
      </div>` : ''}
    </aside>
  </div>
</section>

<section class="wrap coaches-corner">
  <details class="corner">
    <summary>${icon('whistle')} Coaches' corner <span class="muted">— notes for the two of us</span></summary>
    <div class="corner-body">
      ${w.coachNotes ? `<h4>Notes for the week</h4>${md(w.coachNotes)}` : ''}
      ${blockNotes.length ? `<h4>Notes by block</h4><ul>${blockNotes.join('')}</ul>` : ''}
      ${w.saturday?.length ? `<h4>Saturday: what we're watching for</h4>${list(w.saturday)}` : ''}
      <p class="corner-actions">
        <a class="btn btn-ghost btn-sm" href="${rel}weeks/${w.n}/run/">${icon('clock')} Practice timer</a>
        <button class="btn btn-ghost btn-sm" type="button" data-print>${icon('print')} Print this week</button>
      </p>
    </div>
  </details>
</section>

<section class="wrap week-foot">
  ${prev ? `<a class="btn btn-ghost" href="${rel}weeks/${prev.n}/">${icon('back')} Week ${prev.n}: ${esc(prev.theme)}</a>` : '<span></span>'}
  ${next ? `<a class="btn btn-ghost" href="${rel}weeks/${next.n}/">Week ${next.n}: ${esc(next.theme)} ${icon('arrow')}</a>` : ''}
</section>`;
  return { body };
}

function overviewTitle(b, href) {
  switch (b.kind) {
    case 'arrival': {
      const fam = drillById[b.drill];
      const lv = fam.levels.find((l) => l.n === b.levels[0]);
      return `<span class="ov-item"><a href="${href}">${esc(lv.name)}</a></span>`;
    }
    case 'drill': {
      const fam = drillById[b.drill];
      const names = b.levels.map((n) => fam.levels.find((l) => l.n === n)?.name).filter(Boolean);
      return `<span class="ov-item"><a href="${href}"><strong>${esc(fam.short)}:</strong> ${esc(names.join(' → '))}</a></span>`;
    }
    case 'game':
      return `<span class="ov-item"><a href="${href}"><strong>${esc(gameById[b.game].name)}</strong></a> <span class="muted">— ${esc(gameById[b.game].hook)}</span></span>`;
    case 'scrimmage':
      return `<span class="ov-item"><a href="${href}"><strong>${esc(b.title)}</strong></a></span>`;
    case 'huddle':
      return `<span class="ov-item"><a href="${href}">One question, one cheer, the at-home challenge.</a></span>`;
  }
  return '';
}

function renderBlock(b, i, rel) {
  const head = (title, extra = '') => `<header class="block-head">
    <h3 class="block-title">${title}</h3>
    ${extra}
  </header>`;

  switch (b.kind) {
    case 'arrival': {
      const fam = drillById[b.drill];
      const lv = fam.levels.find((l) => l.n === b.levels[0]);
      return `<li class="block block-arrival" id="block-${i}">
        ${head(`<a class="block-link" href="${rel}drills/${fam.id}/#level-${lv.n}">${esc(lv.name)}</a>`, `<a class="block-more" href="${rel}drills/${fam.id}/">Ball mastery ${icon('arrow')}</a>`)}
        <div class="block-mini"><p>${inline(lv.how)}</p>${list(lv.cues, 'cues')}</div>
      </li>`;
    }
    case 'drill': {
      const fam = drillById[b.drill];
      const cards = b.levels
        .map((n) => {
          const lv = fam.levels.find((l) => l.n === n);
          return levelCard(fam, lv, { rel, compact: true, id: `block-${i}-l${n}` });
        })
        .join('');
      return `<li class="block block-drill" id="block-${i}">
        ${head(`<a class="block-link" href="${rel}drills/${fam.id}/">${esc(fam.name)}</a>`, `<a class="block-more" href="${rel}drills/${fam.id}/">Full progression ${icon('arrow')}</a>`)}
        ${cards}
      </li>`;
    }
    case 'game': {
      const g = gameById[b.game];
      return `<li class="block block-game" id="block-${i}">
        ${head(`<a class="block-link" href="${rel}games/${g.id}/">${esc(g.name)}</a>`, `<a class="block-more" href="${rel}games/${g.id}/">Game page ${icon('arrow')}</a>`)}
        ${gameCard(g, { rel, compact: true })}
      </li>`;
    }
    case 'scrimmage': {
      const ruleLinks = (b.rules || []).map((id) => {
        const r = rules.find((x) => x.id === id);
        return r ? `<a class="pill pill-rule" href="${rel}rules/#${r.id}">${icon('flag')} ${esc(r.title)}</a>` : '';
      });
      const drillLinks = (b.drills || []).map(({ drill, levels }) => {
        const fam = drillById[drill];
        return levels
          .map((n) => {
            const lv = fam.levels.find((l) => l.n === n);
            return `<a class="pill pill-rule" href="${rel}drills/${fam.id}/#level-${n}">${icon('bolt')} ${esc(fam.short)}: ${esc(lv.name)}</a>`;
          })
          .join('');
      });
      const dia = (b.rules || []).map((id) => rules.find((x) => x.id === id)).find((r) => r && r.diagram);
      return `<li class="block block-scrimmage" id="block-${i}">
        ${head(esc(b.title))}
        <div class="card">
          <div class="level-body">
            <div class="level-text">
              ${md(b.focus)}
              ${section('What you\'ll hear us call out', list(b.cues, 'cues'), { icon: 'whistle' })}
              ${ruleLinks.length || drillLinks.length ? `<p class="pill-row">${ruleLinks.join('')}${drillLinks.join('')}</p>` : ''}
            </div>
            ${dia ? `<div class="level-media"><div class="dia">${diagram(dia.diagram)}</div><p class="small muted" style="margin-top:.4rem">${esc(dia.title)} — see <a href="${rel}rules/#${dia.id}">rules</a>.</p></div>` : ''}
          </div>
        </div>
      </li>`;
    }
    case 'huddle':
      return `<li class="block block-huddle" id="block-${i}">
        ${head('Bring it in')}
        <div class="card"><p>${inline(b.note || 'One question, one cheer, and this week\'s at-home challenge.')}</p></div>
      </li>`;
  }
  return '';
}

/* ================= RUN (practice mode) ================= */
export function runPage(w, { rel }) {
  const cal = calFor(w.n);
  let t = 0;
  const segs = w.blocks.map((b, i) => {
    const start = t;
    t += b.minutes;
    let title = blockTitle(b);
    let cues = [];
    let setup = '';
    let link = `${rel}weeks/${w.n}/#block-${i + 1}`;
    if (b.kind === 'drill' || b.kind === 'arrival') {
      const fam = drillById[b.drill];
      const lv = fam.levels.find((l) => l.n === b.levels[0]);
      cues = lv.cues;
      setup = lv.setup;
      link = `${rel}drills/${fam.id}/#level-${lv.n}`;
    } else if (b.kind === 'game') {
      const g = gameById[b.game];
      cues = g.cues;
      setup = g.setup;
      link = `${rel}games/${g.id}/`;
    } else if (b.kind === 'scrimmage') {
      cues = b.cues || [];
      setup = '';
    } else if (b.kind === 'huddle') {
      cues = [b.note];
    }
    return { i, kind: b.kind, title, minutes: b.minutes, start, cues, setup, note: b.note || '', link };
  });
  const body = `
<div class="run" id="run" data-week="${w.n}">
  <header class="run-top">
    <a class="run-back" href="${rel}weeks/${w.n}/">${icon('back')} Week ${w.n}</a>
    <span class="run-theme">${esc(w.theme)}</span>
    <span class="run-clock" id="run-clock">0:00</span>
  </header>
  <div class="run-stage" id="run-stage">
    <p class="run-kind" id="run-kind"></p>
    <h1 class="run-title" id="run-title"></h1>
    <p class="run-remaining"><span id="run-remaining">–:––</span><span class="run-remaining-label">left in this block</span></p>
    <ul class="run-cues" id="run-cues"></ul>
    <p class="run-setup" id="run-setup"></p>
    <a class="run-link" id="run-link" href="#">Full instructions ${icon('arrow')}</a>
  </div>
  <div class="run-controls">
    <button class="btn btn-ghost" type="button" id="run-prev" aria-label="Previous block">${icon('back')}</button>
    <button class="btn btn-primary btn-lg" type="button" id="run-toggle">${icon('play')} Start</button>
    <button class="btn btn-ghost" type="button" id="run-next" aria-label="Next block">${icon('arrow')}</button>
  </div>
  <ol class="run-list" id="run-list">
    ${segs.map((s) => `<li data-i="${s.i}"><span class="run-list-min">${s.minutes}′</span><span class="run-list-title">${esc(s.title)}</span><span class="run-list-start">${mmss(s.start)}</span></li>`).join('')}
  </ol>
  <p class="run-foot small">Timer runs on this phone only. Screen stays awake while it runs. <a href="${rel}weeks/${w.n}/">Back to the plan</a>.</p>
  <script type="application/json" id="run-data">${JSON.stringify(segs)}</script>
</div>`;
  return { body, scripts: ['run.js'], bodyClass: 'is-run' };
}
