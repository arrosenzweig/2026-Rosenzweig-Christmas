// The shared board.
//
// Everything anyone adds, edits, claims or deletes is written straight to a
// Firebase Realtime Database over its plain REST API --- no SDK, no build step,
// nothing to install --- and every open tab picks the change up within a few
// seconds. The data lives in the database, not in the site, so redeploying the
// site as often as you like never touches it.
//
// SETUP (one time, about two minutes)
//   1. console.firebase.google.com -> Add project (any name, Analytics off).
//   2. Build -> Realtime Database -> Create Database -> Start in TEST MODE.
//   3. Copy the database URL it shows you, e.g.
//        https://rosenzweig-christmas-default-rtdb.firebaseio.com
//   4. Paste it as FIREBASE_DB below (or set VITE_FIREBASE_DB at build time)
//      and push. That is it --- no keys, no accounts for anyone else.
//
// Test mode leaves the database open to anyone who knows the URL, which is the
// trade for nobody needing a login. Firebase will email when test mode is about
// to expire; to keep it simple, open Rules and set `.read` and `.write` to true.
//
// Until a URL is set, the app runs exactly as before: everything is kept in
// this browser only. The cache below is also what keeps the site usable if the
// network drops.

const FIREBASE_DB = '';

const DB = (import.meta.env.VITE_FIREBASE_DB || FIREBASE_DB || '').replace(/\/+$/, '');
const ROOM = import.meta.env.VITE_ROOM || 'christmas-2026';

export const isShared = () => Boolean(DB);

const url = (path) => `${DB}/${ROOM}/${path}.json`;

async function send(method, path, body) {
  if (!DB) return null;
  const res = await fetch(url(path), {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

/** The whole board, or null when there is no shared database configured. */
export async function loadBoard() {
  if (!DB) return null;
  const data = await send('GET', 'board');
  if (!data) return { items: [], claims: {}, profiles: {} };
  return {
    items: Object.values(data.items || {}),
    claims: data.claims || {},
    profiles: data.profiles || {},
  };
}

/** First run only: write the starting lists into an empty database. */
export async function seedBoard(board) {
  if (!DB) return;
  const items = Object.fromEntries(board.items.map((i) => [i.id, i]));
  await send('PUT', 'board', { items, claims: board.claims || {}, profiles: board.profiles || {} });
}

export const putItem = (item) => send('PUT', `board/items/${item.id}`, item);
export const dropItem = (id) => send('DELETE', `board/items/${id}`);
export const patchItem = (id, patch) => send('PATCH', `board/items/${id}`, patch);

export const putClaim = (itemId, claim) =>
  claim ? send('PUT', `board/claims/${itemId}`, claim) : send('DELETE', `board/claims/${itemId}`);

export const putProfile = (id, meta) => send('PUT', `board/profiles/${id}`, meta);
