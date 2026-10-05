import type { Metadata } from 'next'

import { identity, seo } from '@/content/site'

import { isIndexingAllowed, resolveSiteUrl } from './site-url'

/** Metadatos globales. Cada página añade su título y su canonical. */
export function buildRootMetadata(): Metadata {
  const indexable = isIndexingAllowed()

  return {
    metadataBase: new URL(resolveSiteUrl()),
    title: { default: seo.titleDefault, template: seo.titleTemplate },
    description: seo.description,
    applicationName: identity.name,
    authors: [{ name: identity.name }],
    alternates: { canonical: '/' },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: identity.name,
      title: seo.titleDefault,
      description: seo.description,
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.titleDefault,
      description: seo.description,
    },
  }
}

type PageMetadataInput = { title: string; description: string; path: string }

/** Metadatos de una página interior: título, descripción y canonical propios. */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: identity.name,
      title: `${title} | ${identity.name}`,
      description,
      url: path,
    },
    twitter: { card: 'summary_large_image', title: `${title} | ${identity.name}`, description },
  }
}
