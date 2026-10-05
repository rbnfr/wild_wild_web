import type { Book } from '@/content/types'

import { absoluteUrl } from './site-url'

type JsonLdNode = Record<string, unknown>

export type HomeJsonLdInput = {
  siteUrl: string
  name: string
  jobTitle: string
  locale: string
  /** Solo perfiles oficiales reales. */
  sameAs: string[]
  books: Book[]
}

const personId = (siteUrl: string) => `${siteUrl}/#person`

/** Serializa JSON-LD de forma segura para incrustarlo en un <script>. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function buildBookJsonLd(book: Book, input: Pick<HomeJsonLdInput, 'siteUrl'>): JsonLdNode {
  return {
    '@type': 'Book',
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    author: { '@id': personId(input.siteUrl) },
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.publisher ? { publisher: { '@type': 'Organization', name: book.publisher } } : {}),
    ...(book.year ? { datePublished: String(book.year) } : {}),
    ...(book.cover.src ? { image: absoluteUrl(book.cover.src, input.siteUrl) } : {}),
    description: book.description,
    inLanguage: 'es',
  }
}

/** Persona, sitio web y libros confirmados. Los libros de muestra se excluyen. */
export function buildHomeJsonLd({
  siteUrl,
  name,
  jobTitle,
  locale,
  sameAs,
  books,
}: HomeJsonLdInput): JsonLdNode {
  const confirmedBooks = books.filter((book) => !book.placeholder)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId(siteUrl),
        name,
        jobTitle,
        url: siteUrl,
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name,
        inLanguage: locale,
        publisher: { '@id': personId(siteUrl) },
      },
      ...confirmedBooks.map((book) => buildBookJsonLd(book, { siteUrl })),
    ],
  }
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
  siteUrl: string,
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  }
}
