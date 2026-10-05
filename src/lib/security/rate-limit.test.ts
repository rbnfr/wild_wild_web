import { describe, expect, it } from 'vitest'

import { createRateLimiter } from './rate-limit'

function setup(options: { limit?: number; windowMs?: number; maxKeys?: number } = {}) {
  let time = 1_000_000
  const limiter = createRateLimiter({
    limit: options.limit ?? 3,
    windowMs: options.windowMs ?? 60_000,
    maxKeys: options.maxKeys,
    now: () => time,
  })
  return { limiter, advance: (ms: number) => (time += ms) }
}

describe('createRateLimiter', () => {
  it('permite hasta el límite y bloquea el siguiente', () => {
    const { limiter } = setup()
    expect(limiter.check('a').allowed).toBe(true)
    expect(limiter.check('a').allowed).toBe(true)
    expect(limiter.check('a').allowed).toBe(true)
    expect(limiter.check('a').allowed).toBe(false)
  })

  it('cuenta cada clave por separado', () => {
    const { limiter } = setup({ limit: 1 })
    expect(limiter.check('a').allowed).toBe(true)
    expect(limiter.check('b').allowed).toBe(true)
    expect(limiter.check('a').allowed).toBe(false)
  })

  it('indica cuántos segundos faltan para poder reintentar', () => {
    const { limiter, advance } = setup({ limit: 1, windowMs: 60_000 })
    limiter.check('a')
    advance(20_000)
    expect(limiter.check('a')).toEqual({ allowed: false, retryAfterSeconds: 40 })
  })

  it('libera la clave cuando pasa la ventana', () => {
    const { limiter, advance } = setup({ limit: 1, windowMs: 60_000 })
    limiter.check('a')
    advance(60_001)
    expect(limiter.check('a').allowed).toBe(true)
  })

  it('los intentos bloqueados no amplían el bloqueo', () => {
    const { limiter, advance } = setup({ limit: 1, windowMs: 60_000 })
    limiter.check('a')
    advance(30_000)
    limiter.check('a')
    advance(30_001)
    expect(limiter.check('a').allowed).toBe(true)
  })

  it('acota el número de claves en memoria', () => {
    const { limiter } = setup({ limit: 1, maxKeys: 2 })
    limiter.check('a')
    limiter.check('b')
    limiter.check('c')
    // 'a' fue la más antigua y se expulsa: vuelve a estar permitida.
    expect(limiter.check('a').allowed).toBe(true)
  })
})
