import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content/dictionaries";
import { contactErrors } from "@/lib/contact/schema";
import { locales } from "@/i18n/config";
import { localeRedirectScript } from "@/i18n/detect";
import { alternates, href, routes, translatePath } from "@/i18n/routes";

// Runs the inline "/" script against a fake browser and returns its redirect.
function redirectFor({
  languages,
  stored = null,
  hash = "",
}: {
  languages: string[];
  stored?: string | null;
  hash?: string;
}) {
  let target = "";
  runInNewContext(localeRedirectScript, {
    navigator: { languages, language: languages[0] },
    localStorage: { getItem: () => stored },
    location: { search: "", hash, replace: (to: string) => (target = to) },
  });
  return target;
}

describe("browser language detection", () => {
  it("uses the first supported browser language", () => {
    expect(redirectFor({ languages: ["en-US", "es-ES"] })).toBe("/en/");
    expect(redirectFor({ languages: ["fr-FR", "es-MX", "en"] })).toBe("/es/");
    expect(redirectFor({ languages: ["EN-gb"] })).toBe("/en/");
  });

  it("falls back to Spanish when no browser language is supported", () => {
    expect(redirectFor({ languages: ["fr-FR", "de"] })).toBe("/es/");
    expect(redirectFor({ languages: [] })).toBe("/es/");
  });

  it("prefers a language chosen by hand and ignores unknown stored values", () => {
    expect(redirectFor({ languages: ["en-US"], stored: "es" })).toBe("/es/");
    expect(redirectFor({ languages: ["en-US"], stored: "xx" })).toBe("/en/");
  });

  it("keeps the section anchor of old links such as /#contacto", () => {
    expect(redirectFor({ languages: ["es"], hash: "#contacto" })).toBe(
      "/es/#contacto",
    );
  });

  it("still redirects when storage is blocked", () => {
    let target = "";
    runInNewContext(localeRedirectScript, {
      navigator: { languages: ["en"] },
      get localStorage() {
        throw new Error("SecurityError");
      },
      location: {
        search: "",
        hash: "",
        replace: (to: string) => (target = to),
      },
    });
    expect(target).toBe("/en/");
  });
});

describe("localized routes", () => {
  it("builds prefixed URLs with translated slugs", () => {
    expect(href("es")).toBe("/es/");
    expect(href("en", "home", "#contacto")).toBe("/en/#contacto");
    expect(href("es", "legalNotice")).toBe("/es/aviso-legal/");
    expect(href("en", "legalNotice")).toBe("/en/legal-notice/");
  });

  it("switches to the same page in the other language", () => {
    expect(translatePath("/es/privacidad/", "en")).toBe("/en/privacy/");
    expect(translatePath("/en/legal-notice", "es")).toBe("/es/aviso-legal/");
    expect(translatePath("/en/", "es")).toBe("/es/");
    expect(translatePath("/es/desconocida/", "en")).toBe("/en/");
  });

  it("declares every translation and an x-default", () => {
    expect(alternates("home", "en")).toEqual({
      canonical: "/en/",
      languages: { es: "/es/", en: "/en/", "x-default": "/" },
    });
    expect(alternates("privacy", "en").languages["x-default"]).toBe(
      "/es/privacidad/",
    );
  });

  it("gives every page a distinct slug within each language", () => {
    for (const lang of locales) {
      const slugs = Object.values(routes).map((slugs) => slugs[lang]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("dictionaries", () => {
  // Every text path of a dictionary, so a missing translation fails the test.
  const shape = (value: unknown, path = ""): string[] =>
    value && typeof value === "object"
      ? Object.entries(value).flatMap(([key, child]) =>
          shape(child, `${path}.${Array.isArray(value) ? "[]" : key}`),
        )
      : [`${path}:${typeof value}`];

  it("translate the same texts in every language", () => {
    const [source, ...others] = locales.map((lang) =>
      [...new Set(shape(getDictionary(lang)))].sort(),
    );
    for (const other of others) expect(other).toEqual(source);
  });

  it("translate every contact validation message", () => {
    for (const lang of locales)
      for (const key of contactErrors)
        expect(getDictionary(lang).contact.form.errors[key]).toMatch(/\S/);
  });

  it("have no empty texts", () => {
    for (const lang of locales)
      expect(
        shape(getDictionary(lang)).filter((p) => p.endsWith(":undefined")),
      ).toEqual([]);
  });
});
