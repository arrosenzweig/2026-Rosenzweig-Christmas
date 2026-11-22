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

**My Profile.** Upload a profile picture --- dragging, zooming, turning and
straightening it in a round cropper before it is saved, and you can reopen that
cropper any time with **Adjust**. Pick the emoji that stands for you everywhere
your picture doesn't fit. And write your *general* gift notes ---
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

**Christmas Wishes.** Pick one person — one at a time — and you get their page.
It opens with their profile picture, their name beneath it and how many items
they have below that, with their gift notes laid out alongside. Then, if you've
claimed anything for them, a **Gifts you're giving** section; that section simply
isn't there when you haven't claimed anything. Then the rest of their list with
the three sorts. It's read-only, and you never see your own list here. For each
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
into a short note underneath: "Kendra Scott earrings --- opal please" becomes
**Kendra Scott Earrings** with *Opal* as its subtitle.

### Refresh AI photo

Every gift on your own list has a **Refresh AI photo** button above **Change
photo**. Pressing it sends the elf out there and then to look for another
picture of whatever the gift is called, through two open libraries that need no
account and answer straight from the browser: **Openverse** (Creative Commons
photos, where everyday objects actually live) and **Wikimedia Commons** as a
fallback. Press it again and you get a different one --- each press works
further down the results.

Because the search uses the gift's own name, a gift nobody put a brand on gets a
plain photo of the thing: the brand rule holds by construction. These are real
photographs off the internet, so quality varies --- press again, or upload your
own, which replaces it and takes the AI label off.

### The brand rule

A brand only ever appears in a gift's picture or its name when the person asked
for that brand. "Fake French tip nails" gets a plain photo of French tip nails,
not one shop's box with a logo across it; "Rhode peptide lip treatment" gets
Rhode, because that is what was asked for. Anything plugged in at stage 1 should
be told the same thing.

### The catalog

All 50 items from the list document were looked up ahead of time by web-search
agents and live in `src/data/catalog.js` --- clean name, preference note, real
product page, real product photo from the shop's own CDN. It is keyed by the
document's original wording, so redoing that research only touches that one
file. If a shop ever stops serving a photo, the card falls back to the drawn
placeholder rather than showing a broken image.

## Make this page yours

At the foot of **My Profile** there is a short questionnaire that restyles *your
own view* of the site and nobody else's:

1. **Up to two colours** --- they become your buttons, headings and highlights.
2. **Three things for your background** --- typed in plain words. Recognised
   words ("dragons", "matcha", "snowflakes") turn into pictures scattered faintly
   behind the page; anything else is written out in your own words instead.
3. **One special something** --- a single element that drifts slowly across.

None of it touches anyone's list, and none of it changes what other people see.
"Back to default" puts your profile's own colours back. The word-to-picture
list lives in `src/data/motifs.js`, so it is easy to teach it new words.

## Styling

`src/data/profiles.js` is the whole look of the signed-in site. Each person
carries two accent colors, a background texture, a heading font, how round their
cards are, and a motif that sits beside their page titles; everything else reads
those through CSS variables. Restyling someone is an edit to that file alone.
The base palette --- cream paper, candy-cane red, fir green, gold trim --- lives
at the top of `src/styles.css`.

## Where the data lives

There is **one shared board**, and it is already running --- nobody has to sign
up, log in, or set anything up. Open the site and you are on it.

Everything anyone adds, edits, claims or deletes is written to that board the
moment it happens, and every open tab re-reads it every five seconds, so a gift
Alyla adds on her phone turns up on Mom's laptop by itself. The board lives on a
server, not inside the site, so the site can be rebuilt and redeployed as often
as you like without touching a single list. `localStorage` is only a cache, so a
tab paints instantly and keeps working if the network blips.

It is hosted on [textdb.dev](https://textdb.dev) --- a free plain-text store
that needs no account and no API key --- under one long random key
(`src/lib/remote.js`). That key is what keeps the board private: it is not
guessable, but anyone who had it could read or write the board, so treat it like
a door key rather than a password. Nothing in the lists is secret from the
family anyway --- the point of the site is that everyone reads everyone else's.

Writes are read-modify-write and queued one at a time, so two people changing
different gifts in the same minute do not overwrite each other. A blank or
failed read never wipes a board that is known to have things on it.

The footer always says where you stand: *Shared board*, *Connecting…*, or
*Can't reach the shared board* (in which case your changes are kept in this
browser and are not lost).

### If the family ever outgrows it

Set `VITE_FIREBASE_DB`, or `FIREBASE_DB` in `src/lib/remote.js`, to a Firebase
Realtime Database URL and that takes over instead --- same data, same behaviour,
but with real accounts and rules if you ever want them.

### Whose photo is it

A photo the search agent found carries a faint line along the bottom of the
picture: **Warning! Default image by AI agent**. On your own list each of those
has an **Approve this photo** checkbox --- tick it and the line disappears from
everyone else's view of your list, though you still see it on yours. Upload your
own photo and there is no line and no checkbox, because nothing was guessed.

### When photos and names improve

Catalog updates flow into the live board automatically, so everyone gets the
better photo. Gifts somebody has edited by hand are left alone.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main` (enable Pages → Source: GitHub Actions in the repo settings).

## Still to come

- The per-profile look and feel (each profile carries placeholder colors today).
- A shared backend so everyone sees the same board.
- A real search endpoint for the elf.
