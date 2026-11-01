// `node scripts/run.mjs vercel astro build` — set DEPLOY_TARGET and run a command.
// A Node wrapper so the env var works the same in Windows shells and in CI.
import { spawnSync } from "node:child_process";

const [target, ...cmd] = process.argv.slice(2);
const r = spawnSync("npx", cmd, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DEPLOY_TARGET: target },
});
process.exit(r.status ?? 1);
