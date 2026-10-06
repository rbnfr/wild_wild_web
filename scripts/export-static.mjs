import { createHash } from "node:crypto";
import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  copyFile,
} from "node:fs/promises";
import { join } from "node:path";

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
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");
await writeFile(
  "out/.htaccess",
  `# Generated with this export. Upload it together with the HTML.
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html
<Files "opengraph-image">
ForceType image/png
</Files>
<IfModule mod_mime.c>
AddType image/avif .avif
AddType image/webp .webp
</IfModule>
<IfModule mod_headers.c>
Header always set Content-Security-Policy "${csp}"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
Header always set Strict-Transport-Security "max-age=31536000" "expr=%{HTTPS} == 'on'"
<FilesMatch "\\.html$">
Header set Cache-Control "no-cache"
</FilesMatch>
</IfModule>
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css "access plus 1 month"
ExpiresByType application/javascript "access plus 1 month"
ExpiresByType font/woff2 "access plus 1 year"
ExpiresByType image/avif "access plus 1 year"
ExpiresByType image/webp "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 hour"
ExpiresByType image/png "access plus 1 hour"
ExpiresByType image/svg+xml "access plus 1 hour"
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
`,
);
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
