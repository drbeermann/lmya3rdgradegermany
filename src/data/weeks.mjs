// The 10-week plan. Each week is one 60-minute practice:
//   arrival (ball mastery) → two drills → games → scrimmage → huddle.
// Blocks reference drill families/levels (drills.mjs), games (games.mjs),
// at-home challenges (home.mjs) and rules (rules.mjs) by id.

export const weeks = [
  {
    n: 1,
    theme: 'Kickoff',
    tagline: 'Meet the ball, meet the team, learn how we practice.',
    focus: ['passing', 'shooting', 'dribbling'],
    goals: [
      "Learn everyone's name and how our practices work",
      'Pass with the inside of the foot — around the cone, never into it',
      'Shoot with the laces, not the toe',
      'Know the two new rules this year: throw-ins, and no punting by the keeper',
    ],
    coachNotes:
      'First night: names, energy, and lots of touches. Keep every explanation under 30 seconds and demonstrate instead of describing. Set the routine we will use all season — grab a ball and start toe taps the moment you arrive, two stations for the drills (one coach each, swap halfway), games, scrimmage, huddle. Nobody stands in a line. Take a quick baseline for fun: how many toe taps in 30 seconds? We will retest in week 10.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'As kids arrive: toe taps, bells, sole rolls. Count them — this is the week-1 baseline.' },
      { kind: 'drill', minutes: 7, drill: 'passing', levels: [1, 2], note: 'Station 1. Gate pass first (the cone is a defender!), then the throw & settle if it is going well.' },
      { kind: 'drill', minutes: 7, drill: 'shooting', levels: [1], note: 'Station 2. Five stationary laces strikes each, then the slalom. "Show me your laces."' },
      { kind: 'game', minutes: 9, game: 'red-light-green-light', note: 'Introduce yellow light. Whoever wins calls the next round.' },
      { kind: 'game', minutes: 9, game: 'sharks-and-minnows', note: 'Coach is the first shark; sharks on their knees for round one.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'How 7v7 works',
        focus:
          'Split into two teams (pinnies) and play a real game with a keeper each side. Coach the shape, not the skill: **spread out**, we don\'t all chase the ball, three at the back and three in front is plenty. Introduce the two brand-new rules for this year in the first stoppage: the ball is **thrown in** this season, and the keeper **may not punt**. Water break halfway, swap keepers.',
        cues: ['Spread out — can you see grass around you?', 'Throw-in: feet down, behind the head, over the head', 'Keeper: roll it or throw it'],
        rules: ['throw-ins', 'goalkeepers'],
      },
      { kind: 'huddle', minutes: 3, note: 'Names again. What was the most fun? Hand out the at-home challenge: toe taps.' },
    ],
    home: { challenge: 'toe-taps', note: 'Beat your practice number by Wednesday.' },
    saturday: ['Everyone plays about the same amount — four periods, rotation card.', 'Two keepers, one per half. No punting.', 'Cheer for throw-ins that are legal.'],
  },
  {
    n: 2,
    theme: 'Passing & first touch',
    tagline: 'Pass around the defender, then move.',
    focus: ['passing', 'shooting'],
    goals: [
      'Soft first touch, then pass — and move after you pass',
      'Give-and-go: pass, then run for the return',
      'Calm restarts: when our keeper has the ball, wide players go to the build-out line and the keeper rolls it out',
    ],
    coachNotes:
      'The pull-across-and-switch drill is the first one that asks them to **move after passing** — that habit is the whole season in miniature. Shooting off the give-and-go teaches the same idea with a goal at the end. In the scrimmage, coach our restarts: the keeper rolls it out, wide players show at the build-out line.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Toe taps and bells. Anyone beat their number?' },
      { kind: 'drill', minutes: 7, drill: 'passing', levels: [3], note: 'Station 1. Walk it through once: receive, pull across, pass, move.' },
      { kind: 'drill', minutes: 7, drill: 'shooting', levels: [2], note: 'Station 2. Coach at cone 1; run to cone 2; shoot low. Switch sides halfway.' },
      { kind: 'game', minutes: 9, game: 'sharks-and-minnows', note: 'Two sharks now. Sharks: fast then slow, wait for the heavy touch.' },
      { kind: 'game', minutes: 9, game: 'soccer-golf', note: 'Three holes, groups of 4. Farthest away goes first.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Our restarts: build-out line & goal kicks',
        focus:
          'Mark the build-out lines with cones. Every time our keeper has the ball or we have a goal kick, freeze the first few times: opponents jog back behind the line, our two wide players sprint to the line and **show for the ball**, keeper rolls or throws it out, first touch forward. Praise every calm restart, even if the pass is scrappy.',
        cues: ['Keeper\'s got it: wide players to the line!', 'Roll it, don\'t boot it', 'Other keeper\'s got it: jog back, then press when they touch it'],
        rules: ['build-out-line', 'goalkeepers'],
      },
      { kind: 'huddle', minutes: 3, note: 'Ask: why do we roll it out instead of kicking it long? At-home: wall passes.' },
    ],
    home: { challenge: 'wall-passes', note: 'Left foot counts double this week.' },
    saturday: ['Calm restarts: wide players to the build-out line, keeper rolls it.', 'Look for one give-and-go in the game and celebrate it loudly.'],
  },
  {
    n: 3,
    theme: 'Dribbling & turning',
    tagline: 'Turn away from the defender, then go.',
    focus: ['dribbling', 'passing', 'throw-ins'],
    goals: [
      'Three turns at the cone: inside cut, outside cut, pull-back — both feet',
      "Receive with the back foot so your first touch points where you're going",
      'A legal throw-in every time: feet down, behind the head, over the head',
      "Understand offside at the build-out line: don't wait past the red line",
    ],
    coachNotes:
      'No game this weekend (Labor Day), so this is a great week to slow down on technique. Three turns at the cone, then the passing square where the "back foot" first touch appears for the first time. Spend five minutes on throw-in technique before the scrimmage and then call throw-ins strictly (with the one re-throw, like the real rule).',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Add "freeze" and "turn" on the whistle.' },
      { kind: 'drill', minutes: 7, drill: 'dribbling', levels: [3], note: 'Station 1. Inside cut, outside cut, pull-back. Both feet.' },
      { kind: 'drill', minutes: 7, drill: 'passing', levels: [4], note: 'Station 2. Receive with the back foot, first touch toward the next cone. Switch direction on "switch".' },
      { kind: 'game', minutes: 9, game: 'knockout', note: 'Shrink the grid as players go out. Three rounds.' },
      { kind: 'game', minutes: 9, game: 'gates-game', note: '60 seconds, count your gates, rest, beat it.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Throw-ins done right + offside intro',
        focus:
          'Five minutes of throw-in technique in pairs on the touchline (feet down, behind the head, over the head — no run-up), then scrimmage with every throw-in coached live: nearest player takes it fast, two options. Introduce offside using the build-out line: freeze play the first time a forward is waiting past the line and show them where to stand — level with the line until the ball is kicked.',
        cues: ['Nearest player takes it — quickly', 'Two options: short and up the line', 'Don\'t wait past the red line — ball first, then you'],
        rules: ['throw-ins', 'offside'],
        drills: [{ drill: 'throw-ins', levels: [1] }],
      },
      { kind: 'huddle', minutes: 3, note: 'Three rules of a legal throw — who can say them? At-home: turn & burn.' },
    ],
    home: { challenge: 'turns', note: 'A different turn each round: inside, outside, pull-back.' },
    saturday: ['No games this weekend. Do the at-home challenge twice instead.'],
  },
  {
    n: 4,
    theme: 'Shooting & finishing',
    tagline: 'Beat the defender with a pass, then finish.',
    focus: ['shooting', 'passing', 'defending'],
    goals: [
      'Beat a defender with a pass: dribble at them, pass when they commit',
      'Defenders: stay between the ball and the goal, be patient',
      'One simple corner-kick routine everyone knows',
      'Play World Cup for the first time',
    ],
    coachNotes:
      '2v1 to goal is the most game-like thing we have done so far and it teaches both sides at once: attackers learn *when* to pass, the defender learns to delay and stay goal-side. Keep the coaching for the defender to one sentence: "stay between the ball and the goal, be patient." First World Cup tonight — explain it once, then let it run.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Toe taps, then pull-back push. Heads up on the last 10 seconds.' },
      { kind: 'drill', minutes: 7, drill: 'shooting', levels: [3], note: 'Station 1. 2v1 to goal; coach is a walking defender for the first two reps.' },
      { kind: 'drill', minutes: 7, drill: 'passing', levels: [5], note: 'Station 2. Pass & follow. Two touches, then one touch on the second lap.' },
      { kind: 'game', minutes: 8, game: 'target-triangles', note: '1 / 3 / 7 points, best of three rounds.' },
      { kind: 'game', minutes: 10, game: 'world-cup', note: 'Coach in goal, coach serving. Pairs pick countries. Score to advance.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Corners',
        focus:
          'Corners are direct and taken from the arc. Show one simple routine: one player takes it, two attack the goal (near post and far post), one stays at the top of the box for the rebound, and everyone else stays back. Defending a corner: everyone goal-side of an attacker, keeper ready to catch. Award a corner every time the ball goes out over the goal line off a defender — call it deliberately a few extra times so both teams get reps.',
        cues: ['Corner: two to the goal, one at the top, rest stay back', 'Defending: find someone to mark, be goal-side', 'Keeper: hands ready, come and catch it'],
        rules: ['restarts'],
      },
      { kind: 'huddle', minutes: 3, note: 'Who scored in World Cup? At-home: target shots (laces!).' },
    ],
    home: { challenge: 'target-shots', note: '10 with each foot. Laces, ball on the ground.' },
    saturday: ['One corner routine — everybody knows their job.', 'Look for a 2v1: dribble at the defender, pass when they commit.'],
  },
  {
    n: 5,
    theme: 'Defending 1v1',
    tagline: 'Fast, then slow. Low. Patient.',
    focus: ['defending', 'goalkeeping', 'dribbling'],
    goals: [
      "Defend like this: fast, then slow, low, patient — don't dive in",
      'Everyone learns the keeper basics: ready position, W hands, scoop, roll it out',
      'In the game: nearest player pressures, everyone else gets goal-side',
    ],
    coachNotes:
      'Defending is a mindset: we delay, we don\'t dive in. Station 1 is pure defending (shadow, then 1v1 to a line); station 2 is goalkeeping basics with the other coach so every kid gets keeper reps before their turn on Saturday. In the scrimmage, coach only two things: get goal-side, and don\'t all chase the ball.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [2], note: 'Dribble, stop, go in a 20 × 15 grid; coach holds up fingers.' },
      { kind: 'drill', minutes: 7, drill: 'defending', levels: [1, 2], note: 'Station 1. Shadow defending for 2 minutes, then 1v1 to a line. Defender passes to start.' },
      { kind: 'drill', minutes: 7, drill: 'goalkeeping', levels: [1, 2], note: 'Station 2. Ready position, W and scoop, then rolling and throwing to wide teammates. Every kid takes a turn.' },
      { kind: 'game', minutes: 9, game: 'cops-and-robbers', note: 'Cops pass along the ground below the knee. Robbers dribble a ball in round two.' },
      { kind: 'game', minutes: 9, game: 'knockout', note: 'Points version: +1 for a knock-out, −1 when yours goes. Nobody sits out.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Defend goal-side, don\'t all chase',
        focus:
          'Freeze play when we lose the ball and look at where our players are: is anyone between the ball and our goal? Ask the nearest defender to show "fast then slow" and the rest to drop goal-side rather than sprint at the ball. Rotate keepers at halftime; keeper distribution by roll or throw only.',
        cues: ['Nearest player: fast then slow, get low', 'Everyone else: get goal-side', 'Don\'t dive in — make them make a mistake'],
        rules: ['goalkeepers', 'safety'],
      },
      { kind: 'huddle', minutes: 3, note: 'What are the three defending words? (Fast, slow, patient.) At-home: bells.' },
    ],
    home: { challenge: 'bells', note: 'Knees bent, small hops.' },
    saturday: ['Nearest player pressures, everyone else gets goal-side.', 'Keeper: catch, breathe, roll it out.'],
  },
  {
    n: 6,
    theme: 'Give-and-go',
    tagline: 'Pass, and GO.',
    focus: ['passing', 'dribbling', 'throw-ins'],
    goals: [
      'The give-and-go around the square: give it, and go',
      'First move: the body feint — slow move, fast exit',
      'When the other team restarts, retreat behind the line, then press on their first touch',
      'Throw-ins: come to the ball, settle it, pass',
    ],
    coachNotes:
      'The give-and-go around the square is the payoff of five weeks of passing. Expect it to be messy for the first three minutes; if it breaks down, drop to "pass, get it back, pass on, follow" and build up again. Station 2 is the first real move (body feint, then scissors). World Cup with a "must pass first" rule forces the give-and-go into a game.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Toe taps and bells; anyone beat their number?' },
      { kind: 'drill', minutes: 7, drill: 'passing', levels: [6], note: 'Station 1. Pass, first-time return, play into the run. "One-two!"' },
      { kind: 'drill', minutes: 7, drill: 'dribbling', levels: [4], note: 'Station 2. Body feint this week (scissors next time). Slow move, fast exit.' },
      { kind: 'game', minutes: 8, game: 'gates-game', note: 'Add two defenders who can close a gate by standing in it.' },
      { kind: 'game', minutes: 10, game: 'world-cup', note: 'Round 2 onward: must complete a pass before shooting.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Pressing their build-out line + offside review',
        focus:
          'When the other keeper has the ball we retreat behind the build-out line — then the moment they touch it, our two forwards **press** and everyone else steps up. Show it once at walking pace. Review offside: forwards hover level with the line, run when the ball is kicked. Throw-ins: receiver comes to the ball, settles, passes.',
        cues: ['Retreat, then press on the first touch', 'Level with the line, then go', 'Throw-in: come to the ball, settle, pass'],
        rules: ['build-out-line', 'offside'],
        drills: [{ drill: 'throw-ins', levels: [2] }],
      },
      { kind: 'huddle', minutes: 3, note: 'Best give-and-go of the night gets a cheer. At-home: make a move.' },
    ],
    home: { challenge: 'moves', note: 'Body feint 10 times each side; then scissors.' },
    saturday: ['Press when they touch it after a restart.', 'Give-and-gos: pass, and go.'],
  },
  {
    n: 7,
    theme: 'Turn & attack',
    tagline: 'Win it, turn, go quick.',
    focus: ['shooting', 'defending', 'passing'],
    goals: [
      'Look over your shoulder before the ball arrives, then turn and shoot',
      "2v1 defending: you can't stop both — delay and force them wide",
      'When we win the ball: look forward first, go quick',
    ],
    coachNotes:
      'Turn & shoot adds the look over the shoulder before the ball arrives; the 2v1 defending station makes the defender\'s job explicit (delay, deny, force wide). Numbers Game is a great way to run 1v1s, 2v2s and 2v1s without lines. Scrimmage focus is transition: the moment we win the ball, can we play forward in two passes?',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Toe taps, sole rolls, standing stepovers.' },
      { kind: 'drill', minutes: 7, drill: 'shooting', levels: [4], note: 'Station 1. Back to goal, look over the shoulder, turn with the first touch, shoot with the second.' },
      { kind: 'drill', minutes: 7, drill: 'defending', levels: [3], note: 'Station 2. 2v1 with the coaching aimed at the defender: goal-side, patient, force wide.' },
      { kind: 'game', minutes: 10, game: 'numbers-game', note: 'Call "2!", "1, 3!", "2 v 3" for overloads. 30–40 seconds a round.' },
      { kind: 'game', minutes: 8, game: 'soccer-golf', note: 'Weak-foot hole. Par 3 each.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Transition: win it, go quick',
        focus:
          'When we win the ball: look forward first, dribble if there is space, otherwise a quick pass — try a give-and-go. When we lose it: nearest player fast-then-slow, next player covers behind ("one presses, one covers"). Keep restarts quick. Award a bonus goal for any goal scored within three passes of winning the ball.',
        cues: ['Won it? Look forward first', 'One presses, one covers', 'Quick restarts — nearest player takes it'],
        rules: ['restarts'],
      },
      { kind: 'huddle', minutes: 3, note: 'What do you look at before the ball arrives? At-home: juggling.' },
    ],
    home: { challenge: 'juggling', note: 'Rookie level allows one bounce between touches. Record = touches in a row.' },
    saturday: ['Win it, look forward.', 'One presses, one covers.'],
  },
  {
    n: 8,
    theme: 'Finishing & keeping',
    tagline: 'Shoot early. Keeper: catch, breathe, roll.',
    focus: ['shooting', 'goalkeeping'],
    goals: [
      'Shoot early — low, to a corner',
      'Keepers: catch, breathe, let the traffic clear, then roll or throw it out',
      'Goal kicks and corners done calmly, even with pressure',
    ],
    coachNotes:
      '1v1 to goal puts a live defender and a keeper against every attacker; the keeper station rounds out the goalkeeping progression with shot stopping. Jail Break and Coconut Ball are both accuracy games. In the scrimmage, run our restarts under a little pressure and revisit corners now that they know the routine.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Toe taps and bells; count them.' },
      { kind: 'drill', minutes: 7, drill: 'shooting', levels: [5], note: 'Station 1. 1v1 to goal from a serve; the defender runs out from beside the goal.' },
      { kind: 'drill', minutes: 7, drill: 'goalkeeping', levels: [3, 2], note: 'Station 2. Shot stopping from 8–10 yards, then roll and throw it out. Rotate every 6 shots.' },
      { kind: 'game', minutes: 10, game: 'jail-break', note: 'Score: free a teammate or jail an opponent. Miss: jail.' },
      { kind: 'game', minutes: 8, game: 'coconut-ball', note: '60 seconds each foot; winners move up a court.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Goal kicks & corners under pressure',
        focus:
          'Play normally but let opponents press as soon as our first player touches the goal kick or keeper roll — so the pass must be good and the wide player\'s first touch must be forward. Corners: run the routine from week 4 both ways. Keepers: catch, breathe, let traffic clear, distribute.',
        cues: ['Goal kick: to a side, never up the middle', 'Wide player: first touch forward', 'Corner routine: two to goal, one at the top'],
        rules: ['restarts', 'build-out-line'],
      },
      { kind: 'huddle', minutes: 3, note: 'Keeper of the night. At-home: cone slalom time trial.' },
    ],
    home: { challenge: 'slalom', note: 'Six shoes in a line, two big steps apart. Time it.' },
    saturday: ['Shoot early — low, to a corner.', 'Keeper: catch it, breathe, roll it out wide.'],
  },
  {
    n: 9,
    theme: 'Play like a team',
    tagline: 'Keep the ball, switch the play, cover each other.',
    focus: ['passing', 'defending', 'shooting'],
    goals: [
      'Keep the ball as a group: the rondo',
      'Switch the play when one side is crowded',
      'Every restart quick and to a teammate — kickoff, throw-in, goal kick, corner, free kick',
    ],
    coachNotes:
      'The rondo is where the passing progression ends up: passing to keep the ball from a real defender. 2v2 to goal (with press-and-cover) is the defending finale. The Four-Goal Game teaches switching the play better than any speech. In the scrimmage, run through every restart quickly — this is the dress rehearsal for the last two games.',
    blocks: [
      { kind: 'arrival', minutes: 4, drill: 'dribbling', levels: [1], note: 'Toe taps and bells; count them.' },
      { kind: 'drill', minutes: 7, drill: 'passing', levels: [7], note: 'Station 1. Rondo 4v1: five passes is a goal, a nutmeg is a bonus.' },
      { kind: 'drill', minutes: 7, drill: 'shooting', levels: [6], note: 'Station 2. 2v2 to goal with the defending cues: one presses, one covers.' },
      { kind: 'game', minutes: 10, game: 'four-goal-game', note: 'If one goal is crowded, switch to the other. Bonus for a goal after a switch.' },
      { kind: 'game', minutes: 8, game: 'target-triangles', note: 'Team totals — two teams, add up the points.' },
      {
        kind: 'scrimmage', minutes: 21, title: 'Set-piece run-through',
        focus:
          'Every restart, done fast and done right: kickoff (pass back to a midfielder, then forward), throw-ins (nearest player, two options), goal kicks (wide, opponents behind the build-out line), corners (the routine), free kicks (direct vs indirect: the ref will raise an arm for indirect — someone else must touch it before a goal). Coaches referee strictly to make it real.',
        cues: ['Every restart quick', 'Kickoff: back, then forward', 'Indirect free kick: someone else has to touch it'],
        rules: ['restarts', 'throw-ins', 'build-out-line'],
        drills: [{ drill: 'throw-ins', levels: [3] }],
      },
      { kind: 'huddle', minutes: 3, note: 'Two games left. At-home: backyard soccer golf.' },
    ],
    home: { challenge: 'backyard-golf', note: 'Three holes, same course each time — beat your total.' },
    saturday: ['Switch the play when one side is crowded.', 'Every restart quick and to a teammate.'],
  },
  {
    n: 10,
    theme: 'Finale',
    tagline: 'Everything we learned, and a party.',
    focus: ['passing', 'shooting', 'dribbling'],
    goals: [
      "See how far we've come: retest the toe-taps number from week 1",
      'Play our favorite games one more time',
      'World Cup final — and just play',
    ],
    coachNotes:
      'Retest the week-1 baseline (toe taps in 30 seconds) so every kid sees a number that went up. Then greatest hits: kids vote for their favorite drills and games. World Cup final with full ceremony. Finish with a short scrimmage and, if the mood is right, a five-minute kids-versus-coaches game. Last game is Saturday.',
    blocks: [
      { kind: 'arrival', minutes: 5, drill: 'dribbling', levels: [1], note: 'Retest: toe taps in 30 seconds. Write it next to the week-1 number.' },
      { kind: 'drill', minutes: 6, drill: 'passing', levels: [6], note: 'Station 1. Give-and-go around the square — look how far this has come.' },
      { kind: 'drill', minutes: 6, drill: 'shooting', levels: [2], note: 'Station 2. Give-and-go & shoot, both feet. Every kid scores at least once.' },
      { kind: 'game', minutes: 8, game: 'sharks-and-minnows', note: 'Kids\' choice: sharks, knockout or red light green light — vote at the huddle before.' },
      { kind: 'game', minutes: 12, game: 'world-cup', note: 'The Finale. Countries, anthems optional. First goal wins the final.' },
      {
        kind: 'scrimmage', minutes: 20, title: 'Just play',
        focus:
          'Minimal coaching. Praise the things we practiced when you see them: a calm restart, a give-and-go, a patient defender, a keeper roll. Kids vs coaches for the last five minutes if numbers allow (coaches walk).',
        cues: ['Play — you know what to do'],
        rules: [],
      },
      { kind: 'huddle', minutes: 3, note: 'Season awards: one thing each kid got better at. Keep playing over the winter — the at-home page stays up.' },
    ],
    home: { challenge: 'gates-at-home', note: 'Then go back and beat every record on the At-Home page.' },
    saturday: ['Last games. Play everyone, celebrate everything.'],
  },
];

export const weekByN = Object.fromEntries(weeks.map((w) => [w.n, w]));
