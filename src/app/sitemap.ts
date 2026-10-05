import type { MetadataRoute } from 'next'

import { absoluteUrl, isIndexingAllowed, resolveSiteUrl } from '@/lib/seo/site-url'

export const dynamic = 'force-dynamic'

const pages = [
  { path: '/', priority: 1 },
  { path: '/aviso-legal', priority: 0.3 },
  { path: '/privacidad', priority: 0.3 },
  { path: '/cookies', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Mientras la indexación esté apagada, no se anuncia ninguna URL a los buscadores.
  if (!isIndexingAllowed()) return []

  const siteUrl = resolveSiteUrl()
  return pages.map(({ path, priority }) => ({
    url: absoluteUrl(path, siteUrl),
    priority,
  }))
}
