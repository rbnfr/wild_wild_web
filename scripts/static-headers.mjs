// Single source of truth for the HTTP behaviour of the static site.
// The export writes it into .htaccess (Hostinger) and the local preview
// server applies the same values, so both environments cannot drift apart.

export const ONE_YEAR = 31_536_000;

// Files whose URL changes when their content changes: Next.js chunks, fonts
// and the hash-named image variants. They can be cached "forever".
export const IMMUTABLE_PATTERN = /\.(?:js|css|woff2|avif|webp)$/;

export function isImmutable(pathname) {
  return (
    (pathname.startsWith("/_next/static/") ||
      pathname.startsWith("/images/generated/")) &&
    IMMUTABLE_PATTERN.test(pathname)
  );
}

// externalOrigins: HTTPS origins of the external scripts the pages load
// (the cookieless analytics). Each may run its file and send data back to itself.
export function buildCsp(scriptHashes, externalOrigins = []) {
  const origins = [...new Set(externalOrigins)].sort();
  for (const origin of origins)
    if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/.test(origin))
      throw new Error(`Unexpected external script origin: ${origin}`);
  const extra = origins.map((origin) => ` ${origin}`).join("");
  return [
    "default-src 'self'",
    `script-src 'self'${extra} ${[...scriptHashes].sort().join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${extra}`,
    "worker-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export function securityHeaders(csp) {
  return {
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    "Cross-Origin-Opener-Policy": "same-origin",
  };
}

// RFC 8288: every HTML page points agents at the site summary.
export const HTML_LINK_HEADER = "</llms.txt>; rel=describedby";

// URLs from before the site had languages, now under the Spanish prefix.
// Permanent (301) so search engines move the existing ranking to them.
export const LEGACY_REDIRECTS = {
  "/aviso-legal/": "/es/aviso-legal/",
  "/privacidad/": "/es/privacidad/",
  "/cookies/": "/es/cookies/",
};

export function legacyRedirect(pathname) {
  return LEGACY_REDIRECTS[pathname.endsWith("/") ? pathname : `${pathname}/`];
}

export function cacheControl(pathname) {
  if (isImmutable(pathname)) return `public, max-age=${ONE_YEAR}, immutable`;
  return "no-cache";
}

export function buildHtaccess(csp) {
  const headers = Object.entries(securityHeaders(csp))
    .map(([name, value]) => `Header always set ${name} "${value}"`)
    .join("\n");
  return `# Generated with this export. Upload it together with the HTML.
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html
AddDefaultCharset utf-8
<Files "opengraph-image">
ForceType image/png
</Files>
<IfModule mod_alias.c>
# Hidden files (.git from the Git deployment, .htaccess, .env) are never served.
RedirectMatch 404 ^/\\.(?!well-known/)
${Object.entries(LEGACY_REDIRECTS)
  .map(([from, to]) => `RedirectMatch 301 ^${from.slice(0, -1)}/?$ ${to}`)
  .join("\n")}
</IfModule>
<IfModule mod_mime.c>
AddType image/avif .avif
AddType image/webp .webp
AddType font/woff2 .woff2
</IfModule>
<IfModule mod_headers.c>
${headers}
Header always set Strict-Transport-Security "max-age=${ONE_YEAR}" "expr=%{HTTPS} == 'on'"
<FilesMatch "\\.html$">
Header set Link "${HTML_LINK_HEADER}"
</FilesMatch>
<FilesMatch "\\.(?:html|txt|xml)$">
Header set Cache-Control "no-cache"
</FilesMatch>
# Hash-named assets (Next.js chunks, fonts, generated image variants).
<FilesMatch "\\.(?:js|css|woff2|avif|webp)$">
Header set Cache-Control "public, max-age=${ONE_YEAR}, immutable"
</FilesMatch>
</IfModule>
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType text/javascript "access plus 1 year"
ExpiresByType font/woff2 "access plus 1 year"
ExpiresByType image/avif "access plus 1 year"
ExpiresByType image/webp "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 hour"
ExpiresByType image/png "access plus 1 hour"
ExpiresByType image/svg+xml "access plus 1 hour"
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/xml application/javascript text/javascript application/json image/svg+xml
</IfModule>
`;
}
