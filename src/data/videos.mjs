// Video registry. Drill levels, games, challenges and rules reference these by
// key (a single key or an array of keys). Every id below was verified against
// YouTube's oEmbed endpoint when the site was built (Aug 2026).
//   yt      YouTube video id
//   title   shown under the thumbnail (exact YouTube title)
//   channel channel name
//   len     length as shown to the user
//   start   optional start time in seconds
//   end     optional end time in seconds (e.g. to stop before a punting segment)
//   note    optional one-line "why / what to watch for"
// Instagram reels: { ig: 'https://www.instagram.com/reel/…', title, note } → link card.
//
// To add a video: paste the id, then run `npm run check` (missing keys are
// reported) — or verify by opening https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json

export const videos = {
  /* passing & receiving */
  'passing-inside-foot': { yt: 'y8w-hee2xPM', title: 'Push Pass — US Youth Soccer Skills School', channel: 'US Youth Soccer', len: '1:14', note: 'Plant foot beside the ball, ankle locked, strike through the middle, follow through.' },
  'passing-inside-foot-parents': { yt: 'Ws2m0cZLkq0', title: 'Passing: Inside of the Foot', channel: 'Parent Soccer Coach', len: '1:55', note: 'Made for parent-coaches: how to demo it and the common mistakes.' },
  'receiving-first-touch': { yt: 'nsGQsA9qBbI', title: 'Receiving on the Ground', channel: 'MOJO', len: '1:07', note: 'Kids demonstrating the cushioned first touch.' },
  'receiving-air': { yt: 'KByZalrdZO4', title: 'How To Receive The Ball In The Air With Your Feet', channel: 'MOJO', len: '0:51', note: 'Exactly the throw & settle: settle a tossed ball with the feet.' },
  'receiving-thigh': { yt: '8tMBsFnEkXQ', title: 'Receiving With The Thigh', channel: 'MOJO', len: '1:05' },
  'passing-square': { yt: 'G30S6lqWdhw', title: 'Four Corners Passing Activity', channel: 'Cal South Soccer', len: '3:01', note: 'Real 10U kids: pass to the next corner and move, with coaching points.' },
  'passing-square-animated': { yt: 'jmznvOYRHGw', title: '3 EASY Square Passing Combinations', channel: 'Onside – Training', len: '1:45', note: 'Animated: variation 1 is pass-and-follow, variation 2 adds the one-two.' },
  'give-and-go': { yt: 'S4EDBmx-Ib4', title: 'What Is A Give And Go?', channel: 'MOJO', len: '1:07', note: 'The wall pass explained at kid level.' },

  /* shooting */
  'shooting-laces': { yt: '4zn2D__2jwQ', title: 'How To Shoot With The Laces And Inside Of The Foot', channel: 'MOJO', len: '1:03', note: 'Plant foot beside the ball, toe down, laces.' },
  'shooting-mistakes': { yt: 'RxgvI5IHN-c', title: 'Common Shooting Mistakes', channel: 'MOJO', len: '1:20', note: 'Toe-poke, leaning back, plant foot too far — and the fixes.' },
  'shooting-instep': { yt: 'WovDeOPd3oM', title: 'In Step Drive, Shooting at Goal — US Youth Soccer Quick Tips', channel: 'US Youth Soccer', len: '1:00' },
  'turn-and-shoot': { yt: 'k-dpcfQMwC8', title: 'Turn & Shoot Drill For Football/Soccer | U8, U9, U10', channel: 'KS Performance', len: '3:02', note: 'Dribble through cones, turn and finish — the U8–U10 version.' },
  'finishing-u9': { yt: 'EYf0akmOrS0', title: 'Soccer Drill: Finishing (U9)', channel: 'The Coaching Manual', len: '3:40', note: 'U9 finishing session with 1v1 and 2v1 progressions.' },
  'two-v-one': { yt: '3QzTKMB0wIs', title: '2v1 to Goal', channel: 'MOJO', len: '1:16', note: 'Commit the defender, then pass or go.' },
  'two-v-one-u9': { yt: 'CLfDYEbqDiQ', title: 'Soccer Coaching Drill: Attacking Overloads (U9)', channel: 'The Coaching Manual', len: '3:24', note: 'When to pass vs dribble: draw the defender, then release.' },

  /* defending */
  'defending-pressure': { yt: 'g0L3ou4ENu8', title: 'What Is Pressure?', channel: 'MOJO', len: '1:02', note: 'Approach fast, slow down, goal-side, be patient — in one minute.' },
  'one-v-one-defending': { yt: 'uVkpeXS6Byw', title: "Don't Dive In | 1 vs 1 | Defending Drill", channel: 'KS Performance', len: '1:47', note: 'Stay close, move with the attacker, don\'t dive in.' },
  'defending-usys': { yt: 'XsHs4dW4pNY', title: 'How to Defend — US Youth Soccer Quick Tips', channel: 'US Youth Soccer', len: '4:03' },

  /* dribbling */
  'ball-mastery': { yt: 'Kb63N_78jIw', title: 'Soccer skills at home — Toe taps, Foundations, Sole rolls', channel: 'Arizona Sports Complex', len: '1:47', note: 'The arrival trio: toe taps, bells (foundations), sole rolls.' },
  'pullback': { yt: 'cWa4c6jfiTc', title: 'How To Do A Pullback', channel: 'MOJO', len: '0:46' },
  'dribbling-turns': { yt: 'Gms0BBPdGiY', title: 'How to do the Inside & Outside Cut Turn', channel: 'Football Skills Coach', len: '1:57', note: 'Step-by-step inside cut and outside cut.' },
  'five-turns': { yt: '88Ph3d-dp-8', title: '5 Turns To Improve Ball Control | U7 U8 U9 U10', channel: 'KS Performance', len: '2:49', note: 'Drill format with five turns including inside cut, outside cut and Cruyff.' },
  'first-move': { yt: '2UwRk0jasTQ', title: 'How To Do A Scissor', channel: 'MOJO', len: '1:01', note: 'The scissors as a first move.' },
  'stepover': { yt: 'eLH0B83NbCU', title: 'How To Do A Step Over', channel: 'MOJO', len: '1:11' },
  'six-skills': { yt: 'EwHEwfhWECM', title: '6 Soccer Skills Kids Love', channel: 'MOJO', len: '5:28', note: 'Chapters: 0:06 stepover · 1:05 scissor · 1:55 pull back · 2:39 Cruyff · 3:31 chop.' },

  /* throw-ins */
  'throw-in': { yt: 'Umku3eCWg9Y', title: 'How To Do A Throw-In', channel: 'MOJO', len: '1:18', note: 'Both feet down, ball from behind and over the head, follow through.' },
  'throw-in-rules': { yt: 'ZUMT8hsC818', title: 'Learn the Rules of a Soccer Throw In', channel: 'SIKANA English', len: '1:28', note: 'What makes a throw legal vs a foul throw.' },

  /* goalkeeping */
  'gk-ready': { yt: 'C-JcvF8QTOk', title: 'How to Be in a Goalkeeper Ready Position', channel: 'Eastern Pennsylvania Youth Soccer', len: '0:54' },
  'gk-catch': { yt: 'IsRDkXxpVt8', title: 'How to Contour Catch as a Goalkeeper', channel: 'Eastern Pennsylvania Youth Soccer', len: '0:50', note: 'The W / contour hands.' },
  'gk-scoop': { yt: 'HCyWU09ZGo4', title: 'How to Scoop Grounders as a Goalkeeper', channel: 'Eastern Pennsylvania Youth Soccer', len: '0:41' },
  'gk-basket': { yt: 'fVxgYaDFtfY', title: 'The Basket Catch', channel: 'MOJO', len: '0:54' },
  'gk-distribution': { yt: 'g3YmF2WU4Kk', title: 'Basic Goalkeeper Distribution: Rolling and Throwing', channel: 'Richmond Goalkeeping Academy', len: '3:01', note: 'Rolling and throwing — the no-punt league\'s toolkit.' },
  'gk-9-skills': { yt: 'k1i6kWXi2Ls', title: '9 Essential Goalkeeping Skills', channel: 'MOJO', len: '6:40 (of 8:37)', end: 400, note: 'Basket catch 0:15 · W catch 0:56 · footwork 1:51 · ground balls 2:45 · distribution 5:22. Stops before the punting section (not allowed in our league).' },
  'gk-basics': { yt: 'k1i6kWXi2Ls', title: '9 Essential Goalkeeping Skills', channel: 'MOJO', len: '6:40 (of 8:37)', end: 400, note: 'Stops before the punting section — no punting in our league.' },

  /* games */
  'red-light-green-light': { yt: 'Y0bEW0nLPEk', title: 'Red Light, Green Light Soccer Drill', channel: 'MOJO', len: '1:57' },
  'sharks-and-minnows': { yt: 'OkAUW5MxjuM', title: 'U8 Sharks and Minnows Activity', channel: 'Cal South Soccer', len: '1:15' },
  'knockout': { yt: 'JhU1IMDs798', title: 'Knockout', channel: 'MOJO', len: '1:28' },
  'soccer-golf': { yt: 'K8xEUDaT_eQ', title: 'Soccer Golf — US Youth Soccer Back Yard Games', channel: 'US Youth Soccer', len: '1:07' },
  'gates-game': { yt: 'FJDbEsmVWz8', title: 'Gates Dribbling', channel: 'MOJO', len: '1:53' },
  'world-cup-game': { yt: 'KeQWSLSaaUg', title: 'Kids Soccer Game — "World Cup" (ages 3 to 10)', channel: 'Chris King Soccer Coach', len: '0:56', note: 'Animated explainer: teams of two, score to advance.' },
  'world-cup-real': { yt: '2NOwuz35dqE', title: 'Soccer drill 13 — World Cup', channel: 'Paul Moran', len: '1:09', note: 'Real kids playing it (phone footage, but it shows the game).' },
  'passing-accuracy-game': { yt: 'xmDXOE5gGn8', title: 'Gates Passing', channel: 'MOJO', len: '1:10', note: 'Weight and accuracy of the pass, as a game.' },
  'soccer-bowling': { yt: 'wcurSmD-iwg', title: 'Soccer Passing Drills — Soccer Bowling', channel: 'Online Soccer Academy', len: '2:45' },
  'dribbling-games-10': { yt: 'eD2T5GXeaYE', title: '10 Best Soccer Dribbling Drills for U6, U8, U10', channel: 'MOJO', len: '16:34', note: 'Red Light Green Light at 1:40; Gates at 10:11.' },

  /* rules */
  'offside-7v7': { yt: '9_pAGf0SPNs', title: 'Youth Soccer Offside Rule (7v7)', channel: 'Soccer Dots', len: '3:15', note: 'Offside with the build-out line as the offside line — our league\'s version.' },
  'offside-kids': { yt: 'INBHjnvLdC0', title: 'Understanding the offside rule | Soccer 101', channel: 'TSN', len: '1:00', note: 'Two pros coach a kid through offside on the field.' },
  'build-out-line': { yt: 'sQ92KfiIwok', title: 'Explaining The 7v7 Build Out Line: Part I', channel: 'Eastern Pennsylvania Youth Soccer', len: '4:23', note: 'Retreat behind the line, no punting, offside at the line.' },
  'build-out-offside': { yt: '_CFTQ245-8w', title: 'Build Out Line Offside', channel: 'Minnesota Youth Soccer', len: '2:19' },

  /* at home & warm-up */
  'juggling-beginner': { yt: 'ClJxqot2Bnw', title: 'How to Juggle a Soccer Ball', channel: 'MOJO', len: '1:26', note: 'Drop-and-catch progression for beginners.' },
  'home-workout': { yt: 'X9f_c6LHoTI', title: 'The Ultimate Indoor Soccer Workout — for kids at home', channel: 'SOCCSTER', len: '4:33', note: 'Juggling, ball mastery, figure-8 dribble, wall passing.' },
  'ball-mastery-homework': { yt: 'vDGel-fR-3s', title: 'Ball Mastery Homework PART 1 | U8 – U12', channel: 'Coach Thomas Vlaminck', len: '3:33', note: 'A homework routine kids can copy alone in a small space.' },
  'warmup': { yt: 'gEJ4_PYE6Pg', title: 'Dynamic Stretching Warmup', channel: 'MOJO', len: '1:04', note: 'A one-minute game-day warm-up.' },
};
