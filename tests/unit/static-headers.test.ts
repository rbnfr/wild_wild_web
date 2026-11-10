import { describe, expect, it } from "vitest";
import {
  buildCsp,
  buildHtaccess,
  cacheControl,
  HTML_LINK_HEADER,
  LEGACY_REDIRECTS,
  legacyRedirect,
  securityHeaders,
} from "../../scripts/static-headers.mjs";

describe("static headers", () => {
  const csp = buildCsp(new Set(["'sha256-b'", "'sha256-a'"]));

  it("builds a strict, deterministic CSP from script hashes", () => {
    expect(csp).toContain("script-src 'self' 'sha256-a' 'sha256-b'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("worker-src 'none'");
    expect(csp).toContain("img-src 'self' data:;");
    expect(csp).not.toMatch(/unsafe-(?:eval)|script-src[^;]*unsafe-inline/);
  });

  it("caches only hash-named assets as immutable", () => {
    expect(cacheControl("/_next/static/chunks/abc123.js")).toContain(
      "immutable",
    );
    expect(cacheControl("/images/generated/cover-0123456789ab-240.avif")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(cacheControl("/")).toBe("no-cache");
    expect(cacheControl("/index.html")).toBe("no-cache");
    expect(cacheControl("/images/portrait_01.jpg")).toBe("no-cache");
  });

  it("writes every security header into .htaccess", () => {
    const htaccess = buildHtaccess(csp);
    for (const [name, value] of Object.entries(securityHeaders(csp)))
      expect(htaccess).toContain(`Header always set ${name} "${value}"`);
    expect(htaccess).toContain("Options -Indexes");
    expect(htaccess).toContain("RedirectMatch 404 ^/\\.(?!well-known/)");
    expect(htaccess).toContain("expr=%{HTTPS} == 'on'");
    expect(htaccess).toContain(`Header set Link "${HTML_LINK_HEADER}"`);
  });

  it("moves pre-language URLs permanently to their Spanish page", () => {
    expect(legacyRedirect("/aviso-legal")).toBe("/es/aviso-legal/");
    expect(legacyRedirect("/privacidad/")).toBe("/es/privacidad/");
    expect(legacyRedirect("/es/cookies/")).toBeUndefined();
    expect(legacyRedirect("/")).toBeUndefined();
    const htaccess = buildHtaccess(csp);
    for (const [from, to] of Object.entries(LEGACY_REDIRECTS))
      expect(htaccess).toContain(
        `RedirectMatch 301 ^${from.slice(0, -1)}/?$ ${to}`,
      );
  });
});
