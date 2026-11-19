import sharp from "sharp";
import { createHash } from "node:crypto";
import { readdir, readFile, mkdir, writeFile, unlink } from "node:fs/promises";
import { basename, extname } from "node:path";

// Source photographs live outside public/, so they are never published: only
// the generated variants are. Sharp drops their metadata (EXIF: camera, GPS).
const SOURCE_DIRECTORY = "src/assets/photos";
const OUTPUT_DIRECTORY = "public/images/generated";
// Larger sources only make the repository heavier: no variant exceeds 1024 px.
const MAX_SOURCE_SIDE = 1280;

const manifest = {};
await mkdir(OUTPUT_DIRECTORY, { recursive: true });
// Remove only variants owned by this generator.
for (const item of await readdir(OUTPUT_DIRECTORY, { withFileTypes: true })) {
  if (item.isFile() && /-[a-f0-9]{12}-\d+\.(?:webp|avif)$/.test(item.name))
    await unlink(`${OUTPUT_DIRECTORY}/${item.name}`);
}
for (const item of await readdir(SOURCE_DIRECTORY, { withFileTypes: true })) {
  if (!item.isFile() || !/\.(?:jpe?g|png|webp|avif)$/i.test(item.name))
    continue;
  const bytes = await readFile(`${SOURCE_DIRECTORY}/${item.name}`);
  const metadata = await sharp(bytes).metadata();
  if (!metadata.width || !metadata.height)
    throw new Error(`Missing image dimensions: ${item.name}`);
  if (Math.max(metadata.width, metadata.height) > MAX_SOURCE_SIDE)
    console.warn(
      `${item.name} is ${metadata.width}×${metadata.height} px: reduce it to ${MAX_SOURCE_SIDE} px on its longest side.`,
    );
  const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const widths = [
    ...new Set(
      [160, 240, 320, 480, 640, 854, 1024].map((width) =>
        Math.min(width, metadata.width),
      ),
    ),
  ];
  const variants = {};
  for (const width of widths) {
    const name = `${basename(item.name, extname(item.name))}-${digest}-${width}.webp`;
    await sharp(bytes)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${OUTPUT_DIRECTORY}/${name}`);
    await sharp(bytes)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 4 })
      .toFile(`${OUTPUT_DIRECTORY}/${name.replace(/\.webp$/, ".avif")}`);
    variants[width] = `/images/generated/${name}`;
  }
  // The key is the stable name used in src/content/site.ts, not a served URL.
  manifest[`/images/${item.name}`] = variants;
}
await writeFile(
  "src/content/static-images.json",
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  `Prepared static AVIF/WebP variants for ${Object.keys(manifest).length} images.`,
);
