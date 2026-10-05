import { handleContactRequest } from '@/lib/contact/handle-contact'
import { loadContactConfig } from '@/lib/config/contact-config'
import { createRateLimiter } from '@/lib/security/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// La configuración y los limitadores viven mientras viva el proceso de Node.
const config = loadContactConfig()
const rateLimiter = createRateLimiter({
  limit: config.rateLimit.max,
  windowMs: config.rateLimit.windowMs,
})
const globalLimiter = createRateLimiter({
  limit: config.rateLimit.globalMax,
  windowMs: config.rateLimit.windowMs,
})

// Solo se exporta POST: Next.js responde 405 con la cabecera Allow a cualquier otro método.
export function POST(request: Request) {
  return handleContactRequest(request, { config, rateLimiter, globalLimiter })
}
