// Home page: point the hero at the current week (the build renders Week 1 by
// default so the page is right even without JS). Also used on the season
// index and schedule pages, where it just highlights the current week.
import { markCurrentWeek, todayISO } from './site.js';

const rel = document.body.dataset.rel || './';
const dataEl = document.getElementById('week-data');
if (dataEl) {
  const { weeks } = JSON.parse(dataEl.textContent);
  const today = todayISO();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (iso, weekday = false) => {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const md = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return weekday ? `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${md}` : md;
  };
  const fmtRange = (a, b) => {
    const [, ma] = a.split('-');
    const [, mb, db] = b.split('-');
    return ma === mb ? `${fmt(a)}–${Number(db)}` : `${fmt(a)} – ${fmt(b)}`;
  };
  const evLine = (e) => {
    const parts = [fmt(e.date, true), esc(e.when)];
    if (e.title && /^vs /.test(e.title)) parts.push(`<strong>${esc(e.title)}</strong>${e.home != null ? ` <span class="muted">(${e.home ? 'home' : 'away'})</span>` : ''}`);
    if (e.location) parts.push(e.directions ? `<a href="${esc(e.directions)}" target="_blank" rel="noopener">${esc(e.location)}</a>` : esc(e.location));
    return parts.join(' · ');
  };

  let wk = weeks.find((w) => today >= w.start && today <= w.end);
  let state = 'in-season';
  if (!wk) {
    if (today < weeks[0].start) { wk = weeks[0]; state = 'pre'; }
    else { wk = weeks[weeks.length - 1]; state = 'post'; }
  }

  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const eyebrow = state === 'pre' ? `Season starts ${fmt(wk.start)} · Week 1` : state === 'post' ? 'Season complete · Week 10' : `Week ${wk.n} · ${fmtRange(wk.start, wk.end)}`;
  set('hero-eyebrow', eyebrow);
  set('hero-title', wk.theme);
  set('hero-tagline', wk.tagline);
  const cta = document.getElementById('hero-cta');
  if (cta) cta.href = `${rel}weeks/${wk.n}/`;
  const when = document.getElementById('hero-when');
  if (when) {
    const icons = [...when.querySelectorAll('svg')].map((x) => x.outerHTML);
    const p = wk.practice ? `Practice ${evLine(wk.practice)}` : 'No practice this week';
    const g = wk.game ? `Game ${evLine(wk.game)}` : wk.noGameNote || 'No game on the league schedule yet';
    when.innerHTML = `<span class="when-item">${icons[0] || ''}<span class="when-text">${p}</span></span><span class="when-item">${icons[1] || ''}<span class="when-text">${g}</span></span>`;
  }
  const plan = document.getElementById('hero-plan');
  if (plan) {
    plan.innerHTML = `
      <div class="hp-goals"><span class="hp-k">This week we're working on</span><ul class="hp-goal-list">${wk.goals.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
      <div class="hp-col"><span class="hp-k">Drills</span>${wk.drills.map((d) => `<span class="hp-v">${esc(d)}</span>`).join('')}</div>
      <div class="hp-col"><span class="hp-k">Games</span>${wk.games.map((d) => `<span class="hp-v">${esc(d)}</span>`).join('')}</div>
      <div class="hp-col"><span class="hp-k">Scrimmage</span><span class="hp-v">${esc(wk.scrimmage)}</span></div>
      <div class="hp-col"><span class="hp-k">At home</span><span class="hp-v">${wk.homeIcon} ${esc(wk.home)}</span></div>`;
  }
  const slot = document.getElementById('home-challenge-slot');
  if (slot) {
    slot.innerHTML = `<a class="chip-home" href="${rel}at-home/#ch-${wk.homeId}"><span class="ch-icon">${wk.homeIcon}</span><span><strong>${esc(wk.home)}</strong><small>Week ${wk.n} challenge</small></span></a>`;
  }
  // week cards: the build marks week 1 as current; recompute from today.
  document.querySelectorAll('.wk-card').forEach((c) => c.classList.remove('is-current'));
  const cur = document.querySelector(`.wk-card[data-week="${wk.n}"]`);
  if (cur && state === 'in-season') cur.classList.add('is-current');
} else {
  markCurrentWeek();
}
