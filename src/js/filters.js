// Games index: filter tiles by skill tag or "at home". Pure DOM, no state.
const bar = document.getElementById('game-filters');
const grid = document.getElementById('game-grid');
if (bar && grid) {
  const tiles = [...grid.querySelectorAll('.game-tile')];
  const apply = (f) => {
    tiles.forEach((t) => {
      const show = f === 'all' || (f === 'home' ? t.dataset.home === '1' : t.dataset.skills.split(' ').includes(f));
      t.hidden = !show;
    });
    bar.querySelectorAll('.filter').forEach((b) => b.classList.toggle('is-on', b.dataset.filter === f));
    if (f === 'all') history.replaceState(null, '', location.pathname);
    else history.replaceState(null, '', `#${f}`);
  };
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (b) apply(b.dataset.filter);
  });
  const initial = location.hash.slice(1);
  if (initial && bar.querySelector(`[data-filter="${CSS.escape(initial)}"]`)) apply(initial);
}
