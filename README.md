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

**Pick a profile.** A Netflix-style picker with ten tiles: Dad, Mom, Alexandria,
Alysia, Alyson, Aleena, Alyla, Alex, Isaiah, Jacob. Choosing one sets who you
are for the rest of the session (remembered in this browser).

**My List.** Add a gift with a title, a link, a photo — any one of them is
enough. Whatever you leave blank gets filled in (see *The elf* below). Each item
shows its photo, its title (hyperlinked when there's a link), its notes, and a
priority of three stockings: grey by default, 1 / 2 / 3 lit for Low / Medium /
High. Click the stockings to change the priority at any time. The small **×** in
the corner removes the item. Sort by A→Z, newest added, or highest priority.

**Christmas Wishes.** Pick one person or several at once and see their lists —
read-only, no editing, and you never see your own. Same three sorts. For each
item you can mark:

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

`src/lib/searchAgent.js` fills in whatever an item is missing. It runs in two
modes:

- **Offline (default, no setup).** The title is read out of the link, a shopping
  search link is built from the title, and a wrapped-present placeholder card
  with the title on it stands in for a missing photo.
- **Live search.** Set `VITE_ENRICH_API` to an HTTPS endpoint that accepts
  `POST {title, link, image}` and answers `{title, link, image}`. That endpoint
  is where a real web search / model call belongs — it needs an API key, which
  can't live in the browser. The front end needs no other change.

## Where the data lives

Everything is in the browser's `localStorage` (`src/lib/store.jsx`). That means
**each device currently has its own copy of the lists** — fine for trying it
out, not yet for the whole family sharing one board. Swapping the `load` /
`persist` pair for calls to a small shared API (Firebase, Supabase, or a tiny
server) is the one change needed to make it shared; everything else in the app
already works off that single store.

Lists are seeded from *2026 Christmas Lists.docx* — Alexandria, Alysia, Alyson,
Aleena and Alyla's items, with the ones already marked BOUGHT in the doc coming
in pre-claimed. Dad, Mom, Alex, Isaiah and Jacob start empty.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main` (enable Pages → Source: GitHub Actions in the repo settings).

## Still to come

- The per-profile look and feel (each profile carries placeholder colors today).
- A shared backend so everyone sees the same board.
- A real search endpoint for the elf.
