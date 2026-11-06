import { site } from "@/content/site";
import { legalPages } from "@/content/legal";

type LegalSlug = keyof typeof legalPages;

// Every public page, with the source files whose commits date its content.
export const sitePages = [
  {
    path: "/",
    title: site.name,
    sources: ["src/app/page.tsx", "src/components", "src/content/site.ts"],
  },
  ...(Object.keys(legalPages) as LegalSlug[]).map((slug) => ({
    path: `/${slug}/`,
    title: legalPages[slug].title,
    sources: [
      `src/app/${slug}`,
      "src/components/legal-page.tsx",
      "src/content/legal.ts",
    ],
  })),
];

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

export function structuredData() {
  const url = siteUrl();
  const personId = url && `${url.href}#persona`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        ...(personId ? { "@id": personId } : {}),
        name: site.name,
        alternateName: site.fullName,
        jobTitle: site.profession,
        ...(url ? { image: new URL(site.hero.image, url).href } : {}),
        ...(url ? { url: url.href } : {}),
        ...(site.socials.length
          ? { sameAs: site.socials.map((social) => social.url) }
          : {}),
      },
      ...(url
        ? [
            {
              "@type": "WebSite",
              name: site.name,
              url: url.href,
              inLanguage: "es",
            },
            {
              "@type": "ProfessionalService",
              "@id": `${url.href}#servicios`,
              name: site.name,
              description: site.hero.description,
              url: url.href,
              image: new URL(site.hero.image, url).href,
              email: site.contact.email,
              founder: { "@id": personId },
              knowsLanguage: "es",
              areaServed: site.services.areaServed.map((area) => ({
                "@type": area.type,
                name: area.name,
              })),
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: site.services.title.replace(/\.$/, ""),
                itemListElement: site.services.items.map((service) => ({
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
        datePublished: book.datePublished ?? String(book.year),
        description: book.description,
        inLanguage: "es",
        ...(book.pages ? { numberOfPages: book.pages } : {}),
        ...(url ? { image: new URL(book.cover, url).href } : {}),
        publisher: { "@type": "Organization", name: book.publisher },
        ...(book.isbn ? { isbn: book.isbn } : {}),
      })),
    ],
  };
}
