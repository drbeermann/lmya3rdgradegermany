// Small HTML helpers shared by the templates. No dependencies.

export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Inline formatting used inside authored content strings:
//   **bold**, *em*, `code`, [text](url)
export function inline(s = '') {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}

// Very small markdown-ish block formatter: paragraphs separated by blank
// lines, "- " bullet lists, "1. " numbered lists.
export function md(text = '') {
  const blocks = String(text).trim().split(/\n\s*\n/);
  return blocks
    .map((b) => {
      const lines = b.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.every((l) => /^- /.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
      }
      if (lines.every((l) => /^\d+\. /.test(l))) {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
      }
      return `<p>${lines.map(inline).join(' ')}</p>`;
    })
    .join('\n');
}

export function list(items = [], cls = '') {
  if (!items.length) return '';
  return `<ul${cls ? ` class="${cls}"` : ''}>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
}

export function slug(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function plural(n, one, many = one + 's') {
  return `${n} ${n === 1 ? one : many}`;
}

// Date helpers. Season data uses ISO dates (YYYY-MM-DD) in local time.
export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function fmtDate(iso, opts = {}) {
  const d = parseDate(iso);
  const day = opts.weekday ? `${DAYS[d.getDay()]} ` : '';
  return `${day}${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
export function fmtRange(a, b) {
  const da = parseDate(a);
  const db = parseDate(b);
  if (da.getMonth() === db.getMonth()) return `${MONTHS[da.getMonth()]} ${da.getDate()}–${db.getDate()}`;
  return `${MONTHS[da.getMonth()]} ${da.getDate()} – ${MONTHS[db.getMonth()]} ${db.getDate()}`;
}
export function addDays(iso, n) {
  const d = parseDate(iso);
  d.setDate(d.getDate() + n);
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
