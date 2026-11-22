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
// Titles coming out of here are always Title Cased, and trailing asides
// ("--- opal please", "(good quality)") are split off into a short
// "Preference: ..." note rather than left in the name.

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
 *   { title: 'Kendra Scott Earrings', note: 'Preference: Opal' }
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
    note: aside ? `Preference: ${titleCase(aside)}` : '',
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
          return { ...given, foundBy: 'search' };
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
    foundBy: given.image ? 'link' : 'offline',
  };
}
