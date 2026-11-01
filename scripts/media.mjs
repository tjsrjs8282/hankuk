// Video for the page, from the Higgsfield/Kling clips in .cache/raw (see fetch.mjs):
//
// 1. Hero loop — the 10 s drone dolly becomes a seamless 8.5 s loop: its last 1.5 s
//    cross-fade into its first 1.5 s, so the loop point sits inside the shot.
//    → public/media/hero.webm (VP9 1080p) · hero.mp4 (H.264 720p) · hero-480.mp4 (phones)
// 2. Campus film — six clips cut on a 120 BPM grid (a cut every 2 bars = 4 s, 0.5 s
//    dissolves centred on the bar line), the end card from og.mjs at 24 s, the
//    ElevenLabs score from music.mjs underneath, loudness-normalised.
//    → public/media/reel.mp4 (720p) · src/assets/photos/reel-poster.jpg
//
//   npm run assets:media   (needs ffmpeg; run assets:og and assets:music first)
import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";

const RAW = ".cache/raw";
const OUT = "public/media";
mkdirSync(OUT, { recursive: true });
mkdirSync(".cache/media", { recursive: true });

function ff(args, label) {
  const t0 = Date.now();
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${label}`);
  console.log(`✓ ${label} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

// ── 1. Hero loop ───────────────────────────────────────────────
const D = 10; // usable source length (s)
const X = 1.5; // cross-fade
const loop = ".cache/media/hero-loop.mov";
ff(
  [
    "-i", `${RAW}/hero-loop.mp4`,
    "-filter_complex",
    `[0:v]scale=1920:1080:flags=lanczos,setsar=1,fps=24,split[a][b];` +
      `[a]trim=${X}:${D},setpts=PTS-STARTPTS[main];` +
      `[b]trim=0:${X},setpts=PTS-STARTPTS[head];` +
      `[main][head]xfade=transition=fade:duration=${X}:offset=${D - 2 * X},format=yuv420p[v]`,
    "-map", "[v]", "-c:v", "prores_ks", "-profile:v", "2", loop,
  ],
  "hero loop (intermediate)",
);
// The loop sits under a dark gradient, so it can be soft: ~2 MB desktop, <1 MB phones.
ff(["-i", loop, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "43", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", `${OUT}/hero.webm`], "hero.webm");
ff(["-i", loop, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${OUT}/hero.mp4`], "hero.mp4");
ff(["-i", loop, "-vf", "scale=854:480:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${OUT}/hero-480.mp4`], "hero-480.mp4");

// ── 2. Campus film ─────────────────────────────────────────────
const clips = ["reel-1-boulevard", "reel-2-friends", "reel-3-stairs", "reel-4-lab", "reel-5-library", "reel-6-festival"];
const BAR2 = 4; // seconds between cuts (2 bars at 120 BPM)
const F = 0.5; // dissolve length, centred on the bar line
const CARD = 30 - (clips.length * BAR2 - F / 2); // end card holds to 30.0 s
const music = ".cache/audio/reel.mp3";
const card = ".cache/media/endcard.png";
if (!existsSync(music) || !existsSync(card)) throw new Error("run npm run assets:music and npm run assets:og first");

const inputs = clips.flatMap((c) => ["-i", `${RAW}/${c}.mp4`]);
const norm = clips
  .map((c, i) => {
    // first clip starts at 0; the others need F/2 of lead-in before their bar line
    const len = i === 0 ? BAR2 + F / 2 : BAR2 + F;
    const fit = c.endsWith("festival") ? "crop=iw:iw*9/16," : ""; // 4:3 source → 16:9
    return `[${i}:v]trim=0.25:${0.25 + len},setpts=PTS-STARTPTS,${fit}scale=1920:1080:flags=lanczos,setsar=1,fps=24,format=yuv420p[c${i}]`;
  })
  .join(";");
const cardIdx = clips.length;
let chain = "";
let prev = "c0";
for (let i = 1; i < clips.length; i++) {
  chain += `;[${prev}][c${i}]xfade=transition=fade:duration=${F}:offset=${i * BAR2 - F / 2}[x${i}]`;
  prev = `x${i}`;
}
chain += `;[${cardIdx}:v]scale=1920:1080,setsar=1,fps=24,format=yuv420p,trim=0:${CARD},setpts=PTS-STARTPTS[card]`;
// 720p keeps the 30 s film around 6 MB — it plays in a dialog, not full-bleed.
chain += `;[${prev}][card]xfade=transition=fade:duration=${F}:offset=${clips.length * BAR2 - F / 2},scale=1280:720:flags=lanczos[v]`;

ff(
  [
    ...inputs,
    "-loop", "1", "-t", String(CARD + 1), "-i", card,
    "-i", music,
    "-filter_complex",
    `${norm}${chain};[${cardIdx + 1}:a]atrim=0:30,afade=t=out:st=28.6:d=1.4,loudnorm=I=-16:TP=-1.5:LRA=11[a]`,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
    "-t", "30", "-movflags", "+faststart",
    `${OUT}/reel.mp4`,
  ],
  "reel.mp4",
);
// Poster for the media tile and the dialog: a frame from the boulevard shot.
ff(["-ss", "1.2", "-i", `${RAW}/reel-1-boulevard.mp4`, "-frames:v", "1", "-vf", "scale=1920:1080:flags=lanczos", "-q:v", "2", "src/assets/photos/reel-poster.jpg"], "reel-poster.jpg");
