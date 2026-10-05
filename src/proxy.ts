import { NextResponse, type NextRequest } from 'next/server'

import { buildCsp, generateNonce } from '@/lib/security/csp'
import { isHttps, resolveSiteUrl } from '@/lib/seo/site-url'

/**
 * Genera un nonce por petición y aplica la Content-Security-Policy.
 * Next.js lee el nonce de la cabecera de la petición y lo añade a sus propios scripts.
 */
export function proxy(request: NextRequest) {
  const nonce = generateNonce()
  const csp = buildCsp({
    nonce,
    isDevelopment: process.env.NODE_ENV === 'development',
    upgradeInsecureRequests: process.env.NODE_ENV === 'production' && isHttps(resolveSiteUrl()),
  })

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      // Se excluyen los recursos estáticos y las precargas de next/link, que no necesitan nonce.
      source:
        '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|opengraph-image|twitter-image|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
