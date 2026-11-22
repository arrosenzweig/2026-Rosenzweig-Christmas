/**
 * Santa's sleigh and a full team of eight reindeer, drawn as a flying
 * silhouette with a trail of stars behind it --- the classic Christmas-card
 * shape rather than an emoji.
 */

// One reindeer in mid-leap, facing right. Everything is one colour, so the
// body, legs and antlers read as a single silhouette.
function Reindeer({ x, y, s = 1, swap = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={swap ? 'deer deer-b' : 'deer'}>
      {/* body */}
      <ellipse cx="45" cy="30" rx="25" ry="10" transform="rotate(-9 45 30)" />
      {/* tail */}
      <path d="M22 23 q-9 -3 -12 -9" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* neck */}
      <path d="M61 25 Q70 17 75 9" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* head + muzzle */}
      <ellipse cx="80" cy="6" rx="10" ry="5.4" transform="rotate(-20 80 6)" />
      <ellipse cx="89" cy="2" rx="4" ry="3" transform="rotate(-20 89 2)" />
      {/* ears */}
      <path d="M76 2 q-6 -3 -9 -1" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      {/* antlers */}
      <g strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M77 0 q-3 -11 -11 -16" />
        <path d="M72 -7 q-7 -2 -11 -7" />
        <path d="M69 -11 q-2 -7 -7 -10" />
        <path d="M82 -2 q1 -12 -4 -18" />
        <path d="M80 -9 q-6 -4 -8 -10" />
        <path d="M79 -14 q1 -7 -2 -11" />
      </g>
      {/* front legs, reaching forward */}
      <g strokeWidth="5.2" strokeLinecap="round" fill="none">
        <path d="M56 36 q13 5 24 2" />
        <path d="M52 37 q9 10 20 12" />
        {/* back legs, streaming behind */}
        <path d="M31 36 q-15 3 -25 -2" />
        <path d="M34 37 q-11 10 -22 13" />
      </g>
    </g>
  );
}

// Where each reindeer sits along the climbing flight line.
const TEAM = [
  { x: 150, y: 196, s: 0.5 },
  { x: 205, y: 180, s: 0.52 },
  { x: 262, y: 164, s: 0.54, swap: true },
  { x: 318, y: 147, s: 0.55 },
  { x: 374, y: 130, s: 0.57, swap: true },
  { x: 430, y: 112, s: 0.58 },
  { x: 487, y: 94, s: 0.6, swap: true },
  { x: 544, y: 74, s: 0.62 },
];

// Sparkle trail under the sleigh.
const STARS = [
  [120, 268, 1.1], [168, 250, 0.8], [206, 272, 1.3], [250, 243, 0.9],
  [292, 262, 1.1], [330, 232, 0.75], [372, 250, 1.2], [414, 222, 0.9],
  [452, 240, 1.05], [492, 206, 0.8], [530, 222, 1.15], [566, 190, 0.85],
  [596, 206, 1], [236, 214, 0.7], [404, 186, 0.7],
];

export default function SantaSleigh() {
  return (
    <svg className="santa-svg" viewBox="0 0 660 300" aria-hidden="true">
      <g fill="currentColor" stroke="currentColor">
        {/* reins, running from the sleigh up through the team */}
        <g fill="none" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
          <path d="M106 212 C 200 196, 330 150, 560 66" />
          <path d="M110 220 C 206 206, 338 160, 566 76" />
        </g>

        {TEAM.map((d, i) => (
          <Reindeer key={i} {...d} />
        ))}

        {/* the sleigh */}
        <g transform="translate(24 196)">
          {/* body with its curled back */}
          <path d="M10 44 C2 30 8 16 26 14 L74 14 C84 14 90 22 92 32 L94 44 Z" />
          <path d="M26 15 C16 0 26 -14 44 -12 C32 -8 26 2 32 15 Z" />
          {/* runner */}
          <path d="M2 50 C18 58 74 58 98 44" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M98 44 c10 -3 12 -12 4 -15" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* a sack of presents riding in the back */}
          <path d="M18 14 C14 2 22 -8 34 -6 C30 0 28 7 30 14 Z" />
          {/* Santa: body, waving arm, head, hat */}
          <path d="M52 14 C50 0 56 -10 66 -10 C76 -10 80 -2 78 14 Z" />
          <path d="M72 -4 q12 -4 17 -14" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <circle cx="66" cy="-16" r="7" />
          <path d="M59 -19 q4 -13 15 -11 q-3 7 -9 10 Z" />
          <circle cx="76" cy="-31" r="3.4" />
          <path d="M58 -11 q8 4 15 0" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.001" />
        </g>

        {/* twinkling star trail */}
        <g className="santa-stars">
          {STARS.map(([x, y, s], i) => (
            <path
              key={i}
              className="twinkle"
              style={{ animationDelay: `${(i % 5) * -0.6}s` }}
              transform={`translate(${x} ${y}) scale(${s})`}
              d="M0 -7 Q1.4 -1.4 7 0 Q1.4 1.4 0 7 Q-1.4 1.4 -7 0 Q-1.4 -1.4 0 -7 Z"
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
