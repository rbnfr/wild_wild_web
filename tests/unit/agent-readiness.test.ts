import { afterEach, describe, expect, it, vi } from "vitest";
import { site } from "@/content/site";
import { llmsTxt } from "@/lib/llms";
import { sitePages, structuredData } from "@/lib/seo";

const url = new URL("https://example.org/");

describe("llms.txt", () => {
  const text = llmsTxt(url);

  it("follows the llms.txt layout", () => {
    expect(text).toMatch(/^# Mary Granero\n\n> \S/);
    expect(text.endsWith("\n")).toBe(true);
  });

  it("links every profile, press item and public page", () => {
    for (const { url: link } of [...site.socials, ...site.press])
      expect(text).toContain(`](${link})`);
    for (const page of sitePages.slice(1))
      expect(text).toContain(`](${new URL(page.path, url).href})`);
  });
});

describe("structured data", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("describes the service and links it to Mary", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", url.origin);
    const graph = structuredData()["@graph"] as Record<string, unknown>[];
    const person = graph.find((node) => node["@type"] === "Person")!;
    const service = graph.find(
      (node) => node["@type"] === "ProfessionalService",
    )!;
    expect(service.founder).toEqual({ "@id": person["@id"] });
    expect(service.email).toBe(site.contact.email);
  });
});
