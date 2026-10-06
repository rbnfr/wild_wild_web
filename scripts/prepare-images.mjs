import sharp from "sharp";
import { createHash } from "node:crypto";
import { readdir, readFile, mkdir, writeFile, unlink } from "node:fs/promises";
import { basename, extname } from "node:path";

const manifest = {};
await mkdir("public/images/generated", { recursive: true });
// Remove only variants owned by this generator; never remove source photographs.
for (const item of await readdir("public/images/generated", {
  withFileTypes: true,
})) {
  if (item.isFile() && /-[a-f0-9]{12}-\d+\.(?:webp|avif)$/.test(item.name))
    await unlink(`public/images/generated/${item.name}`);
}
for (const item of await readdir("public/images", { withFileTypes: true })) {
  if (!item.isFile() || !/\.(?:jpe?g|png|webp|avif)$/i.test(item.name))
    continue;
  const bytes = await readFile(`public/images/${item.name}`);
  const metadata = await sharp(bytes).metadata();
  if (!metadata.width)
    throw new Error(`Missing image dimensions: ${item.name}`);
  const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const widths = [
    ...new Set(
      [160, 240, 320, 480, 640, 704, 854].map((width) =>
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
      .toFile(`public/images/generated/${name}`);
    await sharp(bytes)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 4 })
      .toFile(`public/images/generated/${name.replace(/\.webp$/, ".avif")}`);
    variants[width] = `/images/generated/${name}`;
  }
  manifest[`/images/${item.name}`] = variants;
}
await writeFile(
  "src/content/static-images.json",
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  `Prepared static AVIF/WebP variants for ${Object.keys(manifest).length} images.`,
);
