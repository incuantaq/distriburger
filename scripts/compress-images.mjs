import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR = 'public/images/productos';
const MAX_WIDTH = 1400;   // suficiente para lightbox en pantallas grandes
const THUMB_WIDTH = 600;  // para el grid de galería
const QUALITY = 82;

const files = (await readdir(INPUT_DIR))
  .filter(f => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()));

console.log(`Comprimiendo ${files.length} imágenes...\n`);

for (const file of files) {
  const inputPath = join(INPUT_DIR, file);
  const name = basename(file, extname(file));

  // Versión principal (para lightbox)
  const outputFull = join(INPUT_DIR, `${name}.webp`);
  await sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outputFull);

  // Thumbnail (para el grid)
  const outputThumb = join(INPUT_DIR, `${name}-thumb.webp`);
  await sharp(inputPath)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(outputThumb);

  const { size: orig } = await import('fs').then(m => m.promises.stat(inputPath));
  const { size: full } = await import('fs').then(m => m.promises.stat(outputFull));
  const { size: thumb } = await import('fs').then(m => m.promises.stat(outputThumb));

  const pct = Math.round((1 - full / orig) * 100);
  console.log(
    `  ${file.padEnd(20)} ${(orig/1e6).toFixed(1)}MB → full: ${(full/1e3).toFixed(0)}KB  thumb: ${(thumb/1e3).toFixed(0)}KB  (-${pct}%)`
  );
}

console.log('\nListo.');
