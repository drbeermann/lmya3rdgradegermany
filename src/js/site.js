// Shared behavior on every page: mobile nav, click-to-play video facades,
// print buttons, service worker registration, and a "current week" helper.

const rel = document.body.dataset.rel || './';

/* ---------- nav ---------- */
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('nav-open', !open);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle.click();
  });
}

/* ---------- video facades ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.video-facade');
  if (!btn) return;
  const fig = btn.closest('.video');
  const src = fig?.dataset.embed;
  if (!src) return;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = btn.getAttribute('aria-label') || 'Video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.loading = 'eager';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  btn.replaceWith(iframe);
  fig.classList.add('is-playing');
});

/* ---------- print ---------- */
document.querySelectorAll('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));

/* ---------- current week ---------- */
// Weeks run Sunday → Saturday. Elements carrying data-start / data-end (ISO
// dates) get .is-current / .is-past / .is-future classes.
export function todayISO() {
  const d = new Date();
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function markCurrentWeek(selector = '[data-start][data-end]') {
  const today = todayISO();
  let current = null;
  document.querySelectorAll(selector).forEach((el) => {
    const { start, end } = el.dataset;
    el.classList.remove('is-current', 'is-past', 'is-future');
    if (today < start) el.classList.add('is-future');
    else if (today > end) el.classList.add('is-past');
    else {
      el.classList.add('is-current');
      current = el;
    }
  });
  return current;
}
markCurrentWeek();

/* ---------- offline ---------- */
// Skipped on localhost so local development always shows fresh files
// (set localStorage.sw = 'on' to test it locally).
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && (!isLocal || localStorage.getItem('sw') === 'on')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${rel}sw.js`).catch(() => {});
  });
} else if ('serviceWorker' in navigator && isLocal) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
}
