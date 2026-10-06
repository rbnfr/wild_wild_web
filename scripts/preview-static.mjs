import { gzipSync } from "node:zlib";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("out");
const htaccess = await readFile(resolve(root, ".htaccess"), "utf8");
const csp = htaccess.match(
  /Header always set Content-Security-Policy "([^"\n]+)"/,
)?.[1];
if (!csp) throw new Error("Build the static export first: npm run build");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
  response.setHeader("Content-Security-Policy", csp);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(`${root}${sep}`)) {
      response.writeHead(403);
      response.end();
      return;
    }
    if (pathname.split("/").some((part) => part.startsWith(".")))
      throw new Error("Hidden path");
    const info = await stat(path);
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, {
          Location: `${pathname}/${new URL(request.url, "http://localhost").search}`,
        });
        response.end();
        return;
      }
      path = resolve(path, "index.html");
    }
    let bytes = await readFile(path);
    const contentType =
      pathname === "/opengraph-image"
        ? "image/png"
        : mime[extname(path)] || "application/octet-stream";
    if (
      /^(?:text\/|application\/(?:javascript|json)|image\/svg)/.test(
        contentType,
      )
    ) {
      response.setHeader("Vary", "Accept-Encoding");
      if (request.headers["accept-encoding"]?.includes("gzip")) {
        bytes = gzipSync(bytes);
        response.setHeader("Content-Encoding", "gzip");
      }
    }
    response.setHeader("Content-Type", contentType);
    response.setHeader(
      "Cache-Control",
      pathname.startsWith("/_next/static/")
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    );
    response.setHeader("Content-Length", bytes.length);
    response.writeHead(200);
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(
      request.method === "HEAD"
        ? undefined
        : await readFile(resolve(root, "404.html")),
    );
  }
});
server.listen(
  Number(process.env.PORT || 3000),
  process.env.PREVIEW_HOST || "127.0.0.1",
  () =>
    console.log(
      `Static preview: http://${process.env.PREVIEW_HOST || "127.0.0.1"}:${process.env.PORT || 3000}`,
    ),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
