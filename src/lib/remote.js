// The shared board.
//
// Everything anyone adds, edits, claims or deletes is written to one shared
// document the moment it happens, and every open tab re-reads it a few seconds
// later --- so Alyla adding a gift on her phone shows up on Mom's laptop
// without anybody doing anything. The document lives on a server, not in the
// site, so rebuilding and redeploying the site as often as you like never
// touches a single list.
//
// It is hosted on textdb.dev: a free plain-text store that needs no account,
// no API key and no login from anyone in the family --- opening the site is
// enough. The board sits under one long random key that is effectively
// unguessable, which is what keeps it private; anyone who had that key could
// read or write the board, so treat it like a door key, not a password.
//
// If the family ever outgrows it, set VITE_FIREBASE_DB (or FIREBASE_DB below)
// to a Firebase Realtime Database URL and that takes over instead --- same
// shape of data, same behaviour, with real accounts and rules available.
//
// Writes are read-modify-write and queued one at a time, so two people
// changing different gifts at the same moment do not overwrite each other.

// textdb keys are capped at about 32 characters, so this is short and random
const BOARD_KEY = 'xmas-0ac749878fddd6f00c3752bf';
const FIREBASE_DB = '';

const FB = (import.meta.env.VITE_FIREBASE_DB || FIREBASE_DB || '').replace(/\/+$/, '');
const KEY = import.meta.env.VITE_BOARD_KEY || BOARD_KEY;
const TEXTDB = `https://textdb.dev/api/data/${KEY}`;
const FB_URL = FB ? `${FB}/${import.meta.env.VITE_ROOM || 'christmas-2026'}/board.json` : '';

export const isShared = () => true;
export const boardKind = () => (FB ? 'firebase' : 'textdb');

const EMPTY = { items: [], claims: {}, profiles: {} };

function tidy(board) {
  if (!board || typeof board !== 'object') return null;
  return {
    items: Array.isArray(board.items) ? board.items : Object.values(board.items || {}),
    claims: board.claims || {},
    profiles: board.profiles || {},
  };
}

/**
 * The board as it stands on the server.
 * @returns the board, or null if the server could not be read at all.
 */
export async function loadBoard() {
  try {
    const res = await fetch(`${FB_URL || TEXTDB}?t=${Date.now()}`, { cache: 'no-store' });
    // a key that has never been written answers with an error rather than an
    // empty body --- that is a board waiting to be created, not a dead server
    if (!res.ok) return { ...EMPTY };
    const text = (await res.text()).trim();
    if (!text || text === 'null') return { ...EMPTY };
    return tidy(JSON.parse(text)) || { ...EMPTY };
  } catch {
    return null;
  }
}

async function writeBoard(board) {
  const body = JSON.stringify(board);
  const res = await fetch(FB_URL || TEXTDB, {
    method: FB_URL ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`Saving the board failed: ${res.status}`);
  return board;
}

// One write at a time, so nothing lands on top of anything else.
let queue = Promise.resolve();

/**
 * Apply a change to the shared board.
 *
 * `change` is handed the board as it is on the server right now and returns the
 * board as it should be. Doing it that way means two people editing different
 * gifts at the same time both get their change through.
 *
 * `fallback` is used when the server has nothing yet (first ever run).
 */
export function mutateBoard(change, fallback) {
  queue = queue
    .catch(() => {})
    .then(async () => {
      const live = await loadBoard();
      // never let a blank read wipe a board we know has things on it
      const current = live && live.items.length ? live : fallback || live || { ...EMPTY };
      return writeBoard(change(current));
    });
  return queue;
}

/** First run: put a starting board up if the server has nothing. */
export async function ensureBoard(starter) {
  const current = await loadBoard();
  if (current === null) throw new Error('Could not reach the shared board');
  if (current.items.length) return current;
  return writeBoard(starter);
}
