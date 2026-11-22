// Seeded from "2026 Christmas Lists.docx".
// `bought: true` marks the items the doc already listed under BOUGHT; those are
// turned into claims at first load (buyer unknown, so they are credited to the
// placeholder buyer "family").
//
// `notes` carries the parenthetical info the doc asked people to add.
// Priorities are a first guess --- everyone can change them on their own list.

const L = (owner, title, extra = {}) => ({ owner, title, priority: 'med', ...extra });

export const SEED_ITEMS = [
  // ---------------- Alexandria ----------------
  L('alexandria', 'Earbuds', { notes: 'Amazon has some for less than $20', priority: 'med' }),
  L('alexandria', 'Simple / minimalistic necklaces', { notes: "Doesn't tarnish --- silver or gold plated", priority: 'high' }),
  L('alexandria', 'Long sleeve bodysuit or shirt (thermal)', { notes: 'Tops XS / Bottoms S / Shoes 7.5. Links are for reference, I don\u2019t need that exact one', priority: 'med' }),

  // ---------------- Alysia ----------------
  L('alysia', 'Towel-like bathrobe', { priority: 'med' }),
  L('alysia', 'Athena Club razor refills', {
    link: 'https://www.amazon.com/Athena-Club-Womens-Handle-Refills/dp/B0DZ8QT9RB',
    priority: 'high', bought: true,
  }),
  L('alysia', 'Matcha advent calendar', { notes: 'Aleena said she would make it --- I want good quality', priority: 'high', bought: true }),
  L('alysia', 'Shoulder shrug', { priority: 'low' }),
  L('alysia', 'Fake French tip nails', { notes: 'Good quality', priority: 'med' }),
  L('alysia', 'Phone wallet', { notes: 'Like the one I have, it\u2019s getting ripped up', priority: 'high' }),
  L('alysia', 'Cheap pilates socks', { notes: 'Check with me first', priority: 'low' }),
  L('alysia', 'Yoga wrap top', { priority: 'med' }),

  // ---------------- Alyson ----------------
  L('alyson', 'Yukola cold smoked steelhead', { link: 'http://soloveykitchen.com', notes: 'NO store bought sweets', priority: 'high' }),
  L('alyson', 'All-Clad stainless steel 10-12 in. fry pan', { priority: 'high' }),
  L('alyson', 'All-Clad stainless steel ~4 qt. saut\u00e9 pan', { priority: 'med' }),
  L('alyson', '~8 qt. stockpot', { notes: "Doesn't have to be All-Clad", priority: 'med' }),
  L('alyson', 'Sticky rollers --- purple set with all 3', { link: 'http://getursticky.com', priority: 'med' }),
  L('alyson', 'Showerhead', { link: 'https://a.co/d/02kfrx0D', priority: 'med' }),
  L('alyson', 'Mangosteen fruit', { priority: 'low' }),
  L('alyson', 'The Unwind book series --- full blue set', { priority: 'high', bought: true }),
  L('alyson', 'Stylish Victorian ankle pumps', { notes: 'Brown wear', priority: 'med' }),
  L('alyson', 'Classy or cute skirts (L) & tops (M)', { priority: 'med' }),
  L('alyson', 'Brahmin bag --- Pecan Melbourne', { notes: 'Styles: Fallon, Braelynn, Tabitha, Josette', priority: 'high' }),
  L('alyson', 'PolyGel', { notes: 'Small business --- DM bsg_usa on Instagram', priority: 'med' }),
  L('alyson', 'Custom embroidered sweater of the cats', { priority: 'high' }),
  L('alyson', 'Cute knit sweaters (L)', { link: 'https://goodteacherlife.com/collections/sweater', notes: 'MUST BE KNIT --- don\u2019t buy from that link, just the style. Interests: purple (no pink), dragons, dinosaurs, citrus flavors, household appliances', priority: 'med' }),

  // ---------------- Aleena ----------------
  L('aleena', '2 hours of individual personal time with me', { notes: 'Any activity --- can not be tasks you need to do, must be thoughtful you/me activities. No monetary gift can replace your time (plan a sibling date)', priority: 'high' }),
  L('aleena', 'Chargeable hand warmers', { link: 'https://a.co/d/08x9cqtM', priority: 'med' }),
  L('aleena', 'Floral long lasting perfume', { notes: 'Expensive', priority: 'high' }),
  L('aleena', 'Portable battery', { priority: 'med' }),
  L('aleena', 'Samsung tablet', { priority: 'med' }),
  L('aleena', 'reMarkable tablet', { priority: 'med' }),
  L('aleena', 'Super high quality dresses', { notes: 'Ex. House of CB dress (XS)', priority: 'med' }),
  L('aleena', 'Package of prosciutto', { priority: 'low' }),
  L('aleena', 'Chef paring knife', { priority: 'med' }),

  // ---------------- Alyla ----------------
  L('alyla', 'Turkish delights --- not nutty', { notes: 'Size S / Shoe 7.5 / Bra 34D', priority: 'med' }),
  L('alyla', 'Apple iPad', { priority: 'high' }),
  L('alyla', 'Gem bedazzling kit', { priority: 'med', bought: true }),
  L('alyla', 'Tooth gems', { priority: 'med', bought: true }),
  L('alyla', 'Kendra Scott earrings --- opal please', { priority: 'high' }),
  L('alyla', 'Brandy Melville wide leg sweatpants', { priority: 'high' }),
  L('alyla', 'Rhode peptide lip treatment', { priority: 'med' }),
  L('alyla', 'Mini bodycon bandage dress', { priority: 'med' }),
  L('alyla', 'Good razors', { priority: 'low', bought: true }),
  L('alyla', 'Sugar cane', { priority: 'low', bought: true }),
  L('alyla', 'Crystal candy', { priority: 'low' }),
  L('alyla', 'Glow Recipe full kit', { notes: 'I\u2019m all out', priority: 'high' }),
  L('alyla', 'Orabella perfume full size --- Eternal Roots', { priority: 'high' }),
  L('alyla', 'Carpe deodorant', { priority: 'low' }),
  L('alyla', 'Peachy Babies slime', { priority: 'low' }),
  L('alyla', 'Teeth whitening strips', { priority: 'med', bought: true }),
];

// General gift notes --- how someone likes to be shopped for, not specific
// items. These show at the top of their list under Christmas Wishes.
export const SEED_NOTES = {
  alexandria: [
    { kind: 'text', text: 'Links are for reference \u2014 I don\u2019t need that exact one.' },
    { kind: 'text', text: 'Size chart: Tops / Dresses / Jackets XS \u00b7 Bottoms S \u00b7 Shoes 7.5' },
  ],
  alysia: [
    { kind: 'text', text: 'Ask me before buying the oddly specific things \u2014 I\u2019m picky about quality.' },
  ],
  alyson: [
    { kind: 'text', text: 'NO store bought sweets.' },
    { kind: 'text', text: 'My interests: purple (no pink), dragons, dinosaurs, citrus flavors, household appliances.' },
    { kind: 'text', text: 'Sizes: tops M, skirts L.' },
  ],
  aleena: [
    { kind: 'text', text: 'No monetary gift can replace your time \u2014 plan a sibling date.' },
  ],
  alyla: [
    { kind: 'text', text: 'Sizes: S \u00b7 Shoe 7.5 \u00b7 Bra 34D' },
  ],
};
