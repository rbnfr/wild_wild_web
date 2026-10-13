import { createHash } from "node:crypto";
import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  copyFile,
} from "node:fs/promises";
import { join } from "node:path";
import { buildCsp, buildHtaccess } from "./static-headers.mjs";

export async function filesUnder(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) files.push(...(await filesUnder(path)));
    else if (item.isFile()) files.push(path);
    else throw new Error(`Unexpected filesystem entry: ${path}`);
  }
  return files;
}

const hashes = new Set();
const files = await filesUnder("out");
for (const path of files.filter((path) => path.endsWith(".html"))) {
  const html = await readFile(path, "utf8");
  if (
    /\/_next\/image[?]|https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?[\/"<]/.test(
      html,
    )
  ) {
    throw new Error(`Server dependency or local URL in exported HTML: ${path}`);
  }
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (script[1])
      hashes.add(
        `'sha256-${createHash("sha256").update(script[1]).digest("base64")}'`,
      );
  }
}
await writeFile("out/.htaccess", buildHtaccess(buildCsp(hashes)));
await mkdir("out/licenses", { recursive: true });
for (const name of ["OFL-DM-Sans.txt", "OFL-Newsreader.txt"])
  await copyFile(`src/assets/fonts/${name}`, `out/licenses/${name}`);
await copyFile("LICENSE", "out/licenses/MIT.txt");
for (const [source, name] of [
  ["node_modules/next/license.md", "Next-MIT.txt"],
  ["node_modules/react/LICENSE", "React-MIT.txt"],
  ["node_modules/react-dom/LICENSE", "React-DOM-MIT.txt"],
  ["node_modules/zod/LICENSE", "Zod-MIT.txt"],
])
  await copyFile(source, `out/licenses/${name}`);
console.log(
  `Static export ready: ${files.length} files, ${hashes.size} CSP script hashes.`,
);
