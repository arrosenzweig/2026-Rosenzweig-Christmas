import { useMemo } from 'react';
import { motifFor } from '../data/motifs.js';

/**
 * The scene somebody builds for themselves out of three words.
 *
 * Each word becomes a whole flock rather than a sprite: things rise like
 * bubbles, drift across on the breeze, swing in slow orbits, spin in place and
 * twinkle. They are spread over three depths --- far ones small, faint and
 * slow, near ones big, bold and quick --- so the page has actual depth to it.
 * Coloured orbs float behind the lot in whatever colours the person picked, and
 * their one special something sweeps across on a long curve trailing sparks.
 *
 * It is all CSS transforms and opacity, so it stays smooth, it never catches a
 * click, and it holds completely still for anyone who asked for less motion.
 */

// A tiny deterministic shuffle, so one person's scene is always THEIR scene ---
// same words, same layout every time, but different from everybody else's.
function seedFrom(words) {
  let h = 2166136261;
  for (const ch of words.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return Math.abs(h % 10000) / 10000;
  };
}

const MOTIONS = ['rise', 'drift', 'orbit', 'sway', 'spin'];

// far / middle / near --- the three depths of the scene
const DEPTHS = [
  { count: 22, size: [18, 30], opacity: 0.34, dur: [24, 42], blur: '1px' },
  { count: 18, size: [32, 52], opacity: 0.5, dur: [15, 27], blur: '0.2px' },
  { count: 12, size: [56, 92], opacity: 0.62, dur: [9, 18], blur: '0' },
];

export default function ProfileBackdrop({ items = [], special = '' }) {
  const things = items.map((t) => String(t || '').trim()).filter(Boolean);
  const specialText = String(special || '').trim();

  const flock = useMemo(() => {
    if (!things.length) return [];
    const rand = seedFrom(things);
    const out = [];
    DEPTHS.forEach((depth, d) => {
      for (let i = 0; i < depth.count; i += 1) {
        const word = things[(i + d) % things.length];
        const motion = MOTIONS[Math.floor(rand() * MOTIONS.length)];
        out.push({
          key: `${d}-${i}`,
          word,
          motion,
          left: Math.round(rand() * 96),
          top: Math.round(rand() * 92),
          size: Math.round(depth.size[0] + rand() * (depth.size[1] - depth.size[0])),
          opacity: depth.opacity,
          blur: depth.blur,
          duration: Math.round(depth.dur[0] + rand() * (depth.dur[1] - depth.dur[0])),
          delay: -Math.round(rand() * 24),
          swing: Math.round(14 + rand() * 46), // how far it wanders
          tilt: Math.round(-18 + rand() * 36),
        });
      }
    });
    return out;
  }, [things.join('|')]);

  // coloured orbs that breathe behind everything
  const orbs = useMemo(
    () =>
      [
        { left: 6, top: 14, size: 34, dur: 23, delay: 0, tone: 'var(--accent)' },
        { left: 74, top: 8, size: 26, dur: 31, delay: -8, tone: 'var(--accent-2)' },
        { left: 38, top: 62, size: 40, dur: 27, delay: -15, tone: 'var(--accent)' },
        { left: 86, top: 70, size: 22, dur: 19, delay: -4, tone: 'var(--accent-2)' },
      ],
    [],
  );

  if (!things.length && !specialText) return null;

  const specialEmoji = motifFor(specialText);

  return (
    <div className="backdrop" aria-hidden="true">
      {things.length > 0 && (
        <>
          {orbs.map((o, i) => (
            <span
              key={`orb-${i}`}
              className="backdrop-orb"
              style={{
                left: `${o.left}%`,
                top: `${o.top}%`,
                '--orb': `${o.size}vmin`,
                '--tone': o.tone,
                animationDuration: `${o.dur}s`,
                animationDelay: `${o.delay}s`,
              }}
            />
          ))}

          {flock.map((f) => {
            const emoji = motifFor(f.word); // never null --- always a picture
            return (
              <span
                key={f.key}
                className={`backdrop-item is-${f.motion}`}
                style={{
                  left: `${f.left}%`,
                  top: `${f.top}%`,
                  fontSize: `${f.size}px`,
                  opacity: f.opacity,
                  filter: f.blur === '0' ? undefined : `blur(${f.blur})`,
                  animationDuration: `${f.duration}s`,
                  animationDelay: `${f.delay}s`,
                  '--swing': `${f.swing}px`,
                  '--tilt': `${f.tilt}deg`,
                }}
              >
                {emoji}
              </span>
            );
          })}

          {/* a handful of twinkles to make the whole thing shimmer */}
          {[8, 18, 29, 42, 51, 61, 70, 79, 86, 93, 35, 24].map((left, i) => (
            <span
              key={`tw-${i}`}
              className="backdrop-twinkle"
              style={{
                left: `${left}%`,
                top: `${(i * 37) % 90}%`,
                animationDelay: `${-i * 1.4}s`,
              }}
            />
          ))}
        </>
      )}

      {specialText && (
        <span className="backdrop-flight">
          <span className="backdrop-special">
            {specialEmoji}
            <span className="backdrop-trail" />
          </span>
        </span>
      )}
    </div>
  );
}
