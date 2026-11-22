import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_ITEMS } from '../data/seed.js';
import { placeholderImage } from './images.js';
import { searchLinkFor } from './searchAgent.js';
import { profileById } from '../data/profiles.js';

export const PENDING_DAYS = 5;
export const PENDING_MS = PENDING_DAYS * 24 * 60 * 60 * 1000;

const DATA_KEY = 'rosenzweig-christmas-2026/data';
const PROFILE_KEY = 'rosenzweig-christmas-2026/profile';
const SEED_EPOCH = Date.parse('2026-11-01T12:00:00Z');

// NOTE ON STORAGE --------------------------------------------------------
// Everything lives in this browser's localStorage for now, so each device has
// its own copy of the lists. Swapping `load`/`persist` below for calls to a
// small shared API (or a Firebase/Supabase table) is all that stands between
// this draft and the whole family sharing one set of lists.
// ------------------------------------------------------------------------

function buildSeed() {
  const items = [];
  const claims = {};
  SEED_ITEMS.forEach((raw, i) => {
    const id = `seed-${i}`;
    const accent = profileById(raw.owner)?.theme.accent;
    items.push({
      id,
      owner: raw.owner,
      title: raw.title,
      link: raw.link || searchLinkFor(raw.title),
      image: raw.image || placeholderImage(raw.title, accent),
      notes: raw.notes || '',
      priority: raw.priority || 'med',
      createdAt: SEED_EPOCH + i * 60000,
    });
    if (raw.bought) {
      claims[id] = { by: 'family', status: 'bought', at: SEED_EPOCH + i * 60000 };
    }
  });
  return { version: 1, items, claims };
}

/** Pending claims die after 5 days and the gift goes back on the board. */
export function expireClaims(claims, now = Date.now()) {
  let changed = false;
  const next = {};
  for (const [itemId, claim] of Object.entries(claims)) {
    if (claim.status === 'pending' && now - claim.at > PENDING_MS) {
      changed = true;
      continue;
    }
    next[itemId] = claim;
  }
  return changed ? next : claims;
}

function load() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return buildSeed();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return buildSeed();
    return { version: 1, items: parsed.items, claims: expireClaims(parsed.claims || {}) };
  } catch {
    return buildSeed();
  }
}

function persist(state) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save --- storage may be full (large photos?)', err);
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [profileId, setProfileId] = useState(() => localStorage.getItem(PROFILE_KEY) || null);

  useEffect(() => persist(state), [state]);

  useEffect(() => {
    if (profileId) localStorage.setItem(PROFILE_KEY, profileId);
    else localStorage.removeItem(PROFILE_KEY);
  }, [profileId]);

  // Sweep expired "pending purchase" holds once a minute while the tab is open.
  useEffect(() => {
    const t = setInterval(() => {
      setState((s) => {
        const claims = expireClaims(s.claims);
        return claims === s.claims ? s : { ...s, claims };
      });
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const addItem = useCallback((item) => {
    const id = `i-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setState((s) => ({ ...s, items: [...s.items, { ...item, id, createdAt: Date.now() }] }));
    return id;
  }, []);

  const updateItem = useCallback((id, patch) => {
    setState((s) => ({ ...s, items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  }, []);

  const deleteItem = useCallback((id) => {
    setState((s) => {
      const claims = { ...s.claims };
      delete claims[id];
      return { ...s, items: s.items.filter((it) => it.id !== id), claims };
    });
  }, []);

  /** status: 'pending' | 'bought' | null (null clears your claim). */
  const setClaim = useCallback((itemId, status, by) => {
    setState((s) => {
      const claims = { ...s.claims };
      if (!status) delete claims[itemId];
      else claims[itemId] = { by, status, at: Date.now() };
      return { ...s, claims };
    });
  }, []);

  const resetEverything = useCallback(() => setState(buildSeed()), []);

  const value = useMemo(
    () => ({
      items: state.items,
      claims: state.claims,
      profileId,
      profile: profileId ? profileById(profileId) : null,
      setProfileId,
      addItem,
      updateItem,
      deleteItem,
      setClaim,
      resetEverything,
    }),
    [state, profileId, addItem, updateItem, deleteItem, setClaim, resetEverything],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

// ---------------------------------------------------------------- sorting --
export const SORTS = [
  { id: 'alpha', label: 'A \u2192 Z' },
  { id: 'newest', label: 'Newest added' },
  { id: 'priority', label: 'Highest priority' },
];

const RANK = { high: 3, med: 2, low: 1 };

export function sortItems(items, sort) {
  const copy = [...items];
  if (sort === 'alpha') return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'newest') return copy.sort((a, b) => b.createdAt - a.createdAt);
  return copy.sort(
    (a, b) => (RANK[b.priority] || 0) - (RANK[a.priority] || 0) || b.createdAt - a.createdAt,
  );
}

export function msLeft(claim, now = Date.now()) {
  return PENDING_MS - (now - claim.at);
}

export function formatLeft(ms) {
  if (ms <= 0) return 'expired';
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days} day${days === 1 ? '' : 's'}, ${hours % 24} hr`;
  if (hours >= 1) return `${hours} hr`;
  return `${Math.max(1, Math.round(ms / 60000))} min`;
}
