import type { MetadataRoute } from 'next'

import { isIndexingAllowed, resolveSiteUrl } from '@/lib/seo/site-url'

// Depende de variables de entorno de ejecución, así que no se genera en el build.
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${resolveSiteUrl()}/sitemap.xml`,
  }
}
