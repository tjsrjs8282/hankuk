// Downloads every Higgsfield result listed in scripts/assets.json into .cache/raw/
// (skips files already there). The manifest keeps model, settings and prompt for each
// asset, so any of them can be regenerated and swapped in by job id.
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { extname } from "node:path";

const manifest = JSON.parse(await readFile(new URL("./assets.json", import.meta.url), "utf8"));
const out = new URL("../.cache/raw/", import.meta.url);
await mkdir(out, { recursive: true });

const exists = (u) => access(u).then(() => true, () => false);

let fetched = 0;
for (const a of manifest.assets) {
  const file = new URL(`${a.name}${extname(new URL(a.url).pathname)}`, out);
  if (await exists(file)) continue;
  const res = await fetch(a.url);
  if (!res.ok) throw new Error(`${a.name}: HTTP ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  fetched++;
  console.log(`✓ ${a.name}`);
}
console.log(`${fetched} downloaded, ${manifest.assets.length - fetched} cached → .cache/raw/`);
