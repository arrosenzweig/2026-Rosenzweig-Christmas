import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SEED_ITEMS, SEED_NOTES } from '../data/seed.js';
import { placeholderImage } from './images.js';
import { cleanTitle, searchLinkFor } from './searchAgent.js';
import { CATALOG } from '../data/catalog.js';
import { profileById } from '../data/profiles.js';
import { ensureBoard, loadBoard, mutateBoard } from './remote.js';

export const PENDING_DAYS = 5;
export const PENDING_MS = PENDING_DAYS * 24 * 60 * 60 * 1000;

const DATA_KEY = 'rosenzweig-christmas-2026/data';
const PROFILE_KEY = 'rosenzweig-christmas-2026/profile';
const SEED_EPOCH = Date.parse('2026-11-01T12:00:00Z');

// WHERE THE DATA LIVES ---------------------------------------------------
// With a database URL set (see remote.js) this is a shared board: every add,
// edit, claim and delete is written to the database as it happens, and every
// open tab picks up everyone else's changes within a few seconds. The site can
// be rebuilt and redeployed as often as you like without touching any of it.
// localStorage is then only a cache, so a tab paints instantly and keeps
// working if the network blips.
// Without a database URL the cache is all there is, and each browser keeps its
// own copy.
// ------------------------------------------------------------------------

function buildSeed() {
  const items = [];
  const claims = {};
  const profiles = {};
  for (const [owner, notes] of Object.entries(SEED_NOTES)) {
    profiles[owner] = {
      image: '',
      notes: notes.map((n, i) => ({ ...n, id: `sn-${owner}-${i}`, createdAt: SEED_EPOCH + i })),
    };
  }
  SEED_ITEMS.forEach((raw, i) => {
    const id = `seed-${i}`;
    const accent = profileById(raw.owner)?.theme.accent;
    // what the search agent found for this line, if anything
    const found = CATALOG[raw.title] || {};
    const tidy = cleanTitle(raw.title);
    const title = found.title || tidy.title;
    const preference = found.note || tidy.note;
    // the document's own aside often repeats the preference --- don't say it twice
    const plain = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const extra = raw.notes && plain(preference).includes(plain(raw.notes)) ? '' : raw.notes;
    const notes = [preference, extra].filter(Boolean).join(' · ');
    items.push({
      id,
      owner: raw.owner,
      title,
      link: found.link || raw.link || searchLinkFor(title),
      image: found.image || raw.image || placeholderImage(title, accent),
      // these photos were found for us by the search agent, not uploaded
      imageBy: 'agent',
      notes,
      priority: raw.priority || 'med',
      createdAt: SEED_EPOCH + i * 60000,
    });
    if (raw.bought) {
      claims[id] = { by: 'family', status: 'bought', at: SEED_EPOCH + i * 60000 };
    }
  });
  return { version: 1, items, claims, profiles, shares: {} };
}

/**
 * Re-apply the current catalog to the seeded items.
 *
 * When a nicer photo or a cleaner name ships, boards already in use should pick
 * it up --- but only those fields. Priorities people have set, items they have
 * added, their edits, claims and profiles are never touched.
 */
