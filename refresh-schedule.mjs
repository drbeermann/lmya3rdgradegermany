#!/usr/bin/env node
// Refresh the schedule snapshot (src/data/schedule.ics) from the league's iCal
// feed. The feed URL comes from SCHEDULE_ICS_URL — set it in the environment or
// in a git-ignored .env.local file (SCHEDULE_ICS_URL=https://…).
// Never fails the build: if the feed can't be fetched, the snapshot stays as is.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = path.join(ROOT, 'src', 'data', 'schedule.ics');

async function loadEnvLocal() {
  try {
    const text = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* no .env.local */ }
}

await loadEnvLocal();
const url = process.env.SCHEDULE_ICS_URL;
if (!url) {
  console.log('schedule: SCHEDULE_ICS_URL not set — keeping the committed snapshot.');
  process.exit(0);
}
try {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'lmya-germany-site' } });
  clearTimeout(t);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const count = (text.match(/BEGIN:VEVENT/g) || []).length;
  if (!/BEGIN:VCALENDAR/.test(text) || count === 0) throw new Error('response is not a calendar with events');
  const before = await fs.readFile(SNAPSHOT, 'utf8').catch(() => '');
  if (before === text) {
    console.log(`schedule: up to date (${count} events).`);
  } else {
    await fs.writeFile(SNAPSHOT, text);
    console.log(`schedule: updated snapshot (${count} events).`);
  }
} catch (e) {
  console.warn(`schedule: could not refresh (${e.message}) — keeping the committed snapshot.`);
}
