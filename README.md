# Germany — LMYA 3rd grade season site

A static website for the 2026 season: a 10-week plan (one 60-minute practice per
week), drill progressions with diagrams and videos, a games library, at-home
challenges for the kids, a plain-English rules digest, and a phone-friendly
"run practice" timer for the field.

- **No dependencies.** `node build.mjs` renders `src/` → `dist/`. Node ≥ 18.
- **Content is data.** Everything you'd want to edit lives in `src/data/*.mjs`.
- **Hosts anywhere static.** All links are relative, so it works at a domain root
  *or* a subpath (GitHub Pages project sites). Netlify config and a GitHub Pages
  workflow are included.
- **Schedule from the league.** Practice and game times, fields and opponents
  come from the LMYA (LeagueApps) iCal feed — a snapshot lives in
  `src/data/schedule.ics`; `npm run schedule:refresh` updates it.
- **Works offline.** A service worker caches the whole site after the first
  visit (network first, cache when there's no signal). Videos still need signal.

## Commands

```bash
npm run build             # render to dist/
npm run serve             # serve dist/ at http://localhost:4173
npm run dev               # build, then watch src/ + serve
npm run check             # validate content (missing ids, unknown video keys, weeks without goals…)
npm run schedule:refresh  # pull the latest practices/games from the league feed into src/data/schedule.ics
npm run release           # refresh the schedule, then build
```

The feed URL is read from `SCHEDULE_ICS_URL` (environment variable) or from a
git-ignored `.env.local` file containing `SCHEDULE_ICS_URL=https://…`. If it is
not set or the fetch fails, the committed snapshot is used, so builds never break.

## Where things live

```
src/
  data/
    season.mjs    team facts + season start; reads schedule.ics and derives the week-by-week calendar
    schedule.ics  snapshot of the league's iCal feed (practices, games, locations, RSVP links)
    weeks.mjs     the 10 weekly plans: goals + blocks (arrival → drills → games → scrimmage → huddle) + coach notes
    drills.mjs    skill families, each an ordered progression of levels (setup, how, cues, easier/harder, diagram, video)
    games.mjs     games library (setup, how to play, scoring, variations, at-home version, diagram, video)
    home.mjs      at-home challenge ladder (three levels each; kids track a personal best in the browser)
    rules.mjs     3rd-grade rules digest + quick facts (from docs/LMYA-House-Rules-2026.pdf)
    coaching.mjs  coach's corner: practice format, principles, gear lists, game-day notes
    videos.mjs    video registry — every YouTube id here was verified via oEmbed
  lib/
    diagram.mjs   tiny DSL → inline SVG coaching diagrams (cones, players, ball, pass/run/dribble/shot arrows, 7v7 field)
    crest.mjs     the SVG team crest (header, favicon)
    html.mjs      escaping, mini-markdown (**bold**, *em*, lists), date helpers
    ics.mjs       tiny iCalendar parser + time-zone helpers
  templates/      page renderers (plain template literals) — layout, home/week/run, drills/games/at-home/rules/schedule/team
  styles/site.css design system: black / white / red / silver, Barlow + Barlow Condensed
  js/             small vanilla modules: nav + video facades + offline (site.js), current-week (home.js),
                  practice timer (run.js), game filters, at-home personal bests
  assets/         topo.svg (hero background pattern) and any static files
build.mjs           renders pages, copies assets, writes favicon/manifest/.ics/service worker, validates content
refresh-schedule.mjs fetches the league feed into src/data/schedule.ics (never fails the build)
serve.mjs           dev server
```

## Common edits

**Change a week's plan** — edit `src/data/weeks.mjs`. Each week has `goals`
(what everyone sees at the top), `blocks` such as
`{ kind: 'drill', minutes: 7, drill: 'passing', levels: [3], note: '…' }` or
`{ kind: 'game', minutes: 9, game: 'soccer-golf', note: '…' }`, the `home`
challenge, and coach-only `coachNotes` / `saturday` (shown in the collapsed
"Coaches' corner"). Minutes are only used by the practice timer; the page itself
shows the plan loosely, without times.

**Add a drill level** — add an object to that family's `levels` array in
`src/data/drills.mjs`. The diagram DSL is documented at the top of
`src/lib/diagram.mjs`; coordinates are yards. Levels are numbered by their `n`.

**Add a video** — add an entry to `src/data/videos.mjs`
(`'my-key': { yt: 'VIDEOID', title, channel, len, start?, end?, note? }`) and
reference `'my-key'` (or an array of keys) from a level, game, challenge or rule.
Verify an id at `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEOID&format=json`.
Instagram reels: `{ ig: 'https://www.instagram.com/reel/…', title, note }` renders a link card
(embedding reels is unreliable on phones).

**Schedule** — everything comes from `src/data/schedule.ics`. Run
`npm run schedule:refresh` to pull the latest from the league (needs
`SCHEDULE_ICS_URL`, see above). Week-level notes (Labor Day, last games) live in
`season.weekNotes`; if the league lists a placeholder practice field, set
`season.overrides.practiceLocation`.

**Colors / type** — CSS custom properties at the top of `src/styles/site.css`.
Fonts load from Google Fonts with `display=swap`; remove the `<link>` in
`src/templates/layout.mjs` to go fully self-contained (system fonts take over).

## Deploy

- **GitHub Pages:** push to `main`; `.github/workflows/deploy.yml` builds and
  publishes `dist/` on every push **and once a day** (so the schedule stays
  current). In the repo settings set Pages → Source → *GitHub Actions*, and add a
  repository secret `SCHEDULE_ICS_URL` with the LeagueApps iCal export URL.
  **Custom domain:** point DNS at GitHub Pages (apex: A records to
  185.199.108.153 / .109.153 / .110.153 / .111.153; subdomain or `www`: CNAME to
  `<user>.github.io`), enter the domain under Settings → Pages → Custom domain,
  and put the same domain in `site.domain` in `src/data/season.mjs` (or set the
  `SITE_DOMAIN` env var in the workflow) so the build writes the `CNAME` file.
- **Netlify / Cloudflare Pages:** connect the repo; build command
  `node refresh-schedule.mjs && node build.mjs`, publish directory `dist`
  (`netlify.toml` already says so); set `SCHEDULE_ICS_URL` in the site's
  environment and add a daily build hook if you want automatic refreshes.
- **Anything else:** run `npm run build` and upload `dist/`.

After deploying, open the site once on your phone and "Add to Home Screen" — it
launches full-screen and the service worker keeps it available on the field.

## Notes

- Rules are summarized from `docs/LMYA-House-Rules-2026.pdf` (copied into
  `dist/docs/`); the PDF is the source of truth.
- Personal bests (at-home page) live in the browser's localStorage only —
  nothing is uploaded anywhere.
- The two curriculum PDFs in `docs/` (Transatlantic Soccer, Hearts FC street games)
  informed several games (coconut ball, jail break, four-goal game, cops & robbers)
  but are not published by the site.
