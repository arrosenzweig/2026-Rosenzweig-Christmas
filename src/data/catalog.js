// What the search agent found for the items that came out of the 2026 list
// document.
//
// The rule here: the item stays whatever the person asked for. Titles are their
// own words, tidied into Title Case, with any aside split out as a
// "Preference: ..." note --- a brand only appears in a title when they named
// one. The photo and the link are the CLOSEST MATCH the agent could verify, so
// they may point at one particular shop's version of the thing; they are a
// picture and a reference, not a decision about what to buy.
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
    note: 'Preference: 10 To 12 Inch',
    link: 'https://www.all-clad.com/d3-stainless-3-ply-bonded-cookware-fry-pan-12-inch.html',
    image: 'https://www.all-clad.com/media/catalog/product/8/7/8701004401_hero.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=1000&width=1000&canvas=1000:1000',
  },
  'All-Clad stainless steel ~4 qt. sauté pan': {
    title: "All-Clad Stainless Saut\u00e9 Pan",
    note: 'Preference: About 4 Quarts',
    link: 'https://www.all-clad.com/d3-stainless-3-ply-bonded-cookware-saute-pan-with-lid-4-quart.html',
    image: 'https://www.all-clad.com/media/catalog/product/8/7/8701004421_hero.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=1000&width=1000&canvas=1000:1000',
  },
  '~8 qt. stockpot': {
    title: "8 Quart Stockpot",
    note: "Preference: Doesn't Have To Be All-Clad",
    link: 'https://www.amazon.com/Cuisinart-766-24-Classic-8-Quart-Stockpot/dp/B00008CM6J',
    image: 'https://m.media-amazon.com/images/I/41k0lr7vnAL._AC_SL1000_.jpg',
  },
  'Sticky rollers --- purple set with all 3': {
    title: "Get Ur Sticky Purple Roller Set",
    note: 'Preference: Purple Set With All 3',
    link: 'https://www.getursticky.com/products/purple-clothes-saver-set-1',
    image: 'https://cdn.shopify.com/s/files/1/1003/6169/9638/files/Screenshot2026-11-19at12.35.43AM_691efc1e-95ac-4f74-9eb8-babed01a0111.png?v=1795070506',
  },
  Showerhead: {
    title: "Showerhead",
    link: 'https://www.amazon.com/AquaCare-Pressure-Spray-Filtered-Showerhead/dp/B0FJBDGC9Z',
    image: 'https://m.media-amazon.com/images/I/81Voxy0TN6L._AC_SL1500_.jpg',
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
    image: 'https://m.media-amazon.com/images/I/71H3b5pgQCL._AC_SL1500_.jpg',
  },
  'Floral long lasting perfume': {
    title: "Floral Long-Lasting Perfume",
    note: 'Preference: Expensive, Long-Lasting Floral',
    link: 'https://www.amazon.com/dp/B009S3UP3W',
    image: 'https://m.media-amazon.com/images/I/71vP8VO6fvL._AC_SL1500_.jpg',
  },
  'Portable battery': {
    title: "Portable Battery",
    link: 'https://www.anker.com/products/a1289',
    image: 'https://cdn.shopify.com/s/files/1/0493/9834/9974/products/A1289011-Anker_737_Power_Bank_PowerCore_24K_1.png?v=1775967275',
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
    note: 'Preference: House Of CB, Size XS',
    link: 'https://app.houseofcb.com/anastasia-black-satin-corset-dress',
    image: 'https://d166chel5lrjm5.cloudfront.net/images/detailed/68/anastasia-4.jpg',
  },
  'Package of prosciutto': {
    title: "Package Of Prosciutto",
    link: 'https://www.amazon.com/dp/B0G8LRGLGN',
    image: 'https://m.media-amazon.com/images/I/716unEbKMNL._SL1500_.jpg',
  },
  'Chef paring knife': {
    title: "Chef Paring Knife",
    link: 'https://www.victorinox.com/en-US/Products/Cutlery/Paring-Knives/Swiss-Classic-Paring-Knife/p/6.7603',
    image: 'https://imageengine.victorinox.com/transform/c5cabef9-1c03-4d73-aadf-694a23b0bed9/CUT_6-7603_S1',
  },
  '2 hours of individual personal time with me': {
    title: '2 Hours Of Individual Personal Time',
    note: 'Preference: A Thoughtful You/Me Activity, Not A Chore',
  },

  // ----------------------------------------------------------- Alyla ----
  "Turkish delights --- not nutty": {
    title: "Turkish Delight",
    note: "Preference: Not Nutty",
    link: "https://www.turkishtaste.com/products/turkish-delight-with-rose-and-lemon-flavored",
    image: "https://cdn.shopify.com/s/files/1/0259/9003/7582/products/tt-haci-bekir-lemon-rose-3.jpg?v=1605788047",
  },
  "Apple iPad": {
    title: "Apple iPad",
    link: "https://www.apple.com/ipad-11/",
    image: "https://www.apple.com/v/ipad-11/d/images/meta/ipad-11_overview__brh97xhhd8b6_og.png?202610231814",
  },
  "Gem bedazzling kit": {
    title: "Gem Bedazzling Kit",
    link: "https://www.michaels.com/product/crystal-hotfix-tool-set-by-bead-landing-10682692",
    image: "https://imgs.michaels.com/c40f7ef5-d79c-41c5-ba2f-2291a0bd5cc9.jpg?fit=inside%7C540:540",
  },
  "Tooth gems": {
    title: "Tooth Gem Kit",
    link: "https://gemzeez.com/products/gemzeez-2-0-starter-kit-family-pack",
    image: "https://cdn.shopify.com/s/files/1/0385/7996/1900/files/IMG-4570.png?v=1793074002",
  },
  "Kendra Scott earrings --- opal please": {
    title: "Kendra Scott Earrings",
    note: "Preference: Opal",
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
    image: "https://cdn.shopify.com/s/files/1/0150/8992/6198/files/20211215-By-Asha-Fuller-DCB-0007-Z.jpg?v=1706816016",
  },
  "Glow Recipe full kit": {
    title: "Glow Recipe Full Kit",
    note: "Preference: Full Kit",
    link: "https://www.glowrecipe.com/products/the-korean-glass-skincare-vault-kit",
    image: "https://cdn.shopify.com/s/files/1/0543/8301/files/3019494-hero.jpg?v=1789486430",
  },
  "Orabella perfume full size --- Eternal Roots": {
    title: "Orebella Perfume",
    note: "Preference: Eternal Roots, Full Size",
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
    image: "https://cdn.shopify.com/s/files/1/0916/4078/files/01-Strips-ProductPage.png?v=1691535894",
  },
  "Good razors": {
    title: "Razors",
    link: "https://shopflamingo.com/products/original-razor-starter-set",
    image: "https://cdn.shopify.com/s/files/1/0558/7481/4054/files/2026_Allure_Starter_set_lilac.jpg?v=1790097165",
  },
  "Sugar cane": {
    title: "Sugar Cane",
    link: "https://miamifruit.org/products/sugarcane",
    image: "https://cdn.shopify.com/s/files/1/1294/9917/products/sugarcane.jpg?v=1706904590",
  },

  // ------------------------------------------ Alexandria & Alysia ----
  "Earbuds": {
    title: "Earbuds",
    note: "Preference: Under $20",
    link: "https://www.target.com/p/jlab-go-air-pop-true-wireless-bluetooth-earbuds-black/-/A-83647937",
    image: "https://target.scene7.com/is/image/Target/GUEST_2aaa4389-48cf-465e-b161-dba213036573?wid=800&hei=800&fmt=pjpeg",
  },
  "Simple / minimalistic necklaces": {
    title: "Minimalist Necklace",
    note: "Preference: Silver Or Gold Plated, Does Not Tarnish",
    link: "https://www.target.com/p/adornia-tarnish-resistant-18k-gold-plated-bar-necklace/-/A-1004003119",
    image: "https://target.scene7.com/is/image/Target/GUEST_0903db70-7e6b-4f7a-84c9-2497ab72d168?wid=800&hei=800&fmt=pjpeg",
  },
  "Long sleeve bodysuit or shirt (thermal)": {
    title: "Long Sleeve Thermal Top",
    note: "Preference: Size XS",
    link: "https://www.uniqlo.com/us/en/products/E478965-000/00",
    image: "https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/478965/item/goods_09_478965_3x4.jpg",
  },
  "Towel-like bathrobe": {
    title: "Towel-Like Bathrobe",
    link: "https://www.target.com/p/roxoni-womens-100-cotton-shawl-collar-robe-terry-cloth-bathrobe/-/A-1004952683",
    image: "https://target.scene7.com/is/image/Target/GUEST_64fcdddc-1bde-48b8-99e0-59f9b7579a93?wid=800&hei=800&fmt=pjpeg",
  },
  "Athena Club razor refills": {
    title: "Athena Club Razor Refills",
    link: "https://www.target.com/p/athena-club-blade-refill-4ct/-/A-87403885",
    image: "https://target.scene7.com/is/image/Target/GUEST_f5e365a0-f593-4bbf-ade9-fb671d68e223?wid=800&hei=800&fmt=pjpeg",
  },
  "Matcha advent calendar": {
    title: "Matcha Advent Calendar",
    link: "https://www.johnlewis.com/bird-blend-matcha-advent-calendar-300g/p115340647",
    image: "https://media.johnlewiscontent.com/i/JohnLewis/115320857?fmt=auto&$background-off-white$&$rsp-pdp-port-640$",
  },
  "Shoulder shrug": {
    title: "Shoulder Shrug",
    link: "https://www.target.com/p/women-s-lightweight-shrug-sweater-for-dresses-tops-long-sleeve-open-front-knit-crop-bolero-cardigan/-/A-1002725592",
    image: "https://target.scene7.com/is/image/Target/GUEST_078664ba-8dd9-40d1-8a92-605ef533e8d5",
  },
  "Fake French tip nails": {
    title: "Fake French Tip Nails",
    note: "Preference: Good Quality",
    link: "https://www.target.com/p/olive-38-june-press-on-fake-nails-short-squoval-classic-french-42ct/-/A-86946132",
    image: "https://target.scene7.com/is/image/Target/GUEST_770829f0-4b50-43e9-a5a9-0a62d4bf6e5e?wid=800&hei=800&fmt=pjpeg",
  },
  "Phone wallet": {
    title: "Phone Wallet",
    link: "https://www.target.com/p/popsockets-magnetic-phone-wallet-with-grip-and-magsafe-magnetic-adapter-ring-included/-/A-83446887",
    image: "https://target.scene7.com/is/image/Target/GUEST_e7a22f58-5701-4ab6-95bc-a7c427856a0e?wid=800&hei=800&fmt=pjpeg",
  },
  "Cheap pilates socks": {
    title: "Pilates Socks",
    note: "Preference: Cheap, Check With Me First",
    link: "https://www.target.com/p/gaiam-studio-select-barre-sock-2pk/-/A-94413600",
    image: "https://target.scene7.com/is/image/Target/GUEST_5202585b-0f04-4eca-9749-1537c34d6608?wid=800&hei=800&fmt=pjpeg",
  },
  "Yoga wrap top": {
    title: "Yoga Wrap Top",
    link: "https://athleta.gap.com/browse/product.do?pid=8455740820002",
    image: "https://athleta.gap.com/webcontent/0063/010/601/cn63010601.jpg",
  },

  // --------------------------------------------------- Alyson, part 2 ----
  "The Unwind book series --- full blue set": {
    title: "The Unwind Book Series",
    note: "Preference: Full Blue Set",
    link: "https://www.simonandschuster.com/books/Ultimate-Unwind-Paperback-Collection-(Boxed-Set)/Neal-Shusterman/Unwind-Dystology/9781481491815",
    image: "https://m.media-amazon.com/images/P/1481491814.01.LZZZZZZZ.jpg",
  },
  "Stylish Victorian ankle pumps": {
    title: "Victorian Ankle Boots",
    note: "Preference: Brown",
    link: "https://historicalemporium.com/products/ladies-leather-victorian-boots-brown",
    image: "https://cdn.shopify.com/s/files/1/0980/0974/3654/files/007637_01_6632c204-bb29-4fc6-ab3d-006d7fc380c2.jpg?v=1769541917",
  },
  "Classy or cute skirts (L) & tops (M)": {
    title: "Classy Skirts & Tops",
    note: "Preference: Classy Or Cute, Skirts Size L, Tops Size M",
    link: "https://www.jcrew.com/p/womens/categories/clothing/skirts/midi/gwyneth-lace-trim-slip-skirt-in-textured-satin/CD354",
    image: "https://www.jcrew.com/s7-img-facade/CD354_WZ7052?hei=1700&crop=0,0,1360,0",
  },
  "Brahmin bag --- Pecan Melbourne": {
    title: "Brahmin Melbourne Bag",
    note: "Preference: Pecan Melbourne",
    link: "https://www.brahmin.com/products/tabitha-pecan-melbourne-t0415100004",
    image: "https://cdn.shopify.com/s/files/1/0669/6406/2445/files/T04-151--00004-1_464b1704-896b-4bf6-ada0-7d3cb600e327.jpg?v=1714075615",
  },
  "PolyGel": {
    title: "PolyGel",
    note: "Preference: From Small Business bsg_usa On Instagram",
    link: "https://www.sallybeauty.com/nails/acrylic-nails/polygel-hard-gel-and-builder-gel-nails/polygel-trial-kit/SBS-006720.html",
    image: "https://www.sallybeauty.com/dw/image/v2/BCSM_PRD/on/demandware.static/-/Sites-SBS-SallyBeautySupply/default/dw4e24504a/images/large/SBS-006720.jpg?sw=1000&sh=1000&sm=fit&sfrm=png",
  },
  "Custom embroidered sweater of the cats": {
    title: "Custom Embroidered Sweater Of The Cats",
    note: "Preference: Embroidered With The Cats",
    link: "https://www.uncommongoods.com/product/custom-pet-embroidered-sweatshirt",
    image: "https://images.uncommongoods.com/images/items/56700/56797_1_640px.jpg",
  },
  "Cute knit sweaters (L)": {
    title: "Cute Knit Sweater",
    note: "Preference: Cute Knit, Size L",
    link: "https://www.jcrew.com/p/womens/categories/clothing/sweaters/pullovers/cable-knit-crewneck-sweater/CN860",
    image: "https://www.jcrew.com/s7-img-facade/CN860_BL8133?hei=1700&crop=0,0,1360,0",
  },
};
