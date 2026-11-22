// What the search agent found for the items that came out of the 2026 list
// document.
//
// The rule here: the item stays whatever the person asked for. Titles are their
// own words, tidied into Title Case, with any aside split out as a
// short note of its own --- a brand only appears in a title when they named
// one. The photo and the link are the CLOSEST MATCH the agent could verify, so
// they may point at one particular shop's version of the thing; they are a
// picture and a reference, not a decision about what to buy.
//
// THE BRAND RULE: never source a branded photo for an item whose owner did not
// name a brand. If they wrote "fake French tip nails", the picture is a plain
// set of French tip nails --- not one shop's box with its logo across it. Only
// when they named it themselves ("Athena Club razor refills", "Brahmin bag",
// "Apple iPad") does a brand belong in the picture or the title.
//
// Keyed by the original wording in seed.js. Items missing from here keep their
// original title and get a drawn placeholder. Photos are hotlinked from the
// shops' own CDNs; if one stops loading, the card falls back to a
// wrapped-present placeholder rather than breaking.

export const CATALOG = {
  // ---------------------------------------------------------- Alyson ----
  'Yukola cold smoked steelhead': {
    title: 'Yukola Cold Smoked Steelhead',
    link: 'https://soloveykitchen.com/products/yukola-cold-smoked-steelhead',
    image: 'https://cdn.shopify.com/s/files/1/0649/5443/3730/files/Minimalist_Black_and_White_Blank_Paper_Document_95.jpg?v=1743310956',
  },
  'All-Clad stainless steel 10-12 in. fry pan': {
    title: "All-Clad Stainless Fry Pan",
    note: '10 To 12 Inch',
    link: 'https://www.all-clad.com/d3-stainless-3-ply-bonded-cookware-fry-pan-12-inch.html',
    image: 'https://www.all-clad.com/media/catalog/product/8/7/8701004401_hero.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=1000&width=1000&canvas=1000:1000',
  },
  'All-Clad stainless steel ~4 qt. sauté pan': {
    title: "All-Clad Stainless Saut\u00e9 Pan",
    note: 'About 4 Quarts',
    link: 'https://www.all-clad.com/d3-stainless-3-ply-bonded-cookware-saute-pan-with-lid-4-quart.html',
    image: 'https://www.all-clad.com/media/catalog/product/8/7/8701004421_hero.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=1000&width=1000&canvas=1000:1000',
  },
  '~8 qt. stockpot': {
    title: "8 Quart Stockpot",
    note: "Doesn't Have To Be All-Clad",
    link: 'https://www.amazon.com/Cuisinart-766-24-Classic-8-Quart-Stockpot/dp/B00008CM6J',
    image: "https://images.pexels.com/photos/18789103/pexels-photo-18789103.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  'Sticky rollers --- purple set with all 3': {
    title: "Get Ur Sticky Purple Roller Set",
    note: 'Purple Set With All 3',
    link: 'https://www.getursticky.com/products/purple-clothes-saver-set-1',
    image: 'https://cdn.shopify.com/s/files/1/1003/6169/9638/files/Screenshot2026-11-19at12.35.43AM_691efc1e-95ac-4f74-9eb8-babed01a0111.png?v=1795070506',
  },
  Showerhead: {
    title: "Showerhead",
    link: 'https://www.amazon.com/AquaCare-Pressure-Spray-Filtered-Showerhead/dp/B0FJBDGC9Z',
    image: "https://images.pexels.com/photos/4194866/pexels-photo-4194866.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  'Mangosteen fruit': {
    title: 'Fresh Mangosteen',
    link: 'https://www.melissas.com/products/mangosteens',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mangosteens_-_whole_and_opened.jpg/1280px-Mangosteens_-_whole_and_opened.jpg',
  },

  // ---------------------------------------------------------- Aleena ----
  'Chargeable hand warmers': {
    title: "Rechargeable Hand Warmers",
    link: 'https://www.amazon.com/dp/B0BG5T55F5',
  },
  'Floral long lasting perfume': {
    title: "Floral Long-Lasting Perfume",
    note: 'Expensive, Long-Lasting Floral',
    link: 'https://www.amazon.com/dp/B009S3UP3W',
    image: "https://images.pexels.com/photos/4735929/pexels-photo-4735929.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  'Portable battery': {
    title: "Portable Battery",
    link: 'https://www.anker.com/products/a1289',
    image: "https://images.pexels.com/photos/3921704/pexels-photo-3921704.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  'Samsung tablet': {
    title: "Samsung Tablet",
    link: 'https://www.samsung.com/us/tablets/galaxy-tab-s10-fe/buy/galaxy-tab-s10-fe-128gb-wi-fi-gray-sm-x520nzaaxar/',
    image: 'https://image-us.samsung.com/SamsungUS/home/mobile/tablets/galaxy-s10-fe/gallery/gray/SDSAC-9171-Galaxy-Tab-S10-FE_Single-KV_2P_H_Gray_RGB-800x600.jpg',
  },
  'reMarkable tablet': {
    title: "reMarkable Tablet",
    link: 'https://remarkable.com/products/remarkable-paper/pro',
    image: 'https://cdn.sanity.io/images/xpujt61d/production/76bda69e2950e47c48eef7a435623920aefd5d0b-1200x630.jpg?fit=max&w=1200&fm=jpg&q=75',
  },
  'Super high quality dresses': {
    title: "House Of CB Dress",
    note: 'House Of CB, Size XS',
    link: 'https://app.houseofcb.com/anastasia-black-satin-corset-dress',
    image: 'https://d166chel5lrjm5.cloudfront.net/images/detailed/68/anastasia-4.jpg',
  },
  'Package of prosciutto': {
    title: "Package Of Prosciutto",
    link: 'https://www.amazon.com/dp/B0G8LRGLGN',
    image: "https://images.pexels.com/photos/20095427/pexels-photo-20095427.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  'Chef paring knife': {
    title: "Chef Paring Knife",
    link: 'https://www.victorinox.com/en-US/Products/Cutlery/Paring-Knives/Swiss-Classic-Paring-Knife/p/6.7603',
    image: "https://images.pexels.com/photos/26926847/pexels-photo-26926847.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  '2 hours of individual personal time with me': {
    title: '2 Hours Of Individual Personal Time',
    note: 'A Thoughtful You/Me Activity, Not A Chore',
  },

  // ----------------------------------------------------------- Alyla ----
  "Turkish delights --- not nutty": {
    title: "Turkish Delight",
    note: "Not Nutty",
    link: "https://www.turkishtaste.com/products/turkish-delight-with-rose-and-lemon-flavored",
    image: "https://images.pexels.com/photos/7393908/pexels-photo-7393908.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  "Apple iPad": {
    title: "Apple iPad",
    link: "https://www.apple.com/ipad-11/",
    image: "https://www.apple.com/v/ipad-11/d/images/meta/ipad-11_overview__brh97xhhd8b6_og.png?202610231814",
  },
  "Gem bedazzling kit": {
    title: "Gem Bedazzling Kit",
    link: "https://www.michaels.com/product/crystal-hotfix-tool-set-by-bead-landing-10682692",
    image: "https://images.unsplash.com/photo-1648942754609-2d5593c5e23e?auto=format&fit=crop&w=1200&q=80",
  },
  "Tooth gems": {
    title: "Tooth Gem Kit",
    link: "https://commons.wikimedia.org/wiki/File:Tandsmyckning.jpg",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tandsmyckning.jpg",
  },
  "Kendra Scott earrings --- opal please": {
    title: "Kendra Scott Earrings",
    note: "Opal",
    link: "https://www.reeds.com/kendra-scott-ellie-stud-earrings-in-white-kyocera-simulated-opal-plu19731801.html",
    image: "https://www.reeds.com/media/catalog/product/cache/497a82b708ed80bbd921bd11008f2bd1/k/e/kendra_scott_ellie_stud_earrings_in_white_kyocera_opal-1-19731801-hx5241dfd5.jpg",
  },
  "Brandy Melville wide leg sweatpants": {
    title: "Brandy Melville Wide Leg Sweatpants",
    link: "https://us.brandymelville.com/products/anastasia-sweatpants-7",
    image: "https://cdn.shopify.com/s/files/1/0455/9827/7796/files/MCH002L-1362ST220000.jpg?v=1790301333",
  },
  "Rhode peptide lip treatment": {
    title: "Rhode Peptide Lip Treatment",
    link: "https://rhodeskin.com/products/peptide-lip-treatment",
    image: "https://cdn.shopify.com/s/files/1/0606/5451/8510/files/main-png-2000x2000_unscented.png?v=1705598678",
  },
  "Mini bodycon bandage dress": {
    title: "Mini Bodycon Bandage Dress",
    link: "https://us.ohpolly.com/products/grace-bandage-bodycon-mini-dress-in-fuchsia-pink",
    image: "https://cdn.shopify.com/s/files/1/0588/5755/4081/files/oh-polly-grace-bandage-bodycon-mini-dress-in-fuschia-pink_16867GraceFuschiaPink_4.jpg?v=1794407503",
  },
  "Crystal candy": {
    title: "Crystal Rock Candy",
    link: "https://www.dylanscandybar.com/products/two-tone-rock-candy-anniversary-set",
    image: "https://images.unsplash.com/photo-1575650771982-097ad8b4a716?auto=format&fit=crop&w=1200&q=80",
  },
  "Glow Recipe full kit": {
    title: "Glow Recipe Full Kit",
    note: "Full Kit",
    link: "https://www.glowrecipe.com/products/the-korean-glass-skincare-vault-kit",
    image: "https://cdn.shopify.com/s/files/1/0543/8301/files/3019494-hero.jpg?v=1789486430",
  },
  "Orabella perfume full size --- Eternal Roots": {
    title: "Orebella Perfume",
    note: "Eternal Roots, Full Size",
    link: "https://orebella.com/products/eternal-roots",
    image: "https://cdn.shopify.com/s/files/1/0815/9762/8735/files/SS_EternalRoots_Group_wide_collection.jpg?v=1754516688",
  },
  "Carpe deodorant": {
    title: "Carpe Deodorant",
    link: "https://www.mycarpe.com/products/underarm-signature",
    image: "https://cdn.shopify.com/s/files/1/0335/1622/4645/files/California_Sandalwood_temp_11-3-26.jpg?v=1793722475",
  },
  "Peachy Babies slime": {
    title: "Peachybbies Slime",
    link: "https://peachybbies.com/products/bestsellers-slime-bundle",
    image: "https://cdn.shopify.com/s/files/1/2179/0939/files/BESTSELLER_SLIME_BUNDLE_UPDATE_d2532a0f-1174-4a5a-9e8c-174d863d122b.png?v=1755197685",
  },
  "Teeth whitening strips": {
    title: "Teeth Whitening Strips",
    link: "https://www.hismileteeth.com/products/whitening-strips",
  },
  "Good razors": {
    title: "Razors",
    link: "https://shopflamingo.com/products/original-razor-starter-set",
    image: "https://images.pexels.com/photos/4404978/pexels-photo-4404978.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  "Sugar cane": {
    title: "Sugar Cane",
    link: "https://miamifruit.org/products/sugarcane",
    image: "https://cdn.shopify.com/s/files/1/1294/9917/products/sugarcane.jpg?v=1706904590",
  },

  // ------------------------------------------ Alexandria & Alysia ----
  "Earbuds": {
    title: "Earbuds",
    note: "Under $20",
    link: "https://www.target.com/p/jlab-go-air-pop-true-wireless-bluetooth-earbuds-black/-/A-83647937",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Earbuds_%2888133%29.jpg/960px-Earbuds_%2888133%29.jpg",
  },
  "Simple / minimalistic necklaces": {
    title: "Minimalist Necklace",
    note: "Silver Or Gold Plated, Does Not Tarnish",
    link: "https://www.target.com/p/adornia-tarnish-resistant-18k-gold-plated-bar-necklace/-/A-1004003119",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Necklace%2C_chain_%28AM_674270-5%29.jpg/960px-Necklace%2C_chain_%28AM_674270-5%29.jpg",
  },
  "Long sleeve bodysuit or shirt (thermal)": {
    title: "Long Sleeve Thermal Top",
    note: "Size XS",
    link: "https://www.uniqlo.com/us/en/products/E478965-000/00",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/LongJohns-20050126.jpg/960px-LongJohns-20050126.jpg",
  },
  "Towel-like bathrobe": {
    title: "Towel-Like Bathrobe",
    link: "https://www.target.com/p/roxoni-womens-100-cotton-shawl-collar-robe-terry-cloth-bathrobe/-/A-1004952683",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Kylpytakki.jpg/960px-Kylpytakki.jpg",
  },
  "Athena Club razor refills": {
    title: "Athena Club Razor Refills",
    link: "https://www.target.com/p/athena-club-blade-refill-4ct/-/A-87403885",
    image: "https://target.scene7.com/is/image/Target/GUEST_f5e365a0-f593-4bbf-ade9-fb671d68e223?wid=800&hei=800&fmt=pjpeg",
  },
  "Matcha advent calendar": {
    title: "Matcha Advent Calendar",
    link: "https://www.johnlewis.com/bird-blend-matcha-advent-calendar-300g/p115340647",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Matcha-powder-2356768_1280.jpg/960px-Matcha-powder-2356768_1280.jpg",
  },
  "Shoulder shrug": {
    title: "Shoulder Shrug",
    link: "https://www.target.com/p/women-s-lightweight-shrug-sweater-for-dresses-tops-long-sleeve-open-front-knit-crop-bolero-cardigan/-/A-1002725592",
    image: "https://images.pexels.com/photos/21575896/pexels-photo-21575896.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  "Fake French tip nails": {
    title: "Fake French Tip Nails",
    note: "Good Quality",
    link: "https://www.target.com/p/olive-38-june-press-on-fake-nails-short-squoval-classic-french-42ct/-/A-86946132",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Frenchmanicurewiki.jpg/960px-Frenchmanicurewiki.jpg",
  },
  "Phone wallet": {
    title: "Phone Wallet",
    link: "https://www.target.com/p/popsockets-magnetic-phone-wallet-with-grip-and-magsafe-magnetic-adapter-ring-included/-/A-83446887",
  },
  "Cheap pilates socks": {
    title: "Pilates Socks",
    note: "Cheap, Check With Me First",
    link: "https://www.target.com/p/gaiam-studio-select-barre-sock-2pk/-/A-94413600",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Anti-slip_socks.jpg/960px-Anti-slip_socks.jpg",
  },
  "Yoga wrap top": {
    title: "Yoga Wrap Top",
    link: "https://athleta.gap.com/browse/product.do?pid=8455740820002",
  },

  // --------------------------------------------------- Alyson, part 2 ----
  "The Unwind book series --- full blue set": {
    title: "The Unwind Book Series",
    note: "Full Blue Set",
    link: "https://www.simonandschuster.com/books/Ultimate-Unwind-Paperback-Collection-(Boxed-Set)/Neal-Shusterman/Unwind-Dystology/9781481491815",
    image: "https://m.media-amazon.com/images/P/1481491814.01.LZZZZZZZ.jpg",
  },
  "Stylish Victorian ankle pumps": {
    title: "Victorian Ankle Boots",
    note: "Brown",
    link: "https://historicalemporium.com/products/ladies-leather-victorian-boots-brown",
    image: "https://cdn.shopify.com/s/files/1/0980/0974/3654/files/007637_01_6632c204-bb29-4fc6-ab3d-006d7fc380c2.jpg?v=1769541917",
  },
  "Classy or cute skirts (L) & tops (M)": {
    title: "Classy Skirts & Tops",
    note: "Classy Or Cute, Skirts Size L, Tops Size M",
    link: "https://www.jcrew.com/p/womens/categories/clothing/skirts/midi/gwyneth-lace-trim-slip-skirt-in-textured-satin/CD354",
    image: "https://www.jcrew.com/s7-img-facade/CD354_WZ7052?hei=1700&crop=0,0,1360,0",
  },
  "Brahmin bag --- Pecan Melbourne": {
    title: "Brahmin Melbourne Bag",
    note: "Pecan Melbourne",
    link: "https://www.brahmin.com/products/tabitha-pecan-melbourne-t0415100004",
    image: "https://cdn.shopify.com/s/files/1/0669/6406/2445/files/T04-151--00004-1_464b1704-896b-4bf6-ada0-7d3cb600e327.jpg?v=1714075615",
  },
  "PolyGel": {
    title: "PolyGel",
    note: "From Small Business bsg_usa On Instagram",
    link: "https://www.sallybeauty.com/nails/acrylic-nails/polygel-hard-gel-and-builder-gel-nails/polygel-trial-kit/SBS-006720.html",
    image: "https://www.sallybeauty.com/dw/image/v2/BCSM_PRD/on/demandware.static/-/Sites-SBS-SallyBeautySupply/default/dw4e24504a/images/large/SBS-006720.jpg?sw=1000&sh=1000&sm=fit&sfrm=png",
  },
  "Custom embroidered sweater of the cats": {
    title: "Custom Embroidered Sweater Of The Cats",
    note: "Embroidered With The Cats",
    link: "https://www.uncommongoods.com/product/custom-pet-embroidered-sweatshirt",
    image: "https://images.uncommongoods.com/images/items/56700/56797_1_640px.jpg",
  },
  "Cute knit sweaters (L)": {
    title: "Cute Knit Sweater",
    note: "Cute Knit, Size L",
    link: "https://www.jcrew.com/p/womens/categories/clothing/sweaters/pullovers/cable-knit-crewneck-sweater/CN860",
    image: "https://www.jcrew.com/s7-img-facade/CN860_BL8133?hei=1700&crop=0,0,1360,0",
  },
};
