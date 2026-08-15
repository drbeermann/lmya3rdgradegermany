// Digest of the LMYA House Rules (2026) as they apply to 3rd grade.
// Source: docs/LMYA-House-Rules-2026.pdf (copied into the site as /docs/).
// Where the House Rules are silent, IFAB Laws of the Game apply.

export const rulesSource = {
  title: 'LMYA Youth Soccer League — House Rules 2026',
  file: 'docs/LMYA-House-Rules-2026.pdf',
  conduct: 'https://lmyasports.com/soccer/rules-conduct/',
};

export const quickFacts = [
  { k: 'Format', v: '7v7 — six field players + a goalkeeper' },
  { k: 'Field', v: 'About 60 × 40 yards, with build-out lines, penalty area, goal area, penalty spot, center circle' },
  { k: 'Ball', v: 'Size 4 (home team provides)' },
  { k: 'Game length', v: 'Two 25-minute halves; 2-minute water break at 12½ minutes of each half; halftime up to 10 minutes' },
  { k: 'Minimum players', v: '5 to avoid a forfeit (10 minutes after start time)' },
  { k: 'Substitutions', v: 'Only at water breaks and halftime (plus injury / caution)' },
  { k: 'Goalkeeper', v: 'No keeper plays more than half the game; keepers may not punt; report GK changes to the referee' },
  { k: 'Offside', v: 'The build-out line is the offside line' },
  { k: 'Throw-ins', v: 'Yes — one re-throw allowed after a bad throw' },
  { k: 'Corners', v: 'Direct, from the corner arc' },
  { k: 'Heading', v: 'Not allowed (indirect free kick)' },
  { k: 'Slide tackling', v: 'Not allowed (direct free kick / penalty)' },
  { k: 'Standings', v: 'Win 3, tie 1, loss 0; tiebreakers: record, head-to-head, goals allowed' },
];

