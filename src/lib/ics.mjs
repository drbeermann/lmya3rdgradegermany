// Minimal iCalendar (RFC 5545) reader for the LeagueApps team feed, plus
// time-zone helpers. No dependencies.

// Unfold continuation lines (lines starting with a space or tab continue the
// previous line) and split into lines.
function unfold(text) {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
}

function unescapeText(s = '') {
  return s.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

// DTSTART forms we handle: 20260820T010000Z (UTC), 20260820T180000 (floating),
// DATE-only 20260820. LeagueApps emits UTC.
function parseDate(value, params = '') {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?$/);
  if (!m) return null;
  const [, y, mo, d, h = '00', mi = '00', s = '00', z] = m;
  if (/VALUE=DATE(?!-TIME)/.test(params) || h === undefined) return { date: `${y}-${mo}-${d}`, allDay: true };
  if (z === 'Z') return { at: new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)) };
  // floating time: treat as local to the site's time zone by tagging it
  return { floating: `${y}-${mo}-${d}T${h}:${mi}:${s}` };
}

export function parseICS(text) {
  const events = [];
  let cur = null;
  for (const line of unfold(text)) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const head = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const [name, ...paramParts] = head.split(';');
    const params = paramParts.join(';');
    switch (name) {
      case 'UID': cur.uid = value; break;
      case 'SUMMARY': cur.summary = unescapeText(value); break;
      case 'LOCATION': cur.location = unescapeText(value); break;
      case 'DESCRIPTION': cur.description = unescapeText(value); break;
      case 'URL': cur.url = value; break;
      case 'DTSTART': cur.start = parseDate(value, params); break;
      case 'DTEND': cur.end = parseDate(value, params); break;
      default: break;
    }
  }
  return events;
}

/* ---------- time zone helpers ---------- */

const partsCache = new Map();
function formatter(tz) {
  if (!partsCache.has(tz)) {
    partsCache.set(
      tz,
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: 'numeric', minute: '2-digit', hour12: true,
      })
    );
  }
  return partsCache.get(tz);
}

// Date → { date:'YYYY-MM-DD', time:'6:00 pm', weekday:'Wed' } in the given zone.
export function localParts(date, tz) {
  const parts = Object.fromEntries(formatter(tz).formatToParts(date).map((p) => [p.type, p.value]));
  const hour = parts.hour;
  const period = (parts.dayPeriod || '').toLowerCase();
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${hour}:${parts.minute} ${period}`,
    weekday: parts.weekday,
    minutes: (Number(hour) % 12) * 60 + Number(parts.minute) + (period === 'pm' ? 720 : 0),
  };
}

// "6:00 pm" + "7:00 pm" → "6:00–7:00 pm"; "8:30 am" + "9:45 am" → "8:30–9:45 am"
export function timeRange(a, b) {
  if (!b) return a;
  const [ta, pa] = a.split(' ');
  const [tb, pb] = b.split(' ');
  return pa === pb ? `${ta}–${tb} ${pb}` : `${a} – ${b}`;
}

// Normalise a parsed VEVENT into a plain event with local date/time strings.
export function localizeEvent(ev, tz) {
  const out = { uid: ev.uid, summary: ev.summary || '', location: ev.location || '', description: ev.description || '' };
  if (ev.start?.at) {
    const s = localParts(ev.start.at, tz);
    out.date = s.date; out.weekday = s.weekday; out.time = s.time; out.startMinutes = s.minutes; out.startISO = ev.start.at.toISOString();
    if (ev.end?.at) { const e = localParts(ev.end.at, tz); out.endTime = e.time; out.endISO = ev.end.at.toISOString(); }
  } else if (ev.start?.floating) {
    const [d, t] = ev.start.floating.split('T');
    out.date = d;
    const [h, m] = t.split(':').map(Number);
    out.time = `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
    out.startMinutes = h * 60 + m;
  } else if (ev.start?.date) {
    out.date = ev.start.date; out.allDay = true;
  }
  // LeagueApps puts "RSVP Here: <url>\nGet Directions: <url>" in the description.
  const rsvp = out.description.match(/RSVP Here:\s*(\S+)/i);
  const dir = out.description.match(/Get Directions:\s*(\S+)/i);
  if (rsvp) out.rsvp = rsvp[1];
  if (dir) out.directions = dir[1];
  return out;
}
