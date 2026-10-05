import type { ContactConfig } from '@/lib/config/contact-config'
import { deliverContactMessage } from '@/lib/email/deliver'
import { getClientIp } from '@/lib/security/client-ip'
import type { RateLimiter } from '@/lib/security/rate-limit'
import { readLimitedJson } from '@/lib/security/request-body'
import { verifyTurnstile } from '@/lib/security/turnstile'
import {
  MIN_FILL_TIME_MS,
  contactRequestSchema,
  getFieldErrors,
  type FieldErrors,
} from '@/lib/validation/contact'

import type { ContactApiResponse, ContactFailureCode } from './types'

/** Un mensaje legítimo ocupa muy poco; 16 KB deja margen para tildes y emojis. */
export const MAX_BODY_BYTES = 16 * 1024

const FAILURES: Record<ContactFailureCode, { status: number; message: string }> = {
  bad_request: {
    status: 400,
    message: 'No hemos podido procesar el envío. Recarga la página e inténtalo de nuevo.',
  },
  payload_too_large: { status: 413, message: 'El mensaje es demasiado largo.' },
  validation: { status: 422, message: 'Revisa los campos marcados e inténtalo de nuevo.' },
  too_fast: {
    status: 429,
    message:
      'Has enviado el formulario demasiado rápido. Espera unos segundos e inténtalo de nuevo.',
  },
  captcha: {
    status: 400,
    message: 'No hemos podido verificar que eres una persona. Vuelve a intentarlo.',
  },
  rate_limited: {
    status: 429,
    message: 'Has enviado demasiados mensajes seguidos. Inténtalo de nuevo más tarde.',
  },
  unavailable: {
    status: 503,
    message:
      'No hemos podido enviar tu mensaje en este momento. Inténtalo de nuevo en unos minutos.',
  },
}

const SUCCESS_MESSAGE = 'Mensaje enviado. Gracias por escribir.'

export type ContactHandlerDeps = {
  config: ContactConfig
  /** Límite por IP. */
  rateLimiter: RateLimiter
  /** Tope global de envíos reales: acota el correo recibido aunque falsifiquen la IP. */
  globalLimiter: RateLimiter
  verify?: typeof verifyTurnstile
  deliver?: typeof deliverContactMessage
}

function respond(body: ContactApiResponse, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

function fail(
  code: ContactFailureCode,
  extra: { fieldErrors?: FieldErrors; headers?: Record<string, string> } = {},
) {
  const { status, message } = FAILURES[code]
  return respond(
    { ok: false, code, message, fieldErrors: extra.fieldErrors },
    status,
    extra.headers,
  )
}

export async function handleContactRequest(
  request: Request,
  {
    config,
    rateLimiter,
    globalLimiter,
    verify = verifyTurnstile,
    deliver = deliverContactMessage,
  }: ContactHandlerDeps,
): Promise<Response> {
  if (config.missing.length > 0) {
    console.error('[contact] configuración incompleta o no válida', { variables: config.missing })
    return fail('unavailable')
  }

  const ip = getClientIp(request.headers, config.trustedProxyHops)
  const limit = rateLimiter.check(ip)
  if (!limit.allowed) {
    return fail('rate_limited', { headers: { 'Retry-After': String(limit.retryAfterSeconds) } })
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) return fail('bad_request')

  const body = await readLimitedJson(request, MAX_BODY_BYTES)
  if (!body.ok) return fail(body.reason === 'too_large' ? 'payload_too_large' : 'bad_request')

  const parsed = contactRequestSchema.safeParse(body.data)
  if (!parsed.success) return fail('validation', { fieldErrors: getFieldErrors(parsed.error) })

  const { website, turnstileToken, elapsedMs, name, email, organization, phone, reason, message } =
    parsed.data

  // Los bots que rellenan el honeypot reciben un éxito falso para no darles pistas.
  if (website) {
    console.info('[contact] honeypot activado')
    return respond({ ok: true, message: SUCCESS_MESSAGE }, 200)
  }

  if (elapsedMs < MIN_FILL_TIME_MS) return fail('too_fast')

  if (config.turnstileSecret) {
    const result = await verify({ secret: config.turnstileSecret, token: turnstileToken, ip })
    if (!result.ok) {
      if (result.reason === 'unreachable') {
        console.error('[contact] no se pudo consultar a Turnstile')
        return fail('unavailable')
      }
      return fail('captcha')
    }
  }

  // Último filtro antes de enviar: solo cuentan los mensajes que han superado todo lo anterior.
  const globalLimit = globalLimiter.check('global')
  if (!globalLimit.allowed) {
    console.warn('[contact] tope global de envíos alcanzado')
    return fail('rate_limited', {
      headers: { 'Retry-After': String(globalLimit.retryAfterSeconds) },
    })
  }

  try {
    await deliver(config, { name, email, organization, phone, reason, message })
  } catch (error) {
    const status = error instanceof Error && 'status' in error ? error.status : undefined
    console.error('[contact] error al entregar el mensaje', { status })
    return fail('unavailable')
  }

  return respond({ ok: true, message: SUCCESS_MESSAGE }, 200)
}
