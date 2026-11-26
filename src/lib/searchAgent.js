// "Elf on the shelf" --- the little agent that fills in whatever an item is
// missing. You can add an item with only a title, only a link, or only a
// photo; this goes and finds the rest.
//
// It works in three stages, stopping as soon as the item is complete:
//
//  1. Your own search endpoint, if you have one. Set VITE_ENRICH_API to an
//     HTTPS endpoint that accepts POST {title, link, image} and answers
//     {title, link, image}. This is the only stage that can search the web by
//     description, because a real search/model call needs an API key and a key
//     cannot live in a browser. See the README for the contract.
//
//  2. Link lookup (no key needed, runs today). If there is a link, the page's
//     own preview data --- its real title and its product photo --- is fetched
//     through Microlink's free public API.
//
//  3. Offline filler. A shopping-search link built from the title, and a
//     wrapped-present card with the title written on it.
//
// THE BRAND RULE, for whatever fills these in: a brand only belongs in the
// picture or the name when the person asked for that brand. "Fake French tip
// nails" gets a plain set of French tip nails; "Rhode peptide lip treatment"
// gets Rhode. A search endpoint plugged in at stage 1 should be told the same.
//
// Titles coming out of here are always Title Cased, and trailing asides
// ("--- opal please", "(good quality)") are split off into a short
// short note under the title rather than left in the name.

import { placeholderImage } from './images.js';

const API = import.meta.env.VITE_ENRICH_API;
const MICROLINK = 'https://api.microlink.io/?url=';

const SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of',
  'on', 'or', 'the', 'to', 'up', 'via', 'with',
]);

/** "kendra scott earrings" -> "Kendra Scott Earrings" */
export function titleCase(text) {
  const words = String(text || '').trim().split(/\s+/);
  return words
    .map((w, i) => {
      const bare = w.toLowerCase();
      // leave shouty brand names and things like "iPad" or "8qt" alone
      if (/[A-Z]{2,}/.test(w) || /^[a-z]+[A-Z]/.test(w)) return w;
      if (i > 0 && i < words.length - 1 && SMALL_WORDS.has(bare)) return bare;
      return bare.charAt(0).toUpperCase() + bare.slice(1);
    })
    .join(' ');
}

/**
 * Pulls the aside out of a messy wish-list line.
 * "Kendra Scott earrings --- opal please" ->
 *   { title: 'Kendra Scott Earrings', note: 'Opal' }
 */
export function cleanTitle(raw) {
  let text = String(raw || '').trim();
  let aside = '';

  const dash = text.match(/^(.*?)\s*(?:---|—|–|\s-\s)\s*(.+)$/);
  if (dash) {
    text = dash[1];
    aside = dash[2];
  }

  const paren = text.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (paren) {
    text = paren[1];
    aside = aside ? `${paren[2]}, ${aside}` : paren[2];
  }

  aside = aside.replace(/\b(please|pls|plz)\b/gi, '').replace(/\s{2,}/g, ' ').replace(/[,\s]+$/, '').trim();

  return {
    title: titleCase(text),
    // the aside stands on its own as the subtitle, with no label in front
    note: aside ? titleCase(aside) : '',
  };
}

