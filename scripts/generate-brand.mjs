// Build-time only: render the unchanged shared SVG into portable terminal cells.
// Usage: node scripts/generate-brand.mjs /absolute/master.svg /absolute/sharp/lib/index.js
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [source, renderer] = process.argv.slice(2);
if (!source || !renderer) throw new Error('source_svg_and_sharp_module_required');
const sharp = (await import(pathToFileURL(resolve(renderer)).href)).default;
const bytes = await readFile(source);
const { data, info } = await sharp(bytes).resize(40, 24, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const lines = [];
for (let y = 0; y < 24; y += 4) {
  let line = '';
  for (let x = 0; x < 40; x += 2) {
    let bits = 0;
    for (const [dx, dy, bit] of [[0, 0, 0], [0, 1, 1], [0, 2, 2], [1, 0, 3], [1, 1, 4], [1, 2, 5], [0, 3, 6], [1, 3, 7]]) {
      if (data[((y + dy) * info.width + x + dx) * 4 + 3] >= 96) bits |= 1 << bit;
    }
    line += bits ? String.fromCodePoint(0x2800 + bits) : ' ';
  }
  lines.push(line);
}
const directory = new URL('../src/assets/', import.meta.url);
await mkdir(directory, { recursive: true });
await copyFile(source, new URL('adrouter.svg', directory));
await writeFile(new URL('brand-terminal.json', directory), JSON.stringify({ source: 'logos/jellyfish-logo-transparent.svg', sha256: createHash('sha256').update(bytes).digest('hex'), lines }, null, 2) + '\n');
console.log('AdRouter terminal logo generated from unchanged SVG.');
