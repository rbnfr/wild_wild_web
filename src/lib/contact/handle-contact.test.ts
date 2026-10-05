import { describe, expect, it, vi } from 'vitest'

import type { ContactConfig } from '@/lib/config/contact-config'
import { createRateLimiter } from '@/lib/security/rate-limit'
import { MIN_FILL_TIME_MS } from '@/lib/validation/contact'

import { handleContactRequest, MAX_BODY_BYTES, type ContactHandlerDeps } from './handle-contact'
import type { ContactApiResponse } from './types'

const baseConfig: ContactConfig = {
  deliveryMode: 'resend',
  toEmail: 'mary@example.com',
  fromEmail: 'web@example.com',
  resendApiKey: 're_secret_key',
  turnstileSecret: 'turnstile_secret',
  rateLimit: { max: 3, globalMax: 100, windowMs: 60_000 },
  trustedProxyHops: 1,
  missing: [],
}

const validBody = {
  name: '  Ana   Pérez ',
  email: 'ANA@example.com',
  organization: '',
  phone: '',
  reason: 'charla-evento',
  message: 'Hola Mary, ¿podrías dar una charla en nuestro evento?',
  privacy: true,
  website: '',
  turnstileToken: 'token-ok',
  elapsedMs: MIN_FILL_TIME_MS + 500,
}

function makeRequest(body: unknown, init: { headers?: Record<string, string>; raw?: string } = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.9',
      ...init.headers,
    },
    body: init.raw ?? JSON.stringify(body),
  })
}

function setup(overrides: Partial<ContactHandlerDeps> = {}) {
  const deliver = vi.fn().mockResolvedValue(undefined)
  const verify = vi.fn().mockResolvedValue({ ok: true })
  const rateLimiter = createRateLimiter({ limit: 3, windowMs: 60_000 })
  const globalLimiter = createRateLimiter({ limit: 100, windowMs: 60_000 })
  const deps: ContactHandlerDeps = {
    config: baseConfig,
    rateLimiter,
    globalLimiter,
    deliver,
    verify,
    ...overrides,
  }
  const send = async (body: unknown, init?: Parameters<typeof makeRequest>[1]) => {
    const response = await handleContactRequest(makeRequest(body, init), deps)
    return { response, json: (await response.json()) as ContactApiResponse }
  }
  return { deliver, verify, send, deps }
}

