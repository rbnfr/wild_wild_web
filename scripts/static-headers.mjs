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

export function buildCsp(scriptHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${[...scriptHashes].sort().join(" ")}`,
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
<IfModule mod_mime.c>
AddType image/avif .avif
AddType image/webp .webp
AddType font/woff2 .woff2
</IfModule>
<IfModule mod_headers.c>
${headers}
Header always set Strict-Transport-Security "max-age=${ONE_YEAR}" "expr=%{HTTPS} == 'on'"
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
