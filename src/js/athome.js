// At-home page: personal bests saved in localStorage, level badges, and the
// current week's challenge surfaced at the top.
import { todayISO } from './site.js';

const KEY = 'germany:pb';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const save = (o) => localStorage.setItem(KEY, JSON.stringify(o));

function levelFor(card, value) {
  const targets = card.dataset.targets.split(',').map(Number);
  const lower = card.dataset.lower === '1';
  const names = ['Rookie', 'Starter', 'Captain'];
  let reached = -1;
  targets.forEach((t, i) => {
    if (lower ? value <= t : value >= t) reached = i;
  });
  return reached >= 0 ? names[reached] : null;
}

function paint(card, value) {
  const status = card.querySelector('.pb-status');
  const input = card.querySelector('.pb-input');
  const levels = card.querySelectorAll('.ch-level');
  levels.forEach((l) => l.classList.remove('is-reached'));
  if (value == null || value === '') {
    status.textContent = '';
    card.classList.remove('has-pb');
    return;
  }
  input.value = value;
  const lvl = levelFor(card, Number(value));
  const targets = card.dataset.targets.split(',').map(Number);
  const lower = card.dataset.lower === '1';
  levels.forEach((l, i) => {
    if (lower ? Number(value) <= targets[i] : Number(value) >= targets[i]) l.classList.add('is-reached');
  });
  status.innerHTML = lvl ? `Personal best: <strong>${value}</strong> — <span class="pb-level pb-${lvl.toLowerCase()}">${lvl}</span> ✓` : `Personal best: <strong>${value}</strong> — keep going, Rookie is ${lower ? '≤ ' : ''}${targets[0]}`;
  card.classList.add('has-pb');
}

const pbs = load();
document.querySelectorAll('.ch-card').forEach((card) => {
  const id = card.dataset.challenge;
  paint(card, pbs[id]);
  card.querySelector('.pb').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = card.querySelector('.pb-input').value;
    if (v === '') return;
    const n = Number(v);
    const lower = card.dataset.lower === '1';
    const prev = pbs[id];
    // Only overwrite if it's actually a new best (or there is none yet).
    if (prev == null || (lower ? n < Number(prev) : n > Number(prev))) {
      pbs[id] = n;
      save(pbs);
      paint(card, n);
      card.classList.add('is-new-best');
      setTimeout(() => card.classList.remove('is-new-best'), 1200);
    } else {
      card.querySelector('.pb-status').innerHTML = `Not a new best yet — your record is <strong>${prev}</strong>. Try again!`;
    }
  });
});

const reset = document.getElementById('pb-reset');
if (reset) reset.addEventListener('click', () => {
  if (confirm('Clear all saved scores on this device?')) {
    localStorage.removeItem(KEY);
    document.querySelectorAll('.ch-card').forEach((c) => { c.querySelector('.pb-input').value = ''; paint(c, null); });
  }
});

// Current week's challenge
const list = document.getElementById('weekly-list');
const slot = document.getElementById('athome-current');
if (list && slot) {
  const today = todayISO();
  const items = [...list.querySelectorAll('li')];
  let cur = items.find((li) => today >= li.dataset.start && today <= li.dataset.end);
  let label = 'This week';
  if (!cur) {
    if (today < items[0].dataset.start) { cur = items[0]; label = 'Season starts soon — first challenge'; }
    else { cur = items[items.length - 1]; label = 'Season over — last challenge (keep going!)'; }
  }
  cur.classList.add('is-current');
  const a = cur.querySelector('a').cloneNode(true);
  a.classList.add('chip-home');
  slot.innerHTML = `<p class="small muted">${label}</p>`;
  slot.appendChild(a);
}
