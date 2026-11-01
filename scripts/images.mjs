// Raw Higgsfield PNGs (.cache/raw, see fetch.mjs) → source images in src/assets/photos.
// Sources stay large and high quality; Astro's <Picture> makes the AVIF/WebP sizes at build.
//   npm run assets:images
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const RAW = (f) => fileURLToPath(new URL(`../.cache/raw/${f}`, import.meta.url));
const OUT = (f) => fileURLToPath(new URL(`../src/assets/photos/${f}`, import.meta.url));
await mkdir(OUT(""), { recursive: true });

/** name in assets.json → file in src/assets/photos, longest edge kept. */
const photos = [
  { from: "hero-b", to: "hero", width: 2688 },
  { from: "hero-a", to: "boulevard", width: 2400 },
  { from: "slide-admission", to: "slide-admission", width: 2200 },
  { from: "slide-global", to: "slide-global", width: 2200 },
  { from: "slide-ai-lab", to: "slide-ai-lab", width: 2200 },
  { from: "slide-library", to: "slide-library", width: 2200 },
  { from: "library-portrait", to: "library-portrait", width: 1100 },
  { from: "reading-room-wide", to: "reading-room", width: 2400 },
  { from: "festival-night", to: "festival", width: 1600 },
  { from: "campus-map", to: "campus-map", width: 2688 },
  { from: "season-spring", to: "season-spring", width: 2048 },
  { from: "season-summer", to: "season-summer", width: 2048 },
  { from: "season-autumn", to: "season-autumn", width: 2048 },
  { from: "season-winter", to: "season-winter", width: 2048 },
  { from: "season-night", to: "season-night", width: 2048 },
];

/**
 * The four seasons were generated against references, but not pixel-perfectly: measured
 * on the hall / clock tower (gradient registration against summer, which autumn was made
 * from), spring sat ~40 px higher and ~3 % smaller, winter ~13 px lower and 2 % larger.
 * Each frame is scaled about its centre and shifted onto summer, then all four lose the
 * same thin border (so no frame shows a filled edge) and go back to 2048×1360.
 */
const SEASON = { width: 2048, height: 1360, crop: { x: 52, y: 32 } };
const align = {
  "season-spring": { scale: 1.029, dx: -20.5, dy: 40.5 },
  "season-summer": { scale: 1, dx: 0, dy: 0 },
  "season-autumn": { scale: 1.001, dx: 0, dy: 1 },
  "season-winter": { scale: 0.9766, dx: -3.9, dy: -12.7 },
};

async function alignedSeason(name) {
  const { width: W, height: H, crop } = SEASON;
  const { scale, dx, dy } = align[name];
  const Ws = Math.round(W * scale);
  const Hs = Math.round(H * scale);
  const pad = 80;
  const scaled = await sharp(RAW(`${name}.png`)).removeAlpha().resize(Ws, Hs).extend({ top: pad, bottom: pad, left: pad, right: pad, extendWith: "mirror" }).toBuffer();
  // Where the reference frame's top-left falls inside the padded, scaled frame.
  const left = Math.round(pad - (W / 2 + dx - Ws / 2));
  const top = Math.round(pad - (H / 2 + dy - Hs / 2));
  const onRef = await sharp(scaled).extract({ left, top, width: W, height: H }).toBuffer();
  const trimmed = await sharp(onRef).extract({ left: crop.x, top: crop.y, width: W - crop.x * 2, height: H - crop.y * 2 }).toBuffer();
  return sharp(trimmed).resize(W, H);
}

for (const p of photos) {
  if (p.from in align) {
    const info = await (await alignedSeason(p.from)).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(OUT(`${p.to}.jpg`));
    console.log(`✓ ${p.to}.jpg  ${info.width}×${info.height}  ${(info.size / 1024) | 0} KB  (aligned)`);
    continue;
  }
  const info = await sharp(RAW(`${p.from}.png`))
    .resize({ width: p.width, withoutEnlargement: true })
    .removeAlpha()
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUT(`${p.to}.jpg`));
  console.log(`✓ ${p.to}.jpg  ${info.width}×${info.height}  ${(info.size / 1024) | 0} KB`);
}

// The admission banner's student: trim the transparent margin, keep alpha.
const cut = await sharp(RAW("student-books.png"))
  .trim({ threshold: 1 })
  .resize({ height: 1400, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: false })
  .toFile(OUT("student-books.png"));
console.log(`✓ student-books.png  ${cut.width}×${cut.height}  ${(cut.size / 1024) | 0} KB`);
