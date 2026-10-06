import { describe, expect, it } from "vitest";
import { siteUrl, safeJsonLd } from "@/lib/seo";
describe("SEO seguro", () => {
  it("acepta orígenes http y https", () => {
    expect(siteUrl("https://example.org")?.href).toBe("https://example.org/");
    expect(siteUrl("http://localhost:3000")?.hostname).toBe("localhost");
  });
  it.each([
    "malformada",
    "javascript:alert(1)",
    "https://user:pass@example.org",
    "https://example.org/path",
    "https://example.org?secret=yes",
    "https://example.org#section",
  ])("rechaza %s", (value) => {
    expect(siteUrl(value)).toBeUndefined();
  });
  it("escapa cierres de script sin alterar datos", () => {
    const data = { text: "</script><script>alert(1)</script>" };
    expect(safeJsonLd(data)).not.toContain("<");
    expect(JSON.parse(safeJsonLd(data))).toEqual(data);
  });
});
