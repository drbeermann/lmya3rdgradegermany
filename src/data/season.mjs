// Team + season facts. Practice and game times/locations come from the league's
// iCal feed (snapshot in ./schedule.ics — refresh it with `npm run schedule:refresh`).
import fs from 'node:fs';
import { addDays } from '../lib/html.mjs';
import { parseICS, localizeEvent, timeRange } from '../lib/ics.mjs';

export const team = {
  name: 'Germany',
  league: 'LMYA Soccer',
  division: '3rd Grade',
  format: '7v7',
  coaches: [
    { name: 'Dale Beermann', role: 'Coach' },
    { name: 'Nima Gabbay', role: 'Coach' },
  ],
  timeZone: 'America/Los_Angeles',
  ball: 'Size 4',
  colors: 'White & black jerseys with red trim',
  // Fallbacks used only if the schedule feed has no practice events.
  practice: { day: 'Wednesday', time: '6:00–7:00 pm', location: 'Stanley Middle School' },
  gameDay: 'Saturday',
};

// Where the site is published. Set `domain` once you have registered one
// (e.g. 'germany.example.com' or 'example.com'); the build then writes the
// CNAME file GitHub Pages uses for custom domains.
export const site = {
  domain: process.env.SITE_DOMAIN || '',
};

export const season = {
  // Week 1 begins Sunday Aug 16, 2026 (weeks run Sunday → Saturday).
  start: '2026-08-16',
  weeks: 10,
  lastGames: '2026-10-24',
  // Notes shown on the week card / schedule for weeks with something unusual.
  weekNotes: {
    3: 'No games — Labor Day weekend',
    10: 'Last games of the season',
  },
  // Set to override what the feed says (e.g. if the league lists a placeholder field).
  overrides: {
    practiceLocation: null, // e.g. 'Stanley Middle School'
  },
  // Public links
  leagueSchedule: 'https://lmyasports.leagueapps.com/app/leagues/5001298/schedule',
};

/* ---------- events from the league feed ---------- */
const icsText = fs.readFileSync(new URL('./schedule.ics', import.meta.url), 'utf8');

function classify(ev) {
  const s = ev.summary;
  const vs = s.match(/^(.+?)\s+vs\.?\s+(.+?)(?:\s*\(.*\))?\s*$/i);
  if (/practice/i.test(s)) {
    return { ...ev, type: 'practice', title: 'Practice', location: season.overrides.practiceLocation || ev.location };
  }
  if (vs) {
    const [, a, b] = vs;
    const isUs = (t) => t.trim().toLowerCase() === team.name.toLowerCase();
    const opponent = isUs(a) ? b.trim() : isUs(b) ? a.trim() : `${a.trim()} vs ${b.trim()}`;
    return { ...ev, type: 'game', title: `vs ${opponent}`, opponent, home: isUs(a), listedAs: `${a.trim()} vs. ${b.trim()}` };
  }
  return { ...ev, type: 'other', title: s.replace(/\s*\(.*\)\s*$/, '') };
}

export const events = parseICS(icsText)
  .map((e) => localizeEvent(e, team.timeZone))
  .filter((e) => e.date)
  .map(classify)
  .sort((a, b) => (a.date + (a.startMinutes ?? 0)).localeCompare(b.date + (b.startMinutes ?? 0)) || (a.startMinutes ?? 0) - (b.startMinutes ?? 0));

for (const e of events) e.when = e.allDay ? 'All day' : timeRange(e.time, e.endTime);

// Practice facts derived from the feed (first practice event), with fallbacks.
const firstPractice = events.find((e) => e.type === 'practice');
const DAY_NAMES = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };
if (firstPractice) {
  team.practice = {
    day: DAY_NAMES[firstPractice.weekday] || team.practice.day,
    time: firstPractice.when,
    location: firstPractice.location,
    directions: firstPractice.directions || null,
  };
}
team.gameDay = DAY_NAMES[events.find((e) => e.type === 'game')?.weekday] || team.gameDay;

/* ---------- derived calendar: one entry per week ---------- */
export const calendar = Array.from({ length: season.weeks }, (_, i) => {
  const start = addDays(season.start, i * 7);
  const end = addDays(start, 6);
  const inWeek = events.filter((e) => e.date >= start && e.date <= end);
  const practices = inWeek.filter((e) => e.type === 'practice');
  const games = inWeek.filter((e) => e.type === 'game');
  const others = inWeek.filter((e) => e.type === 'other');
  const notes = [];
  if (season.weekNotes[i + 1]) notes.push(season.weekNotes[i + 1]);
  return {
    n: i + 1,
    start,
    end,
    events: inWeek,
    practices,
    games,
    others,
    practice: practices[0] || null,
    game: games[0] || null,
    notes,
  };
});
