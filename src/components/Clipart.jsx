/**
 * Hand-drawn clipart for the background scene.
 *
 * These are real shapes rather than emoji, which matters for one reason: they
 * take whatever colour they are given. That is how somebody's two chosen
 * colours end up spread across the whole page instead of sitting only in the
 * buttons. Each one is a single path on a 100x100 grid, so they stay crisp at
 * any size and cost almost nothing to animate.
 */

const SHAPES = {
  star: 'M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z',
  heart: 'M50 88 C14 64 6 42 18 27 C28 14 44 17 50 31 C56 17 72 14 82 27 C94 42 86 64 50 88 Z',
  gift: 'M14 42 H86 V90 H14 Z M8 26 H92 V42 H8 Z M44 26 V90 H56 V26 Z M30 26 C18 26 16 10 28 10 C40 10 46 20 48 26 Z M70 26 C82 26 84 10 72 10 C60 10 54 20 52 26 Z',
  bauble: 'M50 20 C72 20 88 38 88 58 C88 78 72 94 50 94 C28 94 12 78 12 58 C12 38 28 20 50 20 Z M42 6 H58 V20 H42 Z',
  snowflake: 'M46 4 H54 V96 H46 Z M4 46 H96 V54 H4 Z M14 20 L20 14 L86 80 L80 86 Z M80 14 L86 20 L20 86 L14 80 Z',
  candycane: 'M34 96 V44 C34 20 70 20 70 44 V52 H56 V44 C56 36 48 36 48 44 V96 Z',
  flower: 'M50 32 C50 12 76 12 76 32 C96 32 96 58 76 58 C76 78 50 78 50 58 C30 58 30 32 50 32 Z M50 40 A9 9 0 1 0 50 58 A9 9 0 1 0 50 40 Z',
  balloon: 'M50 6 C70 6 82 24 82 42 C82 62 64 78 54 80 L58 96 H42 L46 80 C36 78 18 62 18 42 C18 24 30 6 50 6 Z',
  gem: 'M30 12 H70 L92 40 L50 94 L8 40 Z',
  cloud: 'M26 72 C10 72 6 50 24 48 C26 30 54 26 60 44 C78 40 88 60 76 72 Z',
  bolt: 'M58 4 L22 56 H46 L40 96 L78 42 H54 Z',
  bow: 'M50 44 C36 24 10 28 14 48 C18 66 40 58 50 50 C60 58 82 66 86 48 C90 28 64 24 50 44 Z M44 50 H56 V78 L50 70 L44 78 Z',
  sparkle: 'M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2 Z',
  moon: 'M62 6 C34 10 14 32 14 52 C14 76 36 96 60 94 C40 82 30 66 30 50 C30 30 44 14 62 6 Z',
  tree: 'M50 4 L74 38 H60 L82 70 H18 L40 38 H26 Z M42 70 H58 V96 H42 Z',
  bell: 'M50 10 C66 10 74 26 74 48 C74 68 82 76 84 82 H16 C18 76 26 68 26 48 C26 26 34 10 50 10 Z M40 86 H60 C60 94 40 94 40 86 Z',
};

export const CLIPART_NAMES = Object.keys(SHAPES);

export default function Clipart({ shape, className = '', style }) {
  const d = SHAPES[shape] || SHAPES.star;
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}
