// The ten family profiles. `theme` is a placeholder styling hook --- each
// person's real look/feel gets filled in later from their own description.
export const PROFILES = [
  { id: 'dad',        name: 'Dad',        emoji: '🎅', theme: { accent: '#c62828', accent2: '#8e0000', bg: '#1b1013', pattern: 'snow'    } },
  { id: 'mom',        name: 'Mom',        emoji: '🤶', theme: { accent: '#d81b60', accent2: '#8e0038', bg: '#1b1016', pattern: 'snow'    } },
  { id: 'alexandria', name: 'Alexandria', emoji: '🦌', theme: { accent: '#2e9e6b', accent2: '#146646', bg: '#0f1a15', pattern: 'holly'   } },
  { id: 'alysia',     name: 'Alysia',     emoji: '🍵', theme: { accent: '#7cb342', accent2: '#4b7a21', bg: '#121a0f', pattern: 'holly'   } },
  { id: 'alyson',     name: 'Alyson',     emoji: '🐉', theme: { accent: '#8e5cd9', accent2: '#5b32a0', bg: '#140f1c', pattern: 'stars'   } },
  { id: 'aleena',     name: 'Aleena',     emoji: '🌸', theme: { accent: '#e8728c', accent2: '#b03f58', bg: '#1b1013', pattern: 'stars'   } },
  { id: 'alyla',      name: 'Alyla',      emoji: '💎', theme: { accent: '#36b7c7', accent2: '#1b7d89', bg: '#0e181b', pattern: 'snow'    } },
  { id: 'alex',       name: 'Alex',       emoji: '🎮', theme: { accent: '#3f7fd6', accent2: '#21508f', bg: '#0e1420', pattern: 'snow'    } },
  { id: 'isaiah',     name: 'Isaiah',     emoji: '⛄', theme: { accent: '#4fa3d1', accent2: '#2a6c8f', bg: '#0e1620', pattern: 'snow'    } },
  { id: 'jacob',      name: 'Jacob',      emoji: '🧸', theme: { accent: '#d98f3f', accent2: '#9c5f1c', bg: '#1a140d', pattern: 'holly'   } },
];

export const profileById = (id) => PROFILES.find((p) => p.id === id);
