// "Elf on the shelf" --- the little agent that fills in whatever an item is
// missing. You can add an item with only a title, only a link, or only a
// photo; this fills in the rest.
//
// Two modes:
//
//  1. Live mode. Set VITE_ENRICH_API to an HTTPS endpoint that accepts
//     POST {title, link, image} and answers {title, link, image}. That endpoint
//     is where a real web-search / model call belongs (it needs an API key, so
//     it cannot live in the browser). See README for the contract.
//
//  2. Offline mode (the default, what runs today). No network call: the title
//     is read out of the link, a shopping-search link is built from the title,
//     and a wrapped-present placeholder stands in for a missing photo.

import { placeholderImage } from './images.js';

const API = import.meta.env.VITE_ENRICH_API;

const TITLE_CASE = (s) =>
  s.replace(/\b[a-z]/g, (c) => c.toUpperCase());

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
      if (words.length > 2 && /[a-z]/i.test(words)) return TITLE_CASE(words).slice(0, 80);
    }
    return TITLE_CASE(url.hostname.replace(/^www\./, '').split('.')[0]) + ' find';
  } catch {
    return '';
  }
}

export const searchLinkFor = (title) =>
  `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(title)}`;

/**
 * Fill in the blanks on a draft item.
 * @returns {Promise<{title:string, link:string, image:string, enrichedBy:string}>}
 */
export async function enrich(draft, accent) {
  const given = {
    title: (draft.title || '').trim(),
    link: (draft.link || '').trim(),
    image: draft.image || '',
  };

  if (API && (!given.title || !given.link || !given.image)) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(given),
      });
      if (res.ok) {
        const found = await res.json();
        return {
          title: given.title || found.title || '',
          link: given.link || found.link || '',
          image: given.image || found.image || '',
          enrichedBy: 'search',
        };
      }
    } catch {
      // fall through to the offline filler
    }
  }

  const title = given.title || titleFromLink(given.link) || 'Christmas surprise';
  return {
    title,
    link: given.link || searchLinkFor(title),
    image: given.image || placeholderImage(title, accent),
    enrichedBy: given.title && given.link && given.image ? 'none' : 'offline',
  };
}
