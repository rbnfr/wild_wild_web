import { describe, expect, it } from 'vitest'

import { loadContactConfig } from './contact-config'

const complete = {
  CONTACT_DELIVERY_MODE: 'resend',
  CONTACT_TO_EMAIL: 'mary@example.com',
  CONTACT_FROM_EMAIL: 'Web Mary <web@example.com>',
  RESEND_API_KEY: 're_test',
  TURNSTILE_SECRET_KEY: 'secret',
}

describe('loadContactConfig', () => {
  it('lee una configuración completa sin variables ausentes', () => {
    const config = loadContactConfig(complete)
    expect(config.missing).toEqual([])
    expect(config.deliveryMode).toBe('resend')
    expect(config.rateLimit).toEqual({ max: 5, globalMax: 50, windowMs: 600_000 })
    expect(config.trustedProxyHops).toBe(1)
  })

  it('por defecto exige configuración de envío real y lista solo los nombres que faltan', () => {
    const config = loadContactConfig({})
    expect(config.deliveryMode).toBe('resend')
    expect(config.missing).toEqual([
      'CONTACT_TO_EMAIL',
      'CONTACT_FROM_EMAIL',
      'RESEND_API_KEY',
      'TURNSTILE_SECRET_KEY',
    ])
  })

  it('trata las variables vacías como no definidas', () => {
    const config = loadContactConfig({
      ...complete,
      RESEND_API_KEY: '',
      TURNSTILE_SECRET_KEY: '  ',
    })
    expect(config.resendApiKey).toBeUndefined()
    expect(config.missing).toEqual(['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY'])
  })

  it('en dry-run no exige nada', () => {
    const config = loadContactConfig({ CONTACT_DELIVERY_MODE: 'dry-run' })
    expect(config.deliveryMode).toBe('dry-run')
    expect(config.missing).toEqual([])
    expect(config.turnstileSecret).toBeUndefined()
  })

  it('marca como no válidos los valores incorrectos sin exponerlos', () => {
    const config = loadContactConfig({ ...complete, CONTACT_TO_EMAIL: 'no-es-un-correo' })
    expect(config.missing).toEqual(['CONTACT_TO_EMAIL (valor no válido)'])
    expect(JSON.stringify(config.missing)).not.toContain('no-es-un-correo')
  })

  it('rechaza remitentes con saltos de línea', () => {
    const config = loadContactConfig({
      ...complete,
      CONTACT_FROM_EMAIL: 'web@example.com\r\nBcc: x@y.com',
    })
    expect(config.missing).toContain('CONTACT_FROM_EMAIL (valor no válido)')
  })

  it('lee los límites de frecuencia y los proxies de confianza', () => {
    const config = loadContactConfig({
      ...complete,
      CONTACT_RATE_LIMIT_MAX: '10',
      CONTACT_GLOBAL_RATE_LIMIT_MAX: '20',
      CONTACT_RATE_LIMIT_WINDOW_SECONDS: '60',
      TRUSTED_PROXY_HOPS: '2',
    })
    expect(config.rateLimit).toEqual({ max: 10, globalMax: 20, windowMs: 60_000 })
    expect(config.trustedProxyHops).toBe(2)
  })
})
