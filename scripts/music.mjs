// Music for the 30-second campus film — ElevenLabs Music (music_v2_5) with a composition
// plan whose sections line up with the reel's cuts (scripts/media.mjs): 120 BPM, a cut
// every 2 bars (4.0 s), 4 bars per section, the end card resolving from 24 s.
//
//   npm run assets:music [-- --seed 3] [-- --force]   → .cache/audio/reel-s<seed>.mp3
//
// Needs ELEVENLABS_API_KEY in .env.local (paid plan: commercial use without attribution).
// Never name artists or songs in the prompt.
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";

try {
  process.loadEnvFile(".env.local");
} catch {}
const KEY = process.env.ELEVENLABS_API_KEY?.trim();
if (!KEY) throw new Error("ELEVENLABS_API_KEY is missing (.env.local)");

const argv = process.argv.slice(2);
const seed = Number(argv[argv.indexOf("--seed") + 1]) || 1;
const CACHE = ".cache/audio";
mkdirSync(CACHE, { recursive: true });

const NEG = ["vocals", "singing", "lyrics", "spoken word", "choir", "humming", "heavy metal", "dubstep", "aggressive", "dark", "horror", "lo-fi tape hiss"];
const STYLE = ["instrumental", "120 BPM", "D major", "uplifting cinematic", "university film", "warm and hopeful", "clean modern mix"];

const plan = {
  chunks: [
    {
      text: "[Intro — the campus at golden hour]\n{a gentle solo piano motif over an airy string pad, hopeful and warm, no drums yet}",
      duration_ms: 8000,
      positive_styles: [...STYLE, "solo piano", "airy pad", "soft"],
      negative_styles: [...NEG, "drums"],
    },
    {
      text: "[Build — students and labs]\n{warm strings and plucked guitar join the piano motif, a soft kick and light shaker set a steady pulse}",
      duration_ms: 8000,
      positive_styles: [...STYLE, "warm strings", "plucked guitar", "soft kick", "light shaker"],
      negative_styles: NEG,
    },
    {
      text: "[Lift — the library at dusk, then the festival]\n{full uplifting arrangement: soaring strings, bright piano, warm drums, a joyful peak}",
      duration_ms: 8000,
      positive_styles: [...STYLE, "soaring strings", "bright piano", "warm drums", "joyful"],
      negative_styles: NEG,
    },
    {
      text: "[Outro — the logo]\n{drums stop; one final warm, resolved chord on piano and strings that rings out and fades to silence}",
      duration_ms: 6000,
      positive_styles: [...STYLE, "resolved final chord", "ring out", "gentle ending"],
      negative_styles: [...NEG, "drums", "abrupt ending"],
    },
  ],
};

const file = `${CACHE}/reel-s${seed}.mp3`;
if (existsSync(file) && !argv.includes("--force")) {
  console.log(`${file} exists — use --force to regenerate`);
} else {
  const t0 = Date.now();
  console.log(`composing ${plan.chunks.reduce((s, c) => s + c.duration_ms, 0) / 1000}s, seed ${seed} …`);
  const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192", {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model_id: "music_v2_5", composition_plan: plan, seed }),
    signal: AbortSignal.timeout(20 * 60_000),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} — ${(await res.text()).slice(0, 600)}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  writeFileSync(`${file}.json`, JSON.stringify({ model: "music_v2_5", seed, plan, at: new Date().toISOString() }, null, 2));
  console.log(`→ ${file} (${((Date.now() - t0) / 1000) | 0}s)`);
}
// media.mjs uses .cache/audio/reel.mp3 — the chosen take.
copyFileSync(file, `${CACHE}/reel.mp3`);
console.log(`selected ${file} → ${CACHE}/reel.mp3`);
