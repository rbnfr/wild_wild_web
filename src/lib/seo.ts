import { site } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { href, pageIds, type PageId } from "@/i18n/routes";

// Source files whose commits date each page's content.
const pageSources: Record<"home" | "legal", string[]> = {
  home: [
    "src/app/[lang]/page.tsx",
    "src/components",
    "src/content/site.ts",
    "src/content/dictionaries",
  ],
  legal: [
    "src/app/[lang]/[slug]",
    "src/components/legal-page.tsx",
    "src/content/legal",
  ],
};

// Every public page in every language.
export const sitePages = locales.flatMap((lang) =>
  pageIds.map((page: PageId) => ({
    page,
    lang,
    path: href(lang, page),
    title: page === "home" ? site.name : getDictionary(lang).legal[page].title,
    sources: pageSources[page === "home" ? "home" : "legal"],
  })),
);

export function siteUrl(
  value = process.env.NEXT_PUBLIC_SITE_URL,
): URL | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function structuredData(lang: Locale) {
  const t = getDictionary(lang);
  const url = siteUrl();
  const home = url && new URL(href(lang), url).href;
  const personId = url && `${url.href}#persona`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        ...(personId ? { "@id": personId } : {}),
        name: site.name,
        alternateName: site.fullName,
        jobTitle: t.seo.profession,
        ...(url ? { image: new URL(site.heroImage, url).href } : {}),
        ...(url ? { url: url.href } : {}),
        sameAs: site.socials.map((social) => social.url),
      },
      ...(url && home
        ? [
            {
              "@type": "WebSite",
              name: site.name,
              url: home,
              inLanguage: lang,
            },
            {
              "@type": "ProfessionalService",
              "@id": `${url.href}#servicios`,
              name: site.name,
              description: t.hero.description,
              url: home,
              image: new URL(site.heroImage, url).href,
              email: site.contactEmail,
              founder: { "@id": personId },
              knowsLanguage: "es",
              areaServed: site.areaServed.map((area) => ({
                "@type": area.type,
                name: area.name,
              })),
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: t.services.title.replace(/\.$/, ""),
                itemListElement: t.services.items.map((service) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: service.title,
                    description: service.description,
                  },
                })),
              },
            },
          ]
        : []),
      ...site.books.map((book) => ({
        "@type": "Book",
        name: book.title,
        author: { "@type": "Person", name: book.author },
        datePublished: book.datePublished,
        description: t.books[book.id],
        inLanguage: book.inLanguage,
        numberOfPages: book.pages,
        ...(url ? { image: new URL(book.cover, url).href } : {}),
        publisher: { "@type": "Organization", name: book.publisher },
        isbn: book.isbn,
      })),
    ],
  };
}
