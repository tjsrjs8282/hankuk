// Pretendard, cut down to the characters this site actually uses.
//
// The npm package ships ~90 unicode-range slices; a Korean page pulls ~17 of them (~450 KB)
// and their @font-face list alone is ~140 KB of CSS. Every string on the page lives in src/,
// so we can collect those characters and keep one variable woff2 (weights 400–800): ~90 KB.
// Text we can't know at build time (what visitors type to the AI 도우미, Gemini answers)
// falls back to the full slices, which scripts/assistant.ts loads when the panel opens.
//
// Runs automatically when Astro starts (astro.config.mjs) — or by hand: npm run assets:font
import { createRequire } from "node:module";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
export const FONT_OUT = join(root, "src/assets/fonts/pretendard-site.woff2");

function siteText() {
  const chars = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(astro|ts|mjs|css|json)$/.test(e.name)) for (const ch of readFileSync(p, "utf8")) chars.add(ch);
    }
  };
  walk(join(root, "src"));
  for (let c = 32; c < 127; c++) chars.add(String.fromCharCode(c));
  return [...chars].filter((ch) => ch.codePointAt(0) >= 32).sort().join("");
}

export async function buildFont({ quiet = false } = {}) {
  const subsetFont = require("subset-font");
  const text = siteText();
  const src = readFileSync(require.resolve("pretendard/dist/web/variable/woff2/PretendardVariable.woff2"));
  const out = await subsetFont(src, text, { targetFormat: "woff2", variationAxes: { wght: { min: 400, max: 800 } } });
  mkdirSync(dirname(FONT_OUT), { recursive: true });
  // Skip the write when nothing changed, so the dev server doesn't reload for nothing.
  if (!existsSync(FONT_OUT) || !readFileSync(FONT_OUT).equals(out)) writeFileSync(FONT_OUT, out);
  if (!quiet) console.log(`pretendard-site.woff2 — ${[...text].length} characters, ${(out.length / 1024).toFixed(0)} KB`);
  return out.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await buildFont();
