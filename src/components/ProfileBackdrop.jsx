import { motifFor } from '../data/motifs.js';

// Fixed spots, spread about so the pattern never looks like a grid.
const SPOTS = [
  [6, 12, 1.0], [22, 30, 0.7], [38, 8, 1.2], [54, 26, 0.8], [71, 14, 1.05], [88, 32, 0.75],
  [12, 52, 0.9], [29, 68, 1.15], [45, 48, 0.7], [62, 64, 1.0], [79, 50, 0.85], [94, 70, 1.1],
  [4, 84, 0.8], [20, 94, 1.05], [36, 80, 0.95], [52, 92, 0.75], [68, 84, 1.15], [85, 96, 0.9],
];

/**
 * The wallpaper somebody designs for themselves on their profile page: the
 * things they asked for, scattered faintly behind everything, plus their one
 * special element drifting across. Purely decorative --- it never sits on top
 * of anything you need to read or tap.
 */
export default function ProfileBackdrop({ items = [], special = '' }) {
  const things = items.map((t) => String(t || '').trim()).filter(Boolean);
  const specialText = String(special || '').trim();
  if (!things.length && !specialText) return null;

  const draw = (word, key, style) => {
    const emoji = motifFor(word);
    return (
      <span key={key} className={`backdrop-item ${emoji ? '' : 'is-word'}`} style={style}>
        {emoji || word}
      </span>
    );
  };

  const specialEmoji = motifFor(specialText);

  return (
    <div className="backdrop" aria-hidden="true">
      {things.length > 0 &&
        SPOTS.map(([left, top, scale], i) =>
          draw(things[i % things.length], i, {
            left: `${left}%`,
            top: `${top}%`,
            '--scale': scale,
            animationDelay: `${-(i % 7) * 1.3}s`,
          }),
        )}

      {specialText && (
        <span className={`backdrop-special ${specialEmoji ? '' : 'is-word'}`}>
          {specialEmoji || specialText}
        </span>
      )}
    </div>
  );
}
