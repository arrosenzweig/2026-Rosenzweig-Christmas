// The emoji anyone can pick to stand for themselves. Grouped loosely so the
// picker reads as a few shelves rather than one long wall.
export const EMOJI_GROUPS = [
  {
    name: 'Christmas',
    emojis: ['🎅', '🤶', '🎄', '⛄', '🦌', '🎁', '🔔', '🕯️', '❄️', '🌟', '🍬', '🧦', '🛷', '🧝', '🎶'],
  },
  {
    name: 'Faces & people',
    emojis: ['😀', '😎', '🥰', '🤓', '😇', '🤠', '🫶', '👑', '🦸', '🧚', '🧜', '🧙', '💃', '🕺', '👻'],
  },
  {
    name: 'Animals',
    emojis: ['🐉', '🦖', '🐱', '🐶', '🦊', '🐼', '🐸', '🦉', '🦋', '🐝', '🐧', '🦁', '🐙', '🦥', '🐢'],
  },
  {
    name: 'Things & treats',
    emojis: ['💎', '🎮', '🧸', '🍵', '🌸', '🍓', '🍩', '🍕', '☕', '📚', '🎧', '🎨', '⚽', '🏀', '🚗'],
  },
];

export const ALL_EMOJIS = EMOJI_GROUPS.flatMap((g) => g.emojis);
