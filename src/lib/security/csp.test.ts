import { describe, expect, it } from 'vitest'

import { buildCsp, generateNonce } from './csp'

const directive = (csp: string, name: string) =>
  csp
    .split('; ')
    .find((part) => part.startsWith(`${name} `))
    ?.slice(name.length + 1)

describe('generateNonce', () => {
  it('genera valores base64 distintos en cada llamada', () => {
    const first = generateNonce()
    const second = generateNonce()
    expect(first).toMatch(/^[A-Za-z0-9+/]{22}==$/)
    expect(first).not.toBe(second)
  })
})

describe('buildCsp', () => {
  const csp = buildCsp({ nonce: 'abc123' })

  it('usa nonce y strict-dynamic en script-src, sin unsafe-inline ni unsafe-eval', () => {
    const scriptSrc = directive(csp, 'script-src')
    expect(scriptSrc).toContain("'nonce-abc123'")
    expect(scriptSrc).toContain("'strict-dynamic'")
    expect(scriptSrc).not.toContain('unsafe-inline')
    expect(scriptSrc).not.toContain('unsafe-eval')
  })

  it('permite Turnstile solo donde hace falta', () => {
    expect(directive(csp, 'script-src')).toContain('https://challenges.cloudflare.com')
    expect(directive(csp, 'frame-src')).toBe('https://challenges.cloudflare.com')
    expect(directive(csp, 'connect-src')).toContain('https://challenges.cloudflare.com')
  })

  it('bloquea objetos, framing y bases externas', () => {
    expect(directive(csp, 'object-src')).toBe("'none'")
    expect(directive(csp, 'frame-ancestors')).toBe("'none'")
    expect(directive(csp, 'base-uri')).toBe("'self'")
    expect(directive(csp, 'form-action')).toBe("'self'")
    expect(directive(csp, 'default-src')).toBe("'self'")
  })

  it('no usa comodines', () => {
    expect(csp).not.toMatch(/(^|\s)\*(\s|;|$)/)
  })

  it('en producción los estilos usan nonce y no unsafe-inline salvo en atributos', () => {
    expect(directive(csp, 'style-src')).toBe("'self' 'nonce-abc123'")
    expect(directive(csp, 'style-src-attr')).toBe("'unsafe-inline'")
  })

  it('en desarrollo añade unsafe-eval y estilos inline', () => {
    const dev = buildCsp({ nonce: 'abc123', isDevelopment: true })
    expect(directive(dev, 'script-src')).toContain("'unsafe-eval'")
    expect(directive(dev, 'style-src')).toContain("'unsafe-inline'")
  })

  it('upgrade-insecure-requests es opcional', () => {
    expect(csp).not.toContain('upgrade-insecure-requests')
    expect(buildCsp({ nonce: 'x', upgradeInsecureRequests: true })).toContain(
      'upgrade-insecure-requests',
    )
  })
})
