// README screenshots — the 2020 site (served from legacy/) next to the new one.
// Run against the built site:  npm run build && npm run preview  (port 4351), then  npm run shots
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const URL = process.env.SHOTS_URL ?? "http://localhost:4351/hankuk/";
const OUT = "docs/screenshots";
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome"].find(existsSync);
if (!CHROME) throw new Error("Chrome not found");
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function page(width, height, mobile = false) {
  const p = await browser.newPage();
  await p.setViewport({ width, height, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  return p;
}

/** Scroll an element to the top (under the sticky bar) and let reveals, images and counters settle. */
async function at(p, selector, offset = 0) {
  await p.evaluate(
    (s, o) => {
      const el = document.querySelector(s);
      const y = el ? el.getBoundingClientRect().top + window.scrollY - o : 0;
      window.scrollTo({ top: y, behavior: "instant" });
    },
    selector,
    offset,
  );
  await wait(2200);
}

async function shot(p, name, clip) {
  await p.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 82, ...(clip ? { clip } : {}) });
  console.log(`✓ ${name}.jpg`);
}

try {
  // ── 2020 ──
  const old = await page(1440, 900);
  await old.goto(`${URL}legacy/index.html`, { waitUntil: "networkidle2" });
  await wait(800);
  await shot(old, "before-index");
  await old.evaluate(() => window.scrollTo(0, 600));
  await wait(600);
  await shot(old, "before-cards");

  // ── 2026 desktop ──
  const p = await page(1440, 900);
  await p.goto(URL, { waitUntil: "networkidle2" });
  await wait(4500); // hero loop fades in
  await shot(p, "after-hero");
  await at(p, ".hl-grid", 96);
  await shot(p, "after-highlights");
  await at(p, "#academic", 76);
  await shot(p, "after-academic");
  await at(p, "#seasons", 0);
  await shot(p, "after-seasons");
  await at(p, "#about", 76);
  await shot(p, "after-about");
  await at(p, "#colleges", 76);
  await shot(p, "after-colleges");
  await at(p, "#campus", 76);
  await shot(p, "after-campus");

  // AI 도우미, answering from the guide
  await at(p, "body", 0);
  await p.click(".quick__btn[data-ask]");
  await wait(2200);
  await p.type("[data-ai-input]", "오늘 학식 뭐야?");
  await p.keyboard.press("Enter");
  await wait(2200);
  await shot(p, "after-assistant");

  // ── 2026 phone ──
  const m = await page(390, 844, true);
  await m.goto(URL, { waitUntil: "networkidle2" });
  await wait(3500);
  await shot(m, "mobile-hero");
  await at(m, ".hl-grid", 70);
  await shot(m, "mobile-highlights");
  await at(m, "#seasons", 0);
  await shot(m, "mobile-seasons");
} finally {
  await browser.close();
}
