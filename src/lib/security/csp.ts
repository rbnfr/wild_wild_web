const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com'

export function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
}

export type CspOptions = {
  nonce: string
  isDevelopment?: boolean
  /** Solo con HTTPS real: en http://localhost rompería la carga de recursos. */
  upgradeInsecureRequests?: boolean
}

/**
 * Content-Security-Policy con nonce por petición.
 *
 * - `strict-dynamic` permite que los scripts con nonce carguen otros (Turnstile),
 *   así que no hace falta abrir `script-src` con comodines ni `unsafe-inline`.
 * - Los atributos `style` (los usa next/image) necesitan `style-src-attr 'unsafe-inline'`;
 *   las etiquetas <style> y las hojas de estilo siguen restringidas.
 * - Turnstile necesita su origen en script, frame y connect.
 */
export function buildCsp({
  nonce,
  isDevelopment = false,
  upgradeInsecureRequests = false,
}: CspOptions): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    TURNSTILE_ORIGIN,
    // React usa eval en desarrollo para reconstruir pilas de errores.
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ]

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': scriptSrc,
    'style-src': isDevelopment ? ["'self'", "'unsafe-inline'"] : ["'self'", `'nonce-${nonce}'`],
    'style-src-attr': ["'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", TURNSTILE_ORIGIN],
    'frame-src': [TURNSTILE_ORIGIN],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  }

  const policy = Object.entries(directives).map(([name, sources]) => `${name} ${sources.join(' ')}`)
  if (upgradeInsecureRequests) policy.push('upgrade-insecure-requests')
  return policy.join('; ')
}