describe('handleContactRequest', () => {
  it('envía el mensaje normalizado y responde con éxito', async () => {
    const { send, deliver, verify } = setup()
    const { response, json } = await send(validBody)

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true, message: 'Mensaje enviado. Gracias por escribir.' })
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(verify).toHaveBeenCalledWith({
      secret: 'turnstile_secret',
      token: 'token-ok',
      ip: '203.0.113.9',
    })
    expect(deliver).toHaveBeenCalledTimes(1)
    expect(deliver.mock.calls[0]?.[1]).toEqual({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      organization: undefined,
      phone: undefined,
      reason: 'charla-evento',
      message: 'Hola Mary, ¿podrías dar una charla en nuestro evento?',
    })
  })

  it('responde 503 genérico si falta configuración y no revela nombres de variables', async () => {
    const { send, deliver } = setup({ config: { ...baseConfig, missing: ['RESEND_API_KEY'] } })
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { response, json } = await send(validBody)

    expect(response.status).toBe(503)
    expect(json.ok).toBe(false)
    expect(JSON.stringify(json)).not.toContain('RESEND')
    expect(deliver).not.toHaveBeenCalled()
    expect(errorLog).toHaveBeenCalled()
  })

  it('rechaza peticiones que no son JSON', async () => {
    const { send, deliver } = setup()
    const { response, json } = await send(validBody, { headers: { 'content-type': 'text/plain' } })
    expect(response.status).toBe(400)
    expect(json).toMatchObject({ ok: false, code: 'bad_request' })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('rechaza JSON mal formado', async () => {
    const { send } = setup()
    const { response, json } = await send(null, { raw: '{"name": ' })
    expect(response.status).toBe(400)
    expect(json).toMatchObject({ code: 'bad_request' })
  })

  it('rechaza cuerpos que superan el límite', async () => {
    const { send, deliver } = setup()
    const { response, json } = await send({ ...validBody, message: 'x'.repeat(MAX_BODY_BYTES) })
    expect(response.status).toBe(413)
    expect(json).toMatchObject({ code: 'payload_too_large' })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('devuelve errores por campo sin repetir los datos enviados', async () => {
    const { send, deliver } = setup()
    const { response, json } = await send({
      ...validBody,
      email: 'secreto-invalido',
      privacy: false,
    })

    expect(response.status).toBe(422)
    expect(json).toMatchObject({ ok: false, code: 'validation' })
    if (!json.ok) {
      expect(Object.keys(json.fieldErrors ?? {})).toEqual(
        expect.arrayContaining(['email', 'privacy']),
      )
    }
    expect(JSON.stringify(json)).not.toContain('secreto-invalido')
    expect(deliver).not.toHaveBeenCalled()
  })

  it('rechaza campos inesperados', async () => {
    const { send } = setup()
    const { response } = await send({ ...validBody, to: 'otra@example.com' })
    expect(response.status).toBe(422)
  })

  it('finge éxito ante el honeypot sin enviar ni verificar nada', async () => {
    const { send, deliver, verify } = setup()
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const { response, json } = await send({ ...validBody, website: 'http://spam.example' })

    expect(response.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(deliver).not.toHaveBeenCalled()
    expect(verify).not.toHaveBeenCalled()
  })

  it('rechaza envíos demasiado rápidos', async () => {
    const { send, deliver } = setup()
    const { response, json } = await send({ ...validBody, elapsedMs: 300 })
    expect(response.status).toBe(429)
    expect(json).toMatchObject({ code: 'too_fast' })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('rechaza si Turnstile no valida el token', async () => {
    const { send, deliver } = setup({
      verify: vi.fn().mockResolvedValue({ ok: false, reason: 'rejected' }),
    })
    const { response, json } = await send(validBody)
    expect(response.status).toBe(400)
    expect(json).toMatchObject({ code: 'captcha' })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('responde 503 si Turnstile no está disponible', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { send, deliver } = setup({
      verify: vi.fn().mockResolvedValue({ ok: false, reason: 'unreachable' }),
    })
    const { response, json } = await send(validBody)
    expect(response.status).toBe(503)
    expect(json).toMatchObject({ code: 'unavailable' })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('no exige Turnstile si no hay clave secreta (dry-run)', async () => {
    const { send, verify, deliver } = setup({
      config: { ...baseConfig, deliveryMode: 'dry-run', turnstileSecret: undefined },
    })
    const { response } = await send({ ...validBody, turnstileToken: undefined })
    expect(response.status).toBe(200)
    expect(verify).not.toHaveBeenCalled()
    expect(deliver).toHaveBeenCalled()
  })

  it('oculta los detalles internos cuando falla la entrega', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    const deliver = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error('Resend key re_secret_key rejected'), { status: 401 }),
      )
    const { send } = setup({ deliver })
    const { response, json } = await send(validBody)

    expect(response.status).toBe(503)
    expect(json).toMatchObject({ ok: false, code: 'unavailable' })
    expect(JSON.stringify(json)).not.toContain('re_secret_key')
    const logged = JSON.stringify(errorLog.mock.calls)
    expect(logged).not.toContain('re_secret_key')
    expect(logged).not.toContain('Hola Mary')
  })

  it('limita la frecuencia por IP real y devuelve Retry-After', async () => {
    const { send } = setup()
    for (let i = 0; i < 3; i += 1) expect((await send(validBody)).response.status).toBe(200)

    const blocked = await send(validBody)
    expect(blocked.response.status).toBe(429)
    expect(blocked.json).toMatchObject({ code: 'rate_limited' })
    expect(Number(blocked.response.headers.get('retry-after'))).toBeGreaterThan(0)

    const otherIp = await send(validBody, { headers: { 'x-forwarded-for': '198.51.100.7' } })
    expect(otherIp.response.status).toBe(200)
  })

  it('no se deja engañar por una IP falsificada a la izquierda de X-Forwarded-For', async () => {
    const { send } = setup()
    for (let i = 0; i < 3; i += 1) {
      await send(validBody, { headers: { 'x-forwarded-for': `10.0.0.${i}, 203.0.113.9` } })
    }
    const blocked = await send(validBody, {
      headers: { 'x-forwarded-for': '10.0.0.99, 203.0.113.9' },
    })
    expect(blocked.response.status).toBe(429)
  })

  it('el tope global limita los envíos reales aunque cambie la IP', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { send, deliver } = setup({
      globalLimiter: createRateLimiter({ limit: 2, windowMs: 60_000 }),
    })

    for (const ip of ['198.51.100.1', '198.51.100.2']) {
      const sent = await send(validBody, { headers: { 'x-forwarded-for': ip } })
      expect(sent.response.status).toBe(200)
    }

    const blocked = await send(validBody, { headers: { 'x-forwarded-for': '198.51.100.3' } })
    expect(blocked.response.status).toBe(429)
    expect(blocked.json).toMatchObject({ code: 'rate_limited' })
    expect(Number(blocked.response.headers.get('retry-after'))).toBeGreaterThan(0)
    expect(deliver).toHaveBeenCalledTimes(2)
    expect(warn).toHaveBeenCalled()
  })

  it('los intentos rechazados antes de enviar no consumen el tope global', async () => {
    const { send, deliver } = setup({
      rateLimiter: createRateLimiter({ limit: 10, windowMs: 60_000 }),
      globalLimiter: createRateLimiter({ limit: 1, windowMs: 60_000 }),
    })
    vi.spyOn(console, 'info').mockImplementation(() => {})

    await send({ ...validBody, email: 'invalido' })
    await send({ ...validBody, website: 'spam' })
    await send({ ...validBody, elapsedMs: 10 })

    expect((await send(validBody)).response.status).toBe(200)
    expect(deliver).toHaveBeenCalledTimes(1)
  })
})