export function titleFromLink(link) {
  try {
    const url = new URL(link);
    const slug = url.pathname
      .split('/')
      .filter((p) => p && !/^(dp|ref|gp|product|products|collections|item|p)$/i.test(p) && !/^[A-Z0-9]{10}$/.test(p))
      .pop();
    if (slug) {
      const words = decodeURIComponent(slug)
        .replace(/\.(html?|php|aspx)$/i, '')
        .replace(/[-_+]+/g, ' ')
        // drop trailing SKU-ish tokens like "P123456" or "B0DZ8QT9RB"
        .replace(/\s+[A-Za-z]?\d{3,}[A-Za-z0-9]*$/, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (words.length > 2 && /[a-z]/i.test(words)) return titleCase(words).slice(0, 80);
    }
    return `${titleCase(url.hostname.replace(/^www\./, '').split('.')[0])} Find`;
  } catch {
    return '';
  }
}

export const searchLinkFor = (title) =>
  `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(title)}`;

/** Stage 2: ask Microlink what a page is actually about. */
async function lookUpLink(link) {
  try {
    const res = await fetch(`${MICROLINK}${encodeURIComponent(link)}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const body = await res.json();
    if (body.status !== 'success') return null;
    return {
      title: body.data?.title || '',
      image: body.data?.image?.url || body.data?.logo?.url || '',
    };
  } catch {
    return null;
  }
}

/**
 * Fill in the blanks on a draft item.
 * @returns {Promise<{title, link, image, note, foundBy}>}
 */
export async function enrich(draft, accent) {
  const cleaned = cleanTitle(draft.title);
  const given = {
    title: cleaned.title,
    note: cleaned.note,
    link: (draft.link || '').trim(),
    image: draft.image || '',
  };
  // a photo the person picked themselves is theirs; anything the elf digs up
  // afterwards is credited to the agent on the card
  const imageBy = draft.image ? 'you' : 'agent';

  // --- stage 1: your own search endpoint ---------------------------------
  if (API && (!given.title || !given.link || !given.image)) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: given.title, link: given.link, image: given.image }),
      });
      if (res.ok) {
        const found = await res.json();
        if (found.title && !given.title) given.title = titleCase(found.title);
        if (found.link && !given.link) given.link = found.link;
        if (found.image && !given.image) given.image = found.image;
        if (given.title && given.link && given.image) {
          return { ...given, imageBy, foundBy: 'search' };
        }
      }
    } catch {
      // keep going --- the stages below need no key
    }
  }

  // --- stage 2: read the link the person pasted --------------------------
  if (given.link && (!given.image || !given.title)) {
    const found = await lookUpLink(given.link);
    if (found) {
      if (!given.image && found.image) given.image = found.image;
      if (!given.title && found.title) given.title = titleCase(found.title.slice(0, 80));
    }
  }

  // --- stage 3: fill the rest in ourselves -------------------------------
  const title = given.title || titleFromLink(given.link) || 'Christmas Surprise';
  return {
    title,
    note: given.note,
    link: given.link || searchLinkFor(title),
    image: given.image || placeholderImage(title, accent),
    imageBy,
    foundBy: given.image ? 'link' : 'offline',
  };
}

// --------------------------------------------------------- finding photos --
//
// "Refresh AI photo" sends the elf to look for a picture of whatever the gift
// is called. There are two ways it can do that, and they are not equal.
//
// 1. GOOGLE IMAGES (what you want, and what this prefers)
//    Google's Programmable Search JSON API searches Google's own image index
//    over the whole web --- the same pictures you would get by typing the gift
//    name into Google Images. It needs two free values, and nothing else:
//
//      a) an API key    console.cloud.google.com -> APIs & Services ->
//                       Library -> "Custom Search API" -> Enable -> Credentials
//                       -> Create credentials -> API key
//      b) a search id   programmablesearchengine.google.com -> Add ->
//                       tick "Search the entire web" -> create -> copy the
//                       "Search engine ID", then in its settings turn
//                       "Image search" ON
//
//    Paste them below as GOOGLE_KEY and GOOGLE_CX (or set VITE_GOOGLE_KEY and
//    VITE_GOOGLE_CX at build time) and every Refresh press is a real Google
//    Images search. The free allowance is 100 searches a day across the family,
//    which is plenty for a wish list. Restrict the key to this site's address
//    in the Google console: the key ships in the page, as browser keys must.
//
// 2. OPENVERSE / WIKIMEDIA (the no-key fallback, and the reason photos have
//    been poor)
//    These are Creative Commons libraries, not a picture of everything. They
//    hold somebody's 2009 snapshot of "thermal shirt" rather than the product
//    you asked for. This is used only while there is no Google key, and the
//    card says so.

const GOOGLE_KEY = '';
const GOOGLE_CX = '';

const KEY = import.meta.env.VITE_GOOGLE_KEY || GOOGLE_KEY;
const CX = import.meta.env.VITE_GOOGLE_CX || GOOGLE_CX;

export const usingGoogle = () => Boolean(KEY && CX);

const OPENVERSE = 'https://api.openverse.org/v1/images/';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

/** Google Images, through the official Programmable Search API. */
async function fromGoogle(title, attempt) {
  const params = new URLSearchParams({
    key: KEY,
    cx: CX,
    q: title,
    searchType: 'image',
    num: '1',
    safe: 'active',
    imgSize: 'large',
    // each press walks one result further down the page of results
    start: String((attempt % 60) + 1),
  });
  const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
  if (!res.ok) {
    const why = res.status === 429 ? 'the daily free allowance is used up' : `status ${res.status}`;
    throw new Error(`Google image search failed: ${why}`);
  }
  const body = await res.json();
  const hit = body.items?.[0];
  if (!hit?.link) return null;
  return {
    image: hit.link,
    link: hit.image?.contextLink || hit.link,
    from: 'Google Images',
  };
}

async function fromOpenverse(title, attempt) {
  const perPage = 4;
  const page = 1 + Math.floor(attempt / perPage);
  const url = `${OPENVERSE}?q=${encodeURIComponent(title)}&page_size=${perPage}&page=${page}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  const body = await res.json();
  const hit = body.results?.[attempt % perPage];
  if (!hit) return null;
  // the provider's own file loads straight away; Openverse's thumbnail service
  // has to generate one first, which can take several seconds
  const direct = hit.url || '';
  const image = /\.(jpe?g|png|webp|gif)(\?|$)/i.test(direct) ? direct : hit.thumbnail || direct;
  return { image, link: hit.foreign_landing_url || direct, from: 'Openverse' };
}

async function fromCommons(title, attempt) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `filetype:bitmap ${title}`,
    gsrlimit: '1',
    gsroffset: String(attempt),
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '900',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${COMMONS}?${params}`);
  if (!res.ok) return null;
  const body = await res.json();
  const page = Object.values(body.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  return {
    image: info.thumburl || info.url,
    link: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
    from: 'Wikimedia Commons',
  };
}

/**
 * Go and find another photo of this gift, searching on its name.
 *
 * With Google set up this is a straight Google Images search for the gift's
 * title. Without it, the Creative Commons libraries are all there is, and the
 * result says which was used so the card can be honest about it.
 *
 * @returns {Promise<{image, link, from}|null>}
 */
export async function findPhoto(title, attempt = 0) {
  const name = String(title || '').trim();
  if (!name) return null;

  if (usingGoogle()) {
    try {
      const found = await fromGoogle(name, attempt);
      if (found?.image) return found;
    } catch (err) {
      console.warn(err.message);
    }
  }

  for (const look of [fromOpenverse, fromCommons]) {
    try {
      const found = await look(name, attempt);
      if (found?.image) return found;
    } catch {
      // try the next library
    }
  }
  return null;
}