export const rules = [
  {
    id: 'build-out-line',
    title: 'The build-out line',
    video: ['build-out-line', 'build-out-offside'],
    summary:
      'When our goalkeeper has the ball in their hands, or we have a goal kick or a free kick in our end, the other team must **retreat behind the build-out line** and may not come back across it until one of our players has touched the ball. The point is to let the defending team restart calmly and keep possession instead of hoofing it. On a quick restart, opponents don\'t have to retreat but can\'t challenge until a player has touched the ball after it clearly moves.',
    kids: [
      'Keeper has it? Everyone in white gets to the build-out line and **shows for a pass** — one on each side, one in the middle.',
      'Other team\'s keeper has it? We jog back behind their build-out line and get ready to press the *second* they touch it.',
      'Keeper: no punting. Roll it or throw it to a wide teammate, or put it down and pass.',
    ],
    coach: 'This is the biggest tactical idea of the season and it directly rewards the passing we practice. Rehearse it in every scrimmage: keeper collects → wide players sprint to the line → keeper rolls out → first touch forward.',
    saturday: ['We should almost never lose the ball straight from a keeper restart.', 'When the other team restarts, our forwards line up on the build-out line and go as soon as the ball is touched.'],
    diagram: {
      w: 40, h: 28, title: 'Build-out line restart', legend: false,
      items: [
        { t: 'field', x: 2, y: 1.5, w: 36, h: 24, buildout: true },
        { t: 'gk', x: 5.5, y: 13.5, ball: true },
        { t: 'player', x: 13, y: 5.5, label: 'W' }, { t: 'player', x: 13, y: 21.5, label: 'W' }, { t: 'player', x: 14.5, y: 13.5, label: 'M' },
        { t: 'player', x: 20, y: 8.5, team: 'b' }, { t: 'player', x: 20, y: 13.5, team: 'b' }, { t: 'player', x: 20, y: 18.5, team: 'b' },
        { t: 'pass', from: [7, 12.6], to: [11.6, 6.6] },
        { t: 'text', x: 20, y: 27.4, s: 'opponents wait behind the line until a white player touches the ball', tone: 'soft', size: 8.5 },
      ],
    },
  },
  {
    id: 'offside',
    title: 'Offside (build-out line version)',
    video: ['offside-7v7', 'offside-kids'],
    summary:
      'In 3rd grade the build-out line replaces the halfway line for offside. An attacker is in an offside position if they are on the **goal side of the opponent\'s build-out line** when a teammate plays the ball across that line and they are involved in the play. Penalty: an indirect free kick for the defense from the spot. Being level with the line, or receiving the ball while behind it and then running on, is fine.',
    kids: [
      'Don\'t **wait** past the red line — stay level with it until the ball is kicked, then go.',
      '"Ball first, then you" — the pass goes forward and you chase it.',
    ],
    coach: 'Practice this in scrimmage by freezing play the moment a forward is caught cherry-picking. Referees will call it; better they learn it from us.',
    saturday: ['Forwards: hover on the build-out line, run when the ball is played.', 'Defenders: step up to the line together when we clear it — the other team\'s forwards will get caught.'],
    diagram: {
      w: 40, h: 28, title: 'Offside at the build-out line', legend: false,
      items: [
        { t: 'field', x: 2, y: 1.5, w: 36, h: 24, buildout: true },
        { t: 'player', x: 17, y: 12.5, label: 'P', ball: true },
        { t: 'player', x: 30, y: 8.5, label: 'A' },
        { t: 'player', x: 24, y: 18.5, label: 'B' },
        { t: 'player', x: 28, y: 13, team: 'b' },
        { t: 'gk', x: 34.5, y: 13.5 },
        { t: 'pass', from: [18.6, 11.9], to: [28.5, 9] },
        { t: 'text', x: 21, y: 27.4, s: 'A is past the line when the ball is played → offside. B is behind it → onside, go!', tone: 'soft', size: 8.5 },
        { t: 'text', x: 30, y: 6, s: 'offside', tone: 'red', size: 8, bold: true },
        { t: 'text', x: 24, y: 21.6, s: 'onside', tone: 'soft', size: 8, bold: true },
      ],
    },
  },
  {
    id: 'substitutions',
    title: 'Substitutions & the water-break system',
    summary:
      'Third graders can only be substituted at the water breaks (12½ minutes into each half) and at halftime — plus after an injury (only the injured player) or a caution (only the cautioned player, with the referee\'s permission). Players wait at the halfway line until the referee waves them on. This means every game has **four ~12-minute periods**, and every kid should play at least two of them.',
    kids: ['When you come off, grab water and cheer — you\'re going back in.', 'When you go on, wait at the halfway line for the ref\'s wave.'],
    coach: 'Plan the rotation before the game: write four periods on a card. Keepers rotate at halftime at the latest (max half a game). Play short rather than break the rules on an injury sub.',
    saturday: ['Rotation card done before warm-up.', 'Everyone plays roughly equal minutes across the four periods.'],
  },
  {
    id: 'goalkeepers',
    title: 'Goalkeepers',
    video: 'gk-distribution',
    summary:
      'No keeper may play more than half the game, keepers **may not punt**, and a keeper change must be reported to the referee. Opponents may not harass the keeper while they are putting the ball in play (indirect free kick), and avoidable contact with the keeper in their own area can mean an ejection. Inside the penalty area, drop balls go to the keeper.',
    kids: ['Keeper: hands up, get behind the ball, hug it in.', 'Got it? Look wide and **roll** or **throw** it — no punts.', 'Field players: get to the build-out line and show for it.'],
    coach: 'Every kid takes a turn in goal across the season. Teach the ready position, the scoop and rolling/throwing in the goalkeeping progression; a calm keeper roll to a wide defender is our best attack.',
    saturday: ['Two keepers per game, one per half.', 'Keeper distribution: roll or throw to a wide teammate on the build-out line.'],
  },
  {
    id: 'throw-ins',
    title: 'Throw-ins',
    video: 'throw-in-rules',
    summary:
      'From 3rd grade up, the ball is thrown in when it crosses the touchline: both feet on the ground on or behind the line, both hands, from behind and over the head. In 3rd grade only, a bad throw gets **one re-throw** (the ref is encouraged to explain what went wrong), and if the thrower plays the ball a second time before anyone else touches it, one re-throw is allowed.',
    kids: ['Feet glued down. Behind the head, over the head.', 'Throw to a teammate\'s feet — it\'s a pass, not a punt.', 'After you throw, step onto the field to help.'],
    coach: 'Nearest player takes it fast; two teammates give options (short and up the line). See the throw-in progression.',
    saturday: ['Quick throw-ins, to feet.', 'Two options every time.'],
  },
  {
    id: 'restarts',
    title: 'Corners, goal kicks and free kicks',
    summary:
      'Corners are **direct** and taken from inside the corner arc. Goal kicks: place the ball in the goal area and play it out — opponents retreat behind the build-out line until it\'s touched. Fouls give direct or indirect free kicks per the IFAB Laws (the House Rules only make K–2 fouls indirect). Drop balls go to the team that last touched the ball; inside the penalty area, to the keeper.',
    kids: ['Corner: one player takes it, two go to the goal, one stays back at the top of the box.', 'Goal kick: spread wide to the build-out line; the kick goes to a **side**, not up the middle.'],
    coach: 'Keep set plays simple: one corner routine (short corner to a teammate, or a driven ball to the near post) and one goal-kick shape (two wide, one central).',
    saturday: ['We know who takes corners and goal kicks before the game.', 'Wide players are already moving before the restart is taken.'],
  },
  {
    id: 'safety',
    title: 'No heading, no slide tackling, and equipment',
    summary:
      'Players in 5th/6th grade and younger may not head the ball in games or practice — a deliberate header is an indirect free kick (moved outside the penalty area if it happens inside). Slide tackling is not allowed at any level: direct free kick, or a penalty kick if a defender does it in their own area (sliding to block a shot is OK if it endangers no one). Intentional handball to stop a goal is an automatic red card. **Shin guards are required**; no jewelry, earrings (even taped), hard casts, or rigid-brimmed hats; medical bracelets taped with info visible.',
    kids: ['Ball in the air at head height? Chest it or let it bounce — never head it.', 'Stay on your feet when you tackle.', 'Shin guards every game, every practice.'],
    coach: 'The referee checks equipment before the game; a kid without shin guards doesn\'t play.',
    saturday: ['Shin guards, size 4 ball, water.', 'Remind parents: no earrings.'],
  },
  {
    id: 'sidelines',
    title: 'Coaches, parents & the referee',
    summary:
      'Coaches stay in the technical area (a 10-yard box on our side of the field, starting 10 yards from the halfway line, 1 yard behind the touchline); both benches on the same side, spectators on the opposite side, **nobody behind the goals**. Only the head coach speaks to the referee. Positive coaching from the sideline is fine (encouragement, position reminders); no dissent, no coaching by spectators. A coach leaving the technical area without permission can be cautioned. Referees may warn or eject spectators, and the coach is responsible for our sideline.',
    kids: ['Play to the whistle. The ref\'s call is the call.', 'Say "good game" to the other team.'],
    coach: 'One of us is the designated head coach for referee conversations each game. Cheer, don\'t joystick — kids learn by making decisions.',
    saturday: ['Parents on the far side, cheering, not coaching.', 'One coach talks to the referee.'],
  },
  {
    id: 'game-facts',
    title: 'Game facts to know',
    summary:
      'Two 25-minute halves with a 2-minute water break at 12½ minutes; halftime is 10 minutes max. 7 players on the field including the keeper; we can start with as few as 5, and a team that has more players does not have to play down. If a referee hasn\'t arrived 15 minutes after game time, the game is abandoned and rescheduled. Lightning stops play for at least 30 minutes. Standings: 3 for a win, 1 for a tie.',
    kids: ['Four periods, everyone plays.', 'Water at every break.'],
    coach: 'Arrive 30 minutes before kickoff for warm-up: ball mastery, passing gate, a few shots, then the rotation card.',
    saturday: ['Rotation card, size 4 ball, first-aid kit, water.'],
  },
];