function refreshSeedItems(items) {
  const fresh = buildSeed().items;
  const byId = Object.fromEntries(fresh.map((i) => [i.id, i]));
  const changed = [];
  const next = items.map((item) => {
    const seeded = byId[item.id];
    // someone editing a seeded gift takes it out of the catalog's hands
    if (!seeded || item.edited) return item;
    if (
      seeded.title === item.title &&
      seeded.image === item.image &&
      seeded.link === item.link &&
      seeded.notes === item.notes &&
      item.imageBy
    ) {
      return item;
    }
    const patch = {
      title: seeded.title,
      image: seeded.image,
      link: seeded.link,
      notes: seeded.notes,
      imageBy: item.imageBy || 'agent',
    };
    changed.push({ id: item.id, patch });
    return { ...item, ...patch };
  });
  return { items: next, changed };
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

/**
 * The same five day rule, for gifts several people are allowed to buy.
 * `shares` is {itemId: {person: claim}} and sits alongside `claims` rather than
 * replacing it, so boards written before this feature existed still work.
 */
export function expireShares(shares, now = Date.now()) {
  let changed = false;
  const next = {};
  for (const [itemId, byPerson] of Object.entries(shares || {})) {
    const kept = {};
    for (const [person, claim] of Object.entries(byPerson || {})) {
      if (claim.status === 'pending' && now - claim.at > PENDING_MS) {
        changed = true;
        continue;
      }
      kept[person] = claim;
    }
    if (Object.keys(kept).length) next[itemId] = kept;
    else if (Object.keys(byPerson || {}).length) changed = true;
  }
  return changed ? next : shares;
}

/** Everybody who has claimed this gift, however it was claimed. */
export function claimsOn(itemId, claims, shares) {
  const out = [];
  const single = claims?.[itemId];
  if (single) out.push(single);
  for (const claim of Object.values(shares?.[itemId] || {})) {
    if (!single || claim.by !== single.by) out.push(claim);
  }
  return out;
}

/** Your own claim on a gift, whether it is a shared one or not. */
export function myClaimOn(itemId, me, claims, shares) {
  const single = claims?.[itemId];
  if (single && single.by === me) return single;
  return shares?.[itemId]?.[me] || null;
}

function load() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return buildSeed();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return buildSeed();
    return {
      version: 1,
      items: parsed.items,
      claims: expireClaims(parsed.claims || {}),
      profiles: parsed.profiles || {},
      shares: expireShares(parsed.shares || {}),
    };
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
  const [status, setStatus] = useState('connecting');

  // what we last knew the board to be --- used when the server has nothing yet
  const boardRef = useRef(null);
  boardRef.current = {
    items: state.items,
    claims: state.claims,
    profiles: state.profiles || {},
    shares: state.shares || {},
  };

  useEffect(() => persist(state), [state]);

  useEffect(() => {
    if (profileId) localStorage.setItem(PROFILE_KEY, profileId);
    else localStorage.removeItem(PROFILE_KEY);
  }, [profileId]);

  const adopt = useCallback((board) => {
    const { items, changed } = refreshSeedItems(board.items);
    setState({
      version: 1,
      items,
      claims: expireClaims(board.claims),
      profiles: board.profiles || {},
      shares: expireShares(board.shares || {}),
    });
    // a nicer photo or a cleaner name has shipped --- share it with everyone
    if (changed.length) {
      mutateBoard((b) => ({
        ...b,
        items: b.items.map((it) => {
          const fix = changed.find((c) => c.id === it.id);
          return fix && !it.edited ? { ...it, ...fix.patch } : it;
        }),
      }), boardRef.current).catch(() => {});
    }
  }, []);

  /** Write a change to the shared board, keeping an eye on whether it lands. */
  const push = useCallback((change) => {
    mutateBoard(change, boardRef.current)
      .then(() => setStatus('shared'))
      .catch((err) => {
        console.warn('Could not save to the shared board --- kept in this browser', err);
        setStatus('offline');
      });
  }, []);

  // ---- first contact with the shared board --------------------------------
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        // if the server is empty, put up whatever this browser already has ---
        // that way a wiped board is rebuilt from a real list, not from scratch
        const starter = boardRef.current.items.length ? boardRef.current : buildSeed();
        const board = await ensureBoard(starter);
        if (dead) return;
        adopt(board);
        setStatus('shared');
      } catch (err) {
        console.warn('Could not reach the shared board --- using this browser only', err);
        if (!dead) setStatus('offline');
      }
    })();
    return () => {
      dead = true;
    };
  }, [adopt]);

  // ---- keep every tab in step ---------------------------------------------
  useEffect(() => {
    const t = setInterval(async () => {
      const board = await loadBoard();
      if (!board) {
        setStatus('offline');
        return;
      }
      setState((s) => {
        const next = {
          version: 1,
          items: refreshSeedItems(board.items).items,
          claims: expireClaims(board.claims),
          profiles: board.profiles || {},
          shares: expireShares(board.shares || {}),
        };
        return JSON.stringify(next) === JSON.stringify(s) ? s : next;
      });
      setStatus('shared');
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Sweep expired "pending purchase" holds once a minute while the tab is open.
  useEffect(() => {
    const t = setInterval(() => {
      setState((s) => {
        const claims = expireClaims(s.claims);
        const shares = expireShares(s.shares || {});
        if (claims === s.claims && shares === (s.shares || {})) return s;
        mutateBoard(
          (b) => ({ ...b, claims: expireClaims(b.claims), shares: expireShares(b.shares || {}) }),
          boardRef.current,
        ).catch(() => {});
        return { ...s, claims, shares };
      });
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const addItem = useCallback((item) => {
    const id = `i-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const entry = { ...item, id, createdAt: Date.now() };
    setState((s) => ({ ...s, items: [...s.items, entry] }));
    push((b) => ({ ...b, items: [...b.items.filter((i) => i.id !== entry.id), entry] }));
    return id;
  }, [push]);

  const updateItem = useCallback((id, patch) => {
    setState((s) => ({ ...s, items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
    push((b) => ({ ...b, items: b.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  }, [push]);

  const deleteItem = useCallback((id) => {
    push((b) => {
      const claims = { ...b.claims };
      delete claims[id];
      const shares = { ...(b.shares || {}) };
      delete shares[id];
      return { ...b, items: b.items.filter((it) => it.id !== id), claims, shares };
    });
    setState((s) => {
      const claims = { ...s.claims };
      delete claims[id];
      const shares = { ...(s.shares || {}) };
      delete shares[id];
      return { ...s, items: s.items.filter((it) => it.id !== id), claims, shares };
    });
  }, [push]);

  /**
   * status: 'pending' | 'bought' | null (null clears your claim).
   *
   * On a gift whose owner ticked "several people can buy this", everybody's
   * claim is kept separately under `shares`, so one person saying they are
   * buying it never stops anybody else. Ordinary gifts keep working exactly as
   * before, through `claims`.
   */
  const setClaim = useCallback((itemId, status, by, shared = false) => {
    const claim = status ? { by, status, at: Date.now() } : null;

    if (!shared) {
      setState((s) => {
        const claims = { ...s.claims };
        if (!claim) delete claims[itemId];
        else claims[itemId] = claim;
        return { ...s, claims };
      });
      push((b) => {
        const claims = { ...b.claims };
        if (!claim) delete claims[itemId];
        else claims[itemId] = claim;
        return { ...b, claims };
      });
      return;
    }

    const apply = (board) => {
      const shares = { ...(board.shares || {}) };
      const mine = { ...(shares[itemId] || {}) };
      if (!claim) delete mine[by];
      else mine[by] = claim;
      if (Object.keys(mine).length) shares[itemId] = mine;
      else delete shares[itemId];

      // if this person's claim was the old single one, let that go too
      const claims = { ...board.claims };
      if (!claim && claims[itemId]?.by === by) delete claims[itemId];
      return { ...board, claims, shares };
    };

    setState((s) => apply(s));
    push(apply);
  }, [push]);

  // ------------------------------------------------ profile image & notes --
  const setProfileImage = useCallback((owner, image) => {
    setState((s) => {
      const meta = { ...(s.profiles[owner] || { notes: [] }), image };
      push((b) => ({ ...b, profiles: { ...b.profiles, [owner]: meta } }));
      return { ...s, profiles: { ...s.profiles, [owner]: meta } };
    });
  }, [push]);

  /** The emoji someone picks to stand for themselves everywhere. */
  const setProfileEmoji = useCallback((owner, emoji) => {
    setState((s) => {
      const meta = { ...(s.profiles[owner] || { image: '', notes: [] }), emoji };
      push((b) => ({ ...b, profiles: { ...b.profiles, [owner]: meta } }));
      return { ...s, profiles: { ...s.profiles, [owner]: meta } };
    });
  }, [push]);

  /** The look somebody designs for themselves on their profile page. */
  const setProfileStyle = useCallback((owner, style) => {
    setState((s) => {
      const meta = { ...(s.profiles[owner] || { image: '', notes: [] }), style };
      push((b) => ({ ...b, profiles: { ...b.profiles, [owner]: meta } }));
      return { ...s, profiles: { ...s.profiles, [owner]: meta } };
    });
  }, [push]);

  const addNote = useCallback((owner, note) => {
    setState((s) => {
      const current = s.profiles[owner] || { image: '', notes: [] };
      const entry = { ...note, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() };
      const meta = { ...current, notes: [...current.notes, entry] };
      push((b) => ({ ...b, profiles: { ...b.profiles, [owner]: meta } }));
      return { ...s, profiles: { ...s.profiles, [owner]: meta } };
    });
  }, [push]);

  const deleteNote = useCallback((owner, noteId) => {
    setState((s) => {
      const current = s.profiles[owner];
      if (!current) return s;
      const meta = { ...current, notes: current.notes.filter((n) => n.id !== noteId) };
      push((b) => ({ ...b, profiles: { ...b.profiles, [owner]: meta } }));
      return { ...s, profiles: { ...s.profiles, [owner]: meta } };
    });
  }, [push]);

  /** Wave away the "this gift changed" warning on one gift. */
  const acknowledgeChange = useCallback((itemId) => {
    const ackAt = Date.now();
    const me = profileId;
    const apply = (board) => {
      const next = { ...board };
      if (board.claims?.[itemId]?.by === me) {
        next.claims = { ...board.claims, [itemId]: { ...board.claims[itemId], ackAt } };
      }
      const mine = board.shares?.[itemId]?.[me];
      if (mine) {
        next.shares = {
          ...(board.shares || {}),
          [itemId]: { ...board.shares[itemId], [me]: { ...mine, ackAt } },
        };
      }
      return next;
    };
    setState((s) => apply(s));
    push(apply);
  }, [push, profileId]);

  const resetEverything = useCallback(() => setState(buildSeed()), []);

  const value = useMemo(
    () => ({
      items: state.items,
      claims: state.claims,
      shares: state.shares || {},
      profiles: state.profiles || {},
      profileMeta: (id) => (state.profiles || {})[id] || { image: '', notes: [] },
      profileId,
      profile: profileId ? profileById(profileId) : null,
      status,
      setProfileId,
      addItem,
      updateItem,
      deleteItem,
      setClaim,
      acknowledgeChange,
      setProfileImage,
      setProfileEmoji,
      setProfileStyle,
      addNote,
      deleteNote,
      resetEverything,
    }),
    [state, profileId, status, push, acknowledgeChange, addItem, updateItem, deleteItem, setClaim, setProfileImage, setProfileEmoji, setProfileStyle, addNote, deleteNote, resetEverything],
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

/**
 * Has the owner changed this gift since you said you were buying it?
 * `ackAt` on your claim is how you wave the warning away.
 */
export function changedSinceClaim(item, claim) {
  if (!item || !claim || !item.lastEditedAt) return false;
  const seen = Math.max(claim.at || 0, claim.ackAt || 0);
  return item.lastEditedAt > seen;
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
