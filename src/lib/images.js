// Shrink an uploaded photo before it goes into storage, and build a stand-in
// picture for items that never got one.

const MAX_EDGE = 640;

export function fileToResizedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not an image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const escapeXml = (s) =>
  String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));

function wrap(text, perLine = 18, maxLines = 3) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > perLine && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
    if (lines.length === maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line.trim());
  return lines.length ? lines : ['Gift'];
}

/** A wrapped-present placeholder card with the item's title on it. */
export function placeholderImage(title, accent = '#c62828') {
  const lines = wrap(title || 'Gift');
  const text = lines
    .map((l, i) => `<text x="160" y="${150 + i * 22}" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#f6f1e7">${escapeXml(l)}</text>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${accent}"/><stop offset="100%" stop-color="#0d1b12"/></linearGradient></defs>
<rect width="320" height="240" fill="url(#g)"/>
<text x="160" y="92" text-anchor="middle" font-size="54">\u{1F381}</text>
${text}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ---------------------------------------------------------------- cropping --

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not open that photo'));
    img.src = src;
  });

/** How big a picture becomes once it has been turned by `deg`. */
function turnedSize(width, height, deg) {
  const rad = (deg * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

/**
 * Cut the chosen piece out of a photo, turned by `rotation` degrees, and hand
 * it back as a square JPEG small enough to live happily in the shared board.
 *
 * `area` is react-easy-crop's croppedAreaPixels.
 */
export async function cropToDataUrl(src, area, rotation = 0, maxEdge = 420) {
  const image = await loadImage(src);

  // first draw the whole photo, turned, so the crop box lines up with what the
  // person was looking at
  const turned = turnedSize(image.width, image.height, rotation);
  const stage = document.createElement('canvas');
  stage.width = Math.round(turned.width);
  stage.height = Math.round(turned.height);
  const sctx = stage.getContext('2d');
  sctx.translate(stage.width / 2, stage.height / 2);
  sctx.rotate((rotation * Math.PI) / 180);
  sctx.drawImage(image, -image.width / 2, -image.height / 2);

  // then cut out the chosen square and shrink it
  const side = Math.max(1, Math.round(Math.min(area.width, area.height)));
  const out = document.createElement('canvas');
  const edge = Math.min(maxEdge, side);
  out.width = edge;
  out.height = edge;
  const octx = out.getContext('2d');
  octx.imageSmoothingQuality = 'high';
  octx.fillStyle = '#ffffff';
  octx.fillRect(0, 0, edge, edge);
  octx.drawImage(stage, Math.round(area.x), Math.round(area.y), side, side, 0, 0, edge, edge);

  return out.toDataURL('image/jpeg', 0.85);
}

/** The raw photo as a data URL, full size --- the cropper needs the detail. */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/**
 * Get a photo ready for the cropper.
 *
 * Phones hand over enormous files --- a 12 megapixel JPEG, or on an iPhone a
 * HEIC that most browsers cannot open at all. So decode it first, say something
 * useful if that fails, and shrink it before it ever reaches the cropper: the
 * crop is far smoother, and a phone is much less likely to run out of memory.
 */
export async function fileToCropSource(file, maxEdge = 1800) {
  if (!file.type?.startsWith('image/')) {
    throw new Error('That file is not a photo. Pick a JPEG or PNG.');
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Safari/iOS and HEIC: fall back to the old way before giving up
    try {
      const url = URL.createObjectURL(file);
      bitmap = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('decode failed'));
        img.src = url;
      });
    } catch {
      throw new Error(
        'This browser cannot open that photo. iPhones save as HEIC by default — ' +
          'try Settings ▸ Camera ▸ Formats ▸ Most Compatible, or send the photo to yourself first, ' +
          'which turns it into a JPEG.',
      );
    }
  }

  const w = bitmap.width;
  const h = bitmap.height;
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL('image/jpeg', 0.92);
}
