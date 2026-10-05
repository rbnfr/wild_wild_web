import { site } from "@/content/site";

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
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.name,
        jobTitle: site.profession,
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
          ]
        : []),
      ...site.books.map((book) => ({
        "@type": "Book",
        name: book.title,
        author: { "@type": "Person", name: site.name },
        datePublished: String(book.year),
        publisher: { "@type": "Organization", name: book.publisher },
        ...(book.isbn ? { isbn: book.isbn } : {}),
      })),
    ],
  };
}
