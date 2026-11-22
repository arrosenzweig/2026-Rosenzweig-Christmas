// The ten family profiles.
//
// Each person's `theme` drives their whole signed-in look --- colors, the
// background texture, the heading font, how round the cards are, and the little
// motif that sits beside their page titles. Everything reads these values
// through CSS variables, so restyling someone is an edit to this file only.
//
//   accent / accent2  the two brand colors (buttons, tabs, highlights)
//   bg                page background base
//   texture           'snow' | 'plaid' | 'stars' | 'sparkle' | 'candy' | 'leaf' | 'grid'
//   font              'serif' | 'sans' | 'rounded' | 'mono' | 'display'
//   radius            corner rounding in px: 6 = crisp, 26 = soft
//   motif             emoji that appears beside their page headings
//
// These are a first pass drawn from what each person's list says about them ---
// swap in their own preferences as they come in.

const FONTS = {
  serif: "'Palatino Linotype', Palatino, Georgia, serif",
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
  rounded: "'Trebuchet MS', 'Segoe UI', sans-serif",
  mono: "'Cascadia Mono', Consolas, 'Courier New', monospace",
  display: "Georgia, 'Times New Roman', serif",
};

export const PROFILES = [
  {
    id: 'dad', name: 'Dad', emoji: '🎅',
    theme: { accent: '#c62828', accent2: '#7f1313', bg: '#190d0e', texture: 'plaid', font: 'serif', radius: 10, motif: '🎄' },
  },
  {
    id: 'mom', name: 'Mom', emoji: '🤶',
    theme: { accent: '#d4476b', accent2: '#8c1f3e', bg: '#1a0e13', texture: 'sparkle', font: 'serif', radius: 20, motif: '🕯️' },
  },
  {
    // Minimal and clean --- she asked for simple, non-tarnishing jewellery.
    id: 'alexandria', name: 'Alexandria', emoji: '🦌',
    theme: { accent: '#3f9e78', accent2: '#1d6049', bg: '#0d1714', texture: 'snow', font: 'sans', radius: 8, motif: '🤍' },
  },
  {
    // Matcha, pilates, soft mornings.
    id: 'alysia', name: 'Alysia', emoji: '🍵',
    theme: { accent: '#7fb069', accent2: '#4a7c3f', bg: '#111608', texture: 'leaf', font: 'rounded', radius: 22, motif: '🍵' },
  },
  {
    // Purple (no pink), dragons, dinosaurs, citrus.
    id: 'alyson', name: 'Alyson', emoji: '🐉',
    theme: { accent: '#8e5cd9', accent2: '#4b1f91', bg: '#140d1f', texture: 'stars', font: 'display', radius: 14, motif: '🐉' },
  },
  {
    // Florals, perfume, time together.
    id: 'aleena', name: 'Aleena', emoji: '🌸',
    theme: { accent: '#e8728c', accent2: '#a33355', bg: '#1b0f14', texture: 'sparkle', font: 'serif', radius: 24, motif: '🌸' },
  },
  {
    // Gems, glow, shimmer.
    id: 'alyla', name: 'Alyla', emoji: '💎',
    theme: { accent: '#2fc2cf', accent2: '#15707e', bg: '#09171a', texture: 'sparkle', font: 'rounded', radius: 18, motif: '💎' },
  },
  {
    id: 'alex', name: 'Alex', emoji: '🎮',
    theme: { accent: '#3f7fd6', accent2: '#1b3f78', bg: '#0b1220', texture: 'grid', font: 'mono', radius: 6, motif: '🎮' },
  },
  {
    id: 'isaiah', name: 'Isaiah', emoji: '⛄',
    theme: { accent: '#4fa8d8', accent2: '#235f80', bg: '#0b1620', texture: 'snow', font: 'sans', radius: 16, motif: '⛄' },
  },
  {
    id: 'jacob', name: 'Jacob', emoji: '🧸',
    theme: { accent: '#e09440', accent2: '#8f5312', bg: '#1a1209', texture: 'candy', font: 'rounded', radius: 26, motif: '🧸' },
  },
];

/**
 * The same, but letting somebody's own answers from the profile questionnaire
 * win: up to two colours they picked for themselves.
 */
export function themeVarsFor(profile, meta) {
  const vars = themeVars(profile);
  const colors = (meta?.style?.colors || []).filter(Boolean);
  if (colors.length) {
    vars['--accent'] = colors[0];
    vars['--accent-2'] = colors[1] || `color-mix(in srgb, ${colors[0]} 55%, #2b1512)`;
  }
  return vars;
}

/** The CSS custom properties one person's theme turns into. */
export function themeVars(profile) {
  const t = profile.theme;
  return {
    '--accent': t.accent,
    '--accent-2': t.accent2,
    '--bg': t.bg,
    '--radius': `${t.radius}px`,
    '--font': FONTS[t.font] || FONTS.sans,
    '--motif': `'${t.motif}'`,
  };
}

export const profileById = (id) => PROFILES.find((p) => p.id === id);
