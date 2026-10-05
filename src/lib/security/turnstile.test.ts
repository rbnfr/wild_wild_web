import { describe, expect, it, vi } from 'vitest'

import { verifyTurnstile } from './turnstile'

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), { status: 200, ...init })

describe('verifyTurnstile', () => {
  it('rechaza sin consultar a Cloudflare si no hay token', async () => {
    const fetchImpl = vi.fn()
    const result = await verifyTurnstile({ secret: 's', token: undefined, fetchImpl })
    expect(result).toEqual({ ok: false, reason: 'rejected' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('acepta cuando Cloudflare responde success: true', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ success: true }))
    const result = await verifyTurnstile({
      secret: 'sec',
      token: 'tok',
      ip: '203.0.113.9',
      fetchImpl,
    })
    expect(result).toEqual({ ok: true })

    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    const body = init.body as URLSearchParams
    expect(body.get('secret')).toBe('sec')
    expect(body.get('response')).toBe('tok')
    expect(body.get('remoteip')).toBe('203.0.113.9')
  })

  it('no envía remoteip si la IP es desconocida', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ success: true }))
    await verifyTurnstile({ secret: 's', token: 't', ip: 'unknown', fetchImpl })
    const init = fetchImpl.mock.calls[0]?.[1] as RequestInit
    expect((init.body as URLSearchParams).has('remoteip')).toBe(false)
  })

  it('rechaza cuando el token no es válido', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ success: false, 'error-codes': ['invalid-input-response'] }),
      )
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl })).toEqual({
      ok: false,
      reason: 'rejected',
    })
  })

  it('distingue los fallos de red o de servicio', async () => {
    const down = vi.fn().mockRejectedValue(new Error('network'))
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl: down })).toEqual({
      ok: false,
      reason: 'unreachable',
    })

    const error500 = vi.fn().mockResolvedValue(new Response('', { status: 500 }))
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl: error500 })).toEqual({
      ok: false,
      reason: 'unreachable',
    })
  })

  it('trata una respuesta mal formada como rechazo', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse('???'))
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl })).toEqual({
      ok: false,
      reason: 'rejected',
    })
  })
})
