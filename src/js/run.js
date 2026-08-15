// Practice mode: a big, one-handed timer that walks through the week's blocks.
// Time is measured against the wall clock so it stays right if the phone
// locks or the tab is backgrounded. Keeps the screen awake while running.

const root = document.getElementById('run');
const segs = JSON.parse(document.getElementById('run-data').textContent);
const els = {
  clock: document.getElementById('run-clock'),
  kind: document.getElementById('run-kind'),
  title: document.getElementById('run-title'),
  remaining: document.getElementById('run-remaining'),
  cues: document.getElementById('run-cues'),
  setup: document.getElementById('run-setup'),
  link: document.getElementById('run-link'),
  toggle: document.getElementById('run-toggle'),
  prev: document.getElementById('run-prev'),
  next: document.getElementById('run-next'),
  list: document.getElementById('run-list'),
  stage: document.getElementById('run-stage'),
};
const KIND = { arrival: 'Arrival', drill: 'Drill', game: 'Game', scrimmage: 'Scrimmage', huddle: 'Huddle' };

let i = 0; // current segment index
let running = false;
let segAccum = 0; // seconds accumulated in this segment before the current run span
let totalAccum = 0; // seconds accumulated overall before the current run span
let spanStart = 0; // Date.now() when the current run span started
let interval = null;
let wakeLock = null;
let overNotified = false;

const now = () => Date.now();
const segElapsed = () => segAccum + (running ? (now() - spanStart) / 1000 : 0);
const totalElapsed = () => totalAccum + (running ? (now() - spanStart) / 1000 : 0);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const playIcon = els.toggle.querySelector('svg')?.outerHTML || '';

function renderStatic() {
  const s = segs[i];
  els.kind.textContent = KIND[s.kind] || s.kind;
  els.title.textContent = s.title;
  els.cues.innerHTML = s.cues.map((c) => `<li>${esc(c)}</li>`).join('');
  els.setup.textContent = s.setup ? s.setup.replace(/\*\*/g, '') : '';
  els.link.href = s.link;
  root.dataset.kind = s.kind;
  els.list.querySelectorAll('li').forEach((li, k) => {
    li.classList.toggle('is-current', k === i);
    li.classList.toggle('is-done', k < i);
  });
  els.prev.disabled = i === 0;
  els.next.disabled = i === segs.length - 1;
}

function tick() {
  const s = segs[i];
  const left = s.minutes * 60 - segElapsed();
  els.remaining.textContent = left >= 0 ? mmss(left) : `+${mmss(-left)}`;
  els.clock.textContent = mmss(totalElapsed());
  const over = left <= 0;
  els.stage.classList.toggle('is-over', over);
  if (over && !overNotified) {
    overNotified = true;
    vibrate();
    beep();
  }
}

function go(n) {
  if (running) {
    totalAccum = totalElapsed();
    spanStart = now();
  }
  segAccum = 0;
  overNotified = false;
  i = Math.max(0, Math.min(segs.length - 1, n));
  renderStatic();
  tick();
  vibrate(40);
}

function start() {
  running = true;
  spanStart = now();
  els.toggle.innerHTML = `${playIcon} Pause`;
  els.toggle.classList.add('is-running');
  interval = setInterval(tick, 250);
  tick();
  requestWakeLock();
}
function pause() {
  segAccum = segElapsed();
  totalAccum = totalElapsed();
  running = false;
  clearInterval(interval);
  els.toggle.innerHTML = `${playIcon} ${totalAccum > 0 ? 'Resume' : 'Start'}`;
  els.toggle.classList.remove('is-running');
  releaseWakeLock();
}

function vibrate(ms = 120) {
  try { navigator.vibrate && navigator.vibrate(ms); } catch { /* ignore */ }
}
let audio;
function beep() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.connect(g); g.connect(audio.destination);
    o.frequency.value = 880; g.gain.value = 0.08;
    o.start(); o.stop(audio.currentTime + 0.25);
  } catch { /* ignore */ }
}
async function requestWakeLock() {
  try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch { /* not available */ }
}
function releaseWakeLock() {
  try { wakeLock && wakeLock.release(); } catch { /* ignore */ }
  wakeLock = null;
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    tick();
    if (running) requestWakeLock();
  }
});

els.toggle.addEventListener('click', () => (running ? pause() : start()));
els.next.addEventListener('click', () => go(i + 1));
els.prev.addEventListener('click', () => go(i - 1));
els.list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-i]');
  if (li) go(Number(li.dataset.i));
});
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') { e.preventDefault(); els.toggle.click(); }
  if (e.key === 'ArrowRight') go(i + 1);
  if (e.key === 'ArrowLeft') go(i - 1);
});

renderStatic();
tick();
