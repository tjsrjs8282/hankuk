// Brand renders, drawn by headless Chrome so they use the site's own fonts:
//   public/og.jpg (1200×630 social card) · public/icon-*.png · .cache/media/endcard.png (the film's last frame)
//   npm run assets:og
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find(existsSync);
if (!CHROME) throw new Error("Chrome not found");

await mkdir(root(".cache/media"), { recursive: true });

const mark = (await readFile(root("src/assets/brand/mark.svg"), "utf8")).replace(/<!--.*?-->/s, "");
const font = pathToFileURL(root("node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2")).href;
const hero = pathToFileURL(root("src/assets/photos/hero.jpg")).href;

const base = `
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=block" rel="stylesheet">
  <style>
    @font-face { font-family: Pretendard; src: url(${font}) format("woff2"); font-weight: 100 900; }
    * { margin: 0; box-sizing: border-box; }
    body { font-family: Pretendard, sans-serif; color: #fff; -webkit-font-smoothing: antialiased; }
    .serif { font-family: "Cormorant Garamond", serif; }
    svg { display: block; }
  </style>`;

const og = `${base}
  <style>
    .card { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #0a1b3f; }
    .card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% 50%; }
    .card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5,15,38,.92) 0%, rgba(5,15,38,.72) 42%, rgba(5,15,38,.08) 75%), linear-gradient(0deg, rgba(5,15,38,.6), transparent 40%); }
    .in { position: absolute; z-index: 1; left: 72px; top: 64px; bottom: 60px; display: flex; flex-direction: column; }
    .brand { display: flex; align-items: center; gap: 16px; }
    .brand svg { width: 56px; height: 56px; color: #fff; }
    .ko { font-size: 30px; font-weight: 700; letter-spacing: .02em; }
    .en { font-size: 15px; letter-spacing: .32em; opacity: .8; margin-top: 2px; }
    .t1 { margin-top: auto; font-size: 30px; font-weight: 500; opacity: .9; }
    h1 { font-size: 72px; line-height: 1.12; font-weight: 800; letter-spacing: -.02em; margin-top: 10px; }
    h1 b { color: #f4b81c; font-weight: 800; }
    .meta { margin-top: 28px; display: flex; gap: 12px; }
    .meta span { font-size: 19px; font-weight: 600; padding: 9px 16px; border-radius: 999px; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.28); }
  </style>
  <div class="card">
    <img src="${hero}">
    <div class="in">
      <div class="brand">${mark}<div><div class="ko">한국대학교</div><div class="en serif">HANGUK UNIVERSITY</div></div></div>
      <p class="t1">함께 나누며 세상을 이끌어</p>
      <h1>세계로 향하는<br><b>한국대학교</b></h1>
      <div class="meta"><span>개교 70주년</span><span>2027학년도 신·편입생 모집</span></div>
    </div>
  </div>`;

const endcard = `${base}
  <style>
    .card { width: 1920px; height: 1080px; display: grid; place-items: center; text-align: center;
      background: radial-gradient(ellipse 60% 55% at 50% 42%, #1a3a86 0%, #0a1b3f 58%, #050f26 100%); }
    .card svg { width: 132px; height: 132px; margin: 0 auto 36px; color: #fff; }
    .ko { font-size: 104px; font-weight: 800; letter-spacing: .04em; }
    .en { font-size: 34px; letter-spacing: .5em; margin-top: 18px; opacity: .78; padding-left: .5em; }
    .tag { margin-top: 64px; font-size: 38px; font-weight: 500; opacity: .92; }
    .tag b { color: #f4b81c; font-weight: 700; }
  </style>
  <div class="card"><div>${mark}<div class="ko">한국대학교</div><div class="en serif">HANGUK UNIVERSITY</div>
  <p class="tag">함께 나누며 세상을 이끌어, <b>세계로 향하는 한국대학교</b></p></div></div>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
try {
  const page = await browser.newPage();
  const shoot = async (html, w, h, path, type = "png") => {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    // A real file:// page (not setContent's about:blank) so local fonts and photos may load.
    const tmp = root(".cache/media/render.html");
    await writeFile(tmp, `<!doctype html><meta charset="utf-8">${html}`);
    await page.goto(pathToFileURL(tmp).href, { waitUntil: "load", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path, type, ...(type === "jpeg" ? { quality: 90 } : {}) });
    console.log(`✓ ${path}`);
  };
  await shoot(og, 1200, 630, root("public/og.jpg"), "jpeg");
  await shoot(endcard, 1920, 1080, root(".cache/media/endcard.png"));
} finally {
  await browser.close();
}

const icon = await readFile(root("public/favicon.svg"));
for (const [size, file] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"], [512, "icon-512.png"]]) {
  await sharp(icon, { density: 72 * (size / 64) * 2 }).resize(size, size).png().toFile(root(`public/${file}`));
  console.log(`✓ public/${file}`);
}
