import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { zipSync, unzipSync } from "fflate";

const entries = {};
async function collect(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) await collect(path);
    else if (item.isFile())
      entries[relative("out", path).replaceAll("\\", "/")] = new Uint8Array(
        await readFile(path),
      );
    else throw new Error(`Unexpected entry: ${path}`);
  }
}
await collect("out");
for (const required of [
  "index.html",
  ".htaccess",
  "404.html",
  "privacidad/index.html",
  "aviso-legal/index.html",
  "cookies/index.html",
  "robots.txt",
  "sitemap.xml",
]) {
  if (!entries[required])
    throw new Error(`Missing deployment file: ${required}`);
}
if (
  Object.keys(entries).some((path) =>
    /(^|\/)(?:\.env[^/]*|\.git|node_modules|src|CVs|api)(?:\/|$)/i.test(path),
  )
)
  throw new Error("Source or private files in deployment.");
const zipped = zipSync(entries, { level: 9 });
const unpacked = unzipSync(zipped);
if (
  Object.keys(unpacked).length !== Object.keys(entries).length ||
  !unpacked[".htaccess"] ||
  Object.entries(entries).some(
    ([name, bytes]) =>
      !Buffer.from(bytes).equals(Buffer.from(unpacked[name] || [])),
  )
)
  throw new Error("ZIP verification failed.");
await mkdir("releases", { recursive: true });
await writeFile("releases/mary-granero-static.zip", zipped);
console.log(
  `ZIP verified: releases/mary-granero-static.zip (${(zipped.length / 1024 / 1024).toFixed(2)} MB, ${Object.keys(entries).length} files).`,
);
