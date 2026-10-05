export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

export type RateLimiterOptions = {
  /** Peticiones permitidas por clave dentro de la ventana. */
  limit: number
  windowMs: number
  /** Tope de claves en memoria, para que un ataque no agote la RAM. */
  maxKeys?: number
  now?: () => number
}

/**
 * Ventana deslizante en memoria. Es suficiente para una única instancia de Node;
 * si se escala a varias instancias, sustituir por un almacén compartido (p. ej. Redis).
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
  now = Date.now,
}: RateLimiterOptions) {
  const hits = new Map<string, number[]>()

  function pruneExpired(current: number) {
    for (const [key, timestamps] of hits) {
      const last = timestamps[timestamps.length - 1]
      if (last === undefined || current - last >= windowMs) hits.delete(key)
    }
  }

  function check(key: string): RateLimitResult {
    const current = now()
    const windowStart = current - windowMs
    const recent = (hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart)

    if (recent.length >= limit) {
      const oldest = recent[0] ?? current
      hits.set(key, recent)
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - current) / 1000)),
      }
    }

    recent.push(current)
    // Reinsertar mueve la clave al final: las más antiguas quedan primero para expulsarlas.
    hits.delete(key)
    hits.set(key, recent)

    if (hits.size > maxKeys) {
      pruneExpired(current)
      for (const oldestKey of hits.keys()) {
        if (hits.size <= maxKeys) break
        hits.delete(oldestKey)
      }
    }

    return { allowed: true, retryAfterSeconds: 0 }
  }

  return { check }
}

export type RateLimiter = ReturnType<typeof createRateLimiter>
