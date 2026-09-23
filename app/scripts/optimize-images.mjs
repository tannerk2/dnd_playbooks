// Resize the Midjourney art in ../project/assets into web-sized WebP files.
// Largest on-screen use is ~170 px wide, so 400 px covers 2x displays.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(root, '../../project/assets');
const out = path.resolve(root, '../public/assets');
await mkdir(out, { recursive: true });

// Delivery art isn't shown in v4, so it's skipped.
for (const f of (await readdir(src)).filter(f => f.endsWith('.png') && !f.startsWith('delivery-'))) {
  const name = f.replace(/\.png$/, '.webp');
  const info = await sharp(path.join(src, f)).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(out, name));
  console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
}
