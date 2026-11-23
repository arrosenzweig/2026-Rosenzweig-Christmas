// Turning what somebody types into something that can be drawn.
//
// The background questionnaire takes plain words --- "dragons", "matcha",
// "basketball" --- so this maps the common ones onto an emoji. Anything with no
// match is drawn as the word itself, faintly, which works surprisingly well.

const MOTIFS = {
  // christmas
  christmas: '🎄', tree: '🎄', trees: '🎄', santa: '🎅', snow: '❄️', snowflake: '❄️',
  snowman: '⛄', reindeer: '🦌', gift: '🎁', gifts: '🎁', present: '🎁', presents: '🎁',
  bell: '🔔', bells: '🔔', candycane: '🍬', candy: '🍬', stocking: '🧦', star: '⭐',
  stars: '⭐', lights: '✨', sparkle: '✨', sparkles: '✨', holly: '🌿', mistletoe: '🌿',
  elf: '🧝', elves: '🧝', sleigh: '🛷', ornament: '🎊',

  // creatures
  dragon: '🐉', dragons: '🐉', dinosaur: '🦖', dinosaurs: '🦕', cat: '🐱', cats: '🐱',
  kitten: '🐱', dog: '🐶', dogs: '🐶', puppy: '🐶', fox: '🦊', panda: '🐼', frog: '🐸',
  owl: '🦉', butterfly: '🦋', butterflies: '🦋', bee: '🐝', bees: '🐝', penguin: '🐧',
  lion: '🦁', tiger: '🐯', octopus: '🐙', sloth: '🦥', turtle: '🐢', horse: '🐴',
  unicorn: '🦄', bunny: '🐰', rabbit: '🐰', bird: '🐦', dolphin: '🐬', shark: '🦈',
  whale: '🐳', fish: '🐠', dragonfly: '🪰', axolotl: '🦎', lizard: '🦎',

  // nature
  flower: '🌸', flowers: '🌸', rose: '🌹', roses: '🌹', sunflower: '🌻', leaf: '🍃',
  leaves: '🍃', plant: '🪴', plants: '🪴', cactus: '🌵', mushroom: '🍄', moon: '🌙',
  sun: '☀️', rainbow: '🌈', cloud: '☁️', clouds: '☁️', ocean: '🌊', wave: '🌊',
  waves: '🌊', mountain: '⛰️', mountains: '⛰️', fire: '🔥', water: '💧', lightning: '⚡',

  // food & drink
  matcha: '🍵', tea: '🍵', coffee: '☕', cocoa: '☕', hotchocolate: '☕', cookie: '🍪',
  cookies: '🍪', cake: '🍰', donut: '🍩', donuts: '🍩', pizza: '🍕', sushi: '🍣',
  strawberry: '🍓', strawberries: '🍓', cherry: '🍒', cherries: '🍒', lemon: '🍋',
  citrus: '🍊', orange: '🍊', peach: '🍑', watermelon: '🍉', avocado: '🥑',
  icecream: '🍦', chocolate: '🍫', popcorn: '🍿', honey: '🍯', bread: '🥐',

  // things people like
  book: '📚', books: '📚', music: '🎵', notes: '🎶', guitar: '🎸', piano: '🎹',
  headphones: '🎧', camera: '📷', art: '🎨', paint: '🎨', makeup: '💄', perfume: '🧴',
  nails: '💅', gem: '💎', gems: '💎', diamond: '💎', crystal: '🔮', crystals: '🔮',
  heart: '💖', hearts: '💖', crown: '👑', shoes: '👟', basketball: '🏀', football: '🏈',
  soccer: '⚽', baseball: '⚾', tennis: '🎾', skating: '⛸️', skiing: '⛷️', surfing: '🏄',
  yoga: '🧘', pilates: '🧘', gaming: '🎮', games: '🎮', videogames: '🎮', controller: '🎮',
  computer: '💻', phone: '📱', car: '🚗', plane: '✈️', rocket: '🚀', space: '🪐',
  planet: '🪐', alien: '👽', ghost: '👻', skull: '💀', money: '💰', clock: '⏰',
  key: '🗝️', candle: '🕯️', balloon: '🎈', balloons: '🎈', party: '🎉', confetti: '🎊',
  teddy: '🧸', bear: '🧸', slime: '🫧', bubbles: '🫧', glitter: '✨', disco: '🪩',

  // more of the things people actually type
  jewels: '💎', jewelry: '💎', gold: '🪙', silver: '🪙', coins: '🪙', cash: '💵',
  dollars: '💵', bills: '💵', fireworks: '🎆', firework: '🎆', sparklers: '🎇',
  candles: '🕯️', cupcake: '🧁', cupcakes: '🧁', macaron: '🍬', boba: '🧋',
  bubbletea: '🧋', smoothie: '🥤', soda: '🥤', wine: '🍷', champagne: '🥂',
  cheese: '🧀', pasta: '🍝', noodles: '🍜', taco: '🌮', burger: '🍔', fries: '🍟',
  pancakes: '🥞', waffles: '🧇', croissant: '🥐', bagel: '🥯', pretzel: '🥨',
  grapes: '🍇', pineapple: '🍍', mango: '🥭', banana: '🍌', apple: '🍎',
  blueberry: '🫐', coconut: '🥥', corn: '🌽', carrot: '🥕', chili: '🌶️',
  shells: '🐚', beach: '🏖️', palm: '🌴', island: '🏝️', volcano: '🌋',
  desert: '🏜️', camping: '🏕️', forest: '🌲', pine: '🌲', maple: '🍁',
  autumn: '🍂', spring: '🌷', tulip: '🌷', daisy: '🌼', lotus: '🪷',
  hibiscus: '🌺', cherryblossom: '🌸', sakura: '🌸', clover: '🍀', luck: '🍀',
  dance: '💃', ballet: '🩰', theatre: '🎭', movies: '🎬', popcornnight: '🍿',
  microphone: '🎤', singing: '🎤', violin: '🎻', drums: '🥁', saxophone: '🎷',
  trumpet: '🎺', banjo: '🪕', chess: '♟️', cards: '🃏', dice: '🎲', puzzle: '🧩',
  lego: '🧱', robot: '🤖', science: '🔬', chemistry: '⚗️', telescope: '🔭',
  magic: '🪄', wand: '🪄', potion: '🧪', mermaid: '🧜', fairy: '🧚', wizard: '🧙',
  knight: '🛡️', sword: '⚔️', castle: '🏰', treasure: '💰', map: '🗺️',
  compass: '🧭', anchor: '⚓', sailing: '⛵', boat: '⛵', train: '🚂',
  bike: '🚲', bicycle: '🚲', skateboard: '🛹', scooter: '🛴', helicopter: '🚁',
  ufo: '🛸', satellite: '🛰️', meteor: '☄️', comet: '☄️', galaxy: '🌌',
  sunrise: '🌅', sunset: '🌇', city: '🏙️', paris: '🗼', travel: '🧳',
  camera2: '📸', film: '🎞️', paintbrush: '🖌️', pencil: '✏️', notebook: '📓',
  letters: '💌', love: '💗', kiss: '💋', ring: '💍', lipstick: '💄',
  nailpolish: '💅', skincare: '🧴', bath: '🛁', soap: '🧼', candlelight: '🕯️',
  cozy: '🛋️', sleep: '😴', pillow: '🛏️', blanket: '🧶', knitting: '🧶',
  yarn: '🧶', sewing: '🪡', garden: '🌻', watering: '🪴', butterfly2: '🦋',
  ladybug: '🐞', snail: '🐌', dragonfly2: '🪲', spider: '🕷️', bat: '🦇',
  wolf: '🐺', deer: '🦌', squirrel: '🐿️', hedgehog: '🦔', koala: '🐨',
  monkey: '🐵', elephant: '🐘', giraffe: '🦒', zebra: '🦓', flamingo: '🦩',
  peacock: '🦚', parrot: '🦜', swan: '🦢', duck: '🦆', chicken: '🐔',
  cow: '🐮', pig: '🐷', sheep: '🐑', goat: '🐐', llama: '🦙', seal: '🦭',
  jellyfish: '🪼', crab: '🦀', lobster: '🦞', shrimp: '🦐', starfish: '⭐',
};

/** When a word is not in the list, it still becomes a picture --- never text. */
const FALLBACKS = ['🌟', '✨', '🎉', '🎈', '💫', '🌈', '🍭', '🔮', '🫧', '🎀', '🪩', '💖'];

/** The emoji for a word, if there is an obvious one. */
export function motifFor(word) {
  const key = String(word || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!key) return null;
  if (MOTIFS[key]) return MOTIFS[key];
  // "purple dragons" -> dragon; try each word, then a trailing plural
  for (const part of String(word).toLowerCase().split(/\s+/).reverse()) {
    const k = part.replace(/[^a-z]/g, '');
    if (MOTIFS[k]) return MOTIFS[k];
    if (k.endsWith('s') && MOTIFS[k.slice(0, -1)]) return MOTIFS[k.slice(0, -1)];
  }
  // nothing matched, so pick a bright stand-in --- the same one every time for
  // this word, so somebody's scene stays their scene
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) % 100000;
  return FALLBACKS[hash % FALLBACKS.length];
}

/** Some ideas to show under the questionnaire boxes. */
export const MOTIF_SUGGESTIONS = ['dragons', 'matcha', 'snowflakes', 'cats', 'guitars', 'strawberries', 'crystals', 'basketball'];
