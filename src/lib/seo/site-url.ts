const FALLBACK_SITE_URL = 'http://localhost:3000'

function parseSiteUrl(raw: string | undefined): URL | undefined {
  if (!raw) return undefined
  try {
    const url = new URL(raw.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : undefined
  } catch {
    return undefined
  }
}

/**
 * URL pública del sitio, sin barra final. Se lee de NEXT_PUBLIC_SITE_URL, que Next.js
 * sustituye en tiempo de compilación; por eso hay que volver a desplegar si cambia.
 */
export function resolveSiteUrl(raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  return parseSiteUrl(raw)?.origin ?? FALLBACK_SITE_URL
}

export function absoluteUrl(path: string, siteUrl: string = resolveSiteUrl()): string {
  return new URL(path, `${siteUrl}/`).toString()
}

export function isHttps(siteUrl: string): boolean {
  return siteUrl.startsWith('https://')
}

/**
 * Indexación apagada por defecto: evita publicar contenido provisional en buscadores.
 * Además exige una URL pública explícita; sin ella los canonical y el sitemap apuntarían
 * a localhost, así que se mantiene bloqueada aunque ALLOW_INDEXING sea "true".
 */
export function isIndexingAllowed(
  allow: string | undefined = process.env.ALLOW_INDEXING,
  siteUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): boolean {
  return allow?.trim().toLowerCase() === 'true' && parseSiteUrl(siteUrl) !== undefined
}
