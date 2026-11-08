import { defaultLocale, hasLocale, locales, type Locale } from "./config";

// Every public page and its slug in each language ("" is the home page).
export const routes = {
  home: { es: "", en: "" },
  legalNotice: { es: "aviso-legal", en: "legal-notice" },
  privacy: { es: "privacidad", en: "privacy" },
  cookies: { es: "cookies", en: "cookies" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageId = keyof typeof routes;
export type LegalPageId = Exclude<PageId, "home">;
export const pageIds = Object.keys(routes) as PageId[];
export const legalPageIds = pageIds.filter(
  (id): id is LegalPageId => id !== "home",
);

export function href(lang: Locale, page: PageId = "home", hash = ""): string {
  const slug = routes[page][lang];
  return `/${lang}/${slug ? `${slug}/` : ""}${hash}`;
}

export const pageFromSlug = (lang: Locale, slug: string) =>
  pageIds.find((id) => routes[id][lang] === slug);

// The same page in another language, so the switcher keeps the reader in place.
export function translatePath(pathname: string, target: Locale): string {
  const [lang = "", slug = ""] = pathname.split("/").filter(Boolean);
  const page = hasLocale(lang) ? pageFromSlug(lang, slug) : undefined;
  return href(target, page);
}

// hreflang alternates. The home page's x-default is the language detector at "/".
export function alternates(page: PageId, lang: Locale) {
  return {
    canonical: href(lang, page),
    languages: {
      ...Object.fromEntries(locales.map((code) => [code, href(code, page)])),
      "x-default": page === "home" ? "/" : href(defaultLocale, page),
    },
  };
}
