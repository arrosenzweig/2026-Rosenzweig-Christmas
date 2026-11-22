/**
 * The background of the "Who's shopping?" screen: red / green / gold, snow,
 * swinging bells, mistletoe in the corners, and Santa flying over a shopping
 * mall. All CSS animation --- no GIF files to load, and it all holds still for
 * anyone who has "reduce motion" switched on.
 */

const STORES = [
  { name: 'AMAZON', hue: '#ff9900' },
  { name: 'WALMART', hue: '#ffc220' },
  { name: "MACY'S", hue: '#e03131' },
  { name: 'SHEIN', hue: '#f2f2f2' },
];

const SNOW = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: -((i * 1.37) % 12),
  duration: 9 + ((i * 7) % 9),
  size: 6 + ((i * 5) % 10),
  drift: ((i % 5) - 2) * 26,
}));

function Mistletoe({ side }) {
  return (
    <svg className={`mistletoe ${side}`} viewBox="0 0 160 130" aria-hidden="true">
      <g className="mistletoe-swing">
        <path d="M80 0 C78 28 70 44 52 58" stroke="#2f7d4f" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M80 0 C84 30 94 46 112 60" stroke="#2f7d4f" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M80 6 C80 34 80 52 80 76" stroke="#2f7d4f" strokeWidth="5" fill="none" strokeLinecap="round" />
        {[
          [52, 58], [112, 60], [80, 76],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x - 16} cy={y + 4} rx="17" ry="9" fill="#2e8b57" transform={`rotate(-25 ${x - 16} ${y + 4})`} />
            <ellipse cx={x + 16} cy={y + 4} rx="17" ry="9" fill="#246b43" transform={`rotate(25 ${x + 16} ${y + 4})`} />
            <ellipse cx={x} cy={y + 16} rx="15" ry="8" fill="#35a062" />
            <circle cx={x - 5} cy={y + 2} r="4.5" fill="#f6f1e7" />
            <circle cx={x + 5} cy={y + 5} r="4.5" fill="#e9e2d2" />
            <circle cx={x} cy={y + 10} r="4" fill="#fffaf0" />
          </g>
        ))}
        <path d="M68 86 q12 12 24 0 q-12 18 -24 0" fill="#c62828" />
      </g>
    </svg>
  );
}

function Bell({ className }) {
  return (
    <svg className={`bell ${className}`} viewBox="0 0 80 110" aria-hidden="true">
      <line x1="40" y1="0" x2="40" y2="18" stroke="#2f7d4f" strokeWidth="4" />
      <g className="bell-swing">
        <path d="M40 16 C18 24 14 52 12 74 L68 74 C66 52 62 24 40 16 Z" fill="url(#goldGrad)" stroke="#8a6410" strokeWidth="2" />
        <rect x="8" y="74" width="64" height="9" rx="4" fill="#f3c969" stroke="#8a6410" strokeWidth="2" />
        <circle cx="40" cy="91" r="8" fill="#d8a93c" stroke="#8a6410" strokeWidth="2" />
        <circle cx="30" cy="42" r="5" fill="#fff6d8" opacity="0.7" />
      </g>
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe79a" />
          <stop offset="55%" stopColor="#e6b34a" />
          <stop offset="100%" stopColor="#a87a16" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ChristmasScene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-sky" />

      <div className="scene-snow">
        {SNOW.map((f, i) => (
          <span
            key={i}
            className="flake"
            style={{
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              '--drift': `${f.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Santa, reindeer and sleigh crossing the sky */}
      <div className="santa-run">
        <div className="santa-bob">
          <span className="santa-team">🦌</span>
          <span className="santa-team">🦌</span>
          <span className="santa-sleigh">🛷</span>
          <span className="santa-man">🎅</span>
          <span className="santa-trail" />
        </div>
      </div>

      {/* The mall below */}
      <div className="mall">
        <div className="mall-glow" />
        <div className="mall-row">
          {STORES.map((s) => (
            <div className="store" key={s.name} style={{ '--sign': s.hue }}>
              <div className="store-awning" />
              <div className="store-sign">{s.name}</div>
              <div className="store-front">
                <span className="store-window" />
                <span className="store-door">🎄</span>
                <span className="store-window" />
              </div>
            </div>
          ))}
        </div>
        <div className="mall-ground" />
      </div>

      <Mistletoe side="left" />
      <Mistletoe side="right" />
      <Bell className="bell-a" />
      <Bell className="bell-b" />
    </div>
  );
}
