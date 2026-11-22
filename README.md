# 🎄 Rosenzweig Christmas 2026

A family gift-list site: everyone keeps their own wish list, peeks at everyone
else's, and quietly claims the gifts they're buying so nobody doubles up.

This is the first working draft. The structure and behaviour are all here; the
per-person styling is deliberately plain for now.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## How it works

**Pick a profile.** Ten tiles over a Christmas night scene --- red, green and
gold, falling snow, swinging gold bells, mistletoe in the corners, Santa and a
team of eight reindeer crossing the sky with a trail of stars, and elves
hammering away at their workbenches along the bottom. It is all CSS and SVG, so
there is nothing to download, it stays sharp at any size, and it holds still for
anyone browsing with "reduce motion" on. Choosing a tile sets who you are for
the rest of the session.

**My Profile.** Upload a profile picture and write your *general* gift notes ---
sizes, colors, allergies, what not to buy. Notes can be written notes, photos or
links, and they're about how to shop for you, not about any one gift. Everyone
sees them when they open your list.

**My List.** Add a gift with a title, a link, a photo — any one of them is
enough. Whatever you leave blank gets filled in (see *The elf* below). Each item
shows its photo, its title, its note, and a priority of three stockings: grey by
default, 1 / 2 / 3 lit for Low / Medium / High.

Once a gift is on your list, **click any part of its card to change it** — the
photo, the title, the note, the link, the priority. Hovering shows you what can
be edited; Enter or clicking away saves, Escape puts it back. The small **×** in
the corner removes the item. Sort by A→Z, newest added, or highest priority.

**Christmas Wishes.** Pick one person — one at a time — and you get their page:
profile picture, name beneath it, then their gift notes laid out. Below that, if
you've claimed anything for them, a **Gifts you're giving** section; that section
simply isn't there when you haven't claimed anything. Below that, the rest of
their list with the three sorts. It's read-only, and you never see your own list
here. For each item you can mark:

- **Pending purchase** — covered with a red candy-cane watermark for everyone
  else. Holds expire after **5 days**; after that the item goes back on the
  board for anyone to buy.
- **Bought** — blurred for everyone else, with a big wrapped-gift clipart over
  it so nobody can tell what it was. You still see it normally.

An item can sit in pending and move to bought later.

**Santa's Workshop.** Your own shopping board: everything you have on hold and
everything you've bought, kept apart. Pending gifts show how much time is left
before the hold lapses, and turn red in the last day.

## The elf (auto-fill agent)

`src/lib/searchAgent.js` fills in whatever an item is missing, in three stages,
stopping as soon as the item is complete:

1. **Your own search endpoint.** Set `VITE_ENRICH_API` to an HTTPS endpoint that
   accepts `POST {title, link, image}` and answers `{title, link, image}`. This
   is the only stage that can search the web from a description, because that
   needs an API key and a key cannot live in a browser.
2. **Link lookup** (no key, works today). Paste a link and the page's own real
   title and product photo are fetched through Microlink's free public API.
3. **Offline filler.** A shopping-search link built from the title, and a
   wrapped-present card with the title written on it.

Whatever stage answers, names come out Title Cased and trailing asides are split
into a short note: "Kendra Scott earrings --- opal please" becomes
**Kendra Scott Earrings** with *Preference: Opal* underneath.

### The catalog

All 50 items from the list document were looked up ahead of time by web-search
agents and live in `src/data/catalog.js` --- clean name, preference note, real
product page, real product photo from the shop's own CDN. It is keyed by the
document's original wording, so redoing that research only touches that one
file. If a shop ever stops serving a photo, the card falls back to the drawn
placeholder rather than showing a broken image.

## Styling

`src/data/profiles.js` is the whole look of the signed-in site. Each person
carries two accent colors, a background texture, a heading font, how round their
cards are, and a motif that sits beside their page titles; everything else reads
those through CSS variables. Restyling someone is an edit to that file alone.
The base palette --- cream paper, candy-cane red, fir green, gold trim --- lives
at the top of `src/styles.css`.

## Where the data lives

Everything anyone adds, edits, claims or deletes is written to a **Firebase
Realtime Database** over its plain REST API as it happens, and every open tab
picks up everyone else's changes within about five seconds. The data lives in
the database, not in the site, so the site can be rebuilt and redeployed as
often as you like without touching anybody's list. `localStorage` is only a
cache, so a tab paints instantly and keeps working if the network blips.

### Turning the shared board on (one time, about two minutes)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add
   project** (any name, Analytics off).
2. **Build → Realtime Database → Create Database → Start in test mode.**
3. Copy the database URL it shows you, e.g.
   `https://rosenzweig-christmas-default-rtdb.firebaseio.com`
4. Paste it as `FIREBASE_DB` at the top of [`src/lib/remote.js`](src/lib/remote.js)
   (or set `VITE_FIREBASE_DB` at build time) and push.

Nobody else needs an account or a login — opening the site is enough. Test mode
leaves the database open to anyone who knows the URL, which is the trade for
that; Firebase emails before test mode expires, and the simplest fix is to open
**Rules** and set `.read` and `.write` to `true`.

The footer always says which mode you are in: *Shared board*, *Saved in this
browser only*, or *Can't reach the shared board*. Until a URL is set it is the
middle one — the site works, but each browser keeps its own copy.

When new photos or cleaner names ship in the catalog, boards already in use pick
them up automatically — except on gifts someone has edited by hand, which are
left alone.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main` (enable Pages → Source: GitHub Actions in the repo settings).

## Still to come

- The per-profile look and feel (each profile carries placeholder colors today).
- A shared backend so everyone sees the same board.
- A real search endpoint for the elf.
