import { z } from 'zod'

// Admite "correo@dominio.com" o "Nombre <correo@dominio.com>"; nunca saltos de línea.
const SENDER_PATTERN = /^(?:[^<>\r\n"]{1,80}\s)?<?[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+>?$/

export type ContactConfig = {
  deliveryMode: 'resend' | 'dry-run'
  toEmail: string | undefined
  fromEmail: string | undefined
  resendApiKey: string | undefined
  turnstileSecret: string | undefined
  rateLimit: { max: number; globalMax: number; windowMs: number }
  trustedProxyHops: number
  /** Nombres (nunca valores) de las variables ausentes o no válidas que impiden el envío. */
  missing: string[]
}

type Env = Record<string, string | undefined>

export function loadContactConfig(env: Env = process.env): ContactConfig {
  const invalid = new Set<string>()

  // Cada variable se valida por separado: una errónea no descarta el resto.
  // Una variable vacía (`CLAVE=`) equivale a no definirla.
  function read<T, F>(name: string, schema: z.ZodType<T>, fallback: F): T | F {
    const raw = env[name]?.trim()
    if (!raw) return fallback
    const result = schema.safeParse(raw)
    if (result.success) return result.data
    invalid.add(name)
    return fallback
  }

  const deliveryMode = read(
    'CONTACT_DELIVERY_MODE',
    z.enum(['resend', 'dry-run']),
    'resend' as const,
  )
  const toEmail = read('CONTACT_TO_EMAIL', z.email(), undefined)
  const fromEmail = read('CONTACT_FROM_EMAIL', z.string().regex(SENDER_PATTERN), undefined)
  const resendApiKey = read('RESEND_API_KEY', z.string(), undefined)
  const turnstileSecret = read('TURNSTILE_SECRET_KEY', z.string(), undefined)
  const rateLimitMax = read('CONTACT_RATE_LIMIT_MAX', z.coerce.number().int().min(1).max(10_000), 5)
  const rateLimitGlobalMax = read(
    'CONTACT_GLOBAL_RATE_LIMIT_MAX',
    z.coerce.number().int().min(1).max(100_000),
    50,
  )
  const rateLimitWindowSeconds = read(
    'CONTACT_RATE_LIMIT_WINDOW_SECONDS',
    z.coerce.number().int().min(10).max(86_400),
    600,
  )
  const trustedProxyHops = read('TRUSTED_PROXY_HOPS', z.coerce.number().int().min(0).max(5), 1)

  const missing = [...invalid].map((name) => `${name} (valor no válido)`)

  if (deliveryMode === 'resend') {
    const required: [string, string | undefined][] = [
      ['CONTACT_TO_EMAIL', toEmail],
      ['CONTACT_FROM_EMAIL', fromEmail],
      ['RESEND_API_KEY', resendApiKey],
      ['TURNSTILE_SECRET_KEY', turnstileSecret],
    ]
    for (const [name, value] of required) {
      if (!value && !invalid.has(name)) missing.push(name)
    }
  }

  return {
    deliveryMode,
    toEmail,
    fromEmail,
    resendApiKey,
    turnstileSecret,
    rateLimit: {
      max: rateLimitMax,
      globalMax: rateLimitGlobalMax,
      windowMs: rateLimitWindowSeconds * 1000,
    },
    trustedProxyHops,
    missing,
  }
}
