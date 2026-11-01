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

for (const p of photos) {
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
