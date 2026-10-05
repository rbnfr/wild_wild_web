import { isIP } from 'node:net'

export const UNKNOWN_IP = 'unknown'

/**
 * Obtiene la IP del cliente desde X-Forwarded-For.
 *
 * Cada proxy de confianza añade al final de la cabecera la IP que ha visto, así que
 * se cuenta desde la derecha: lo que haya a la izquierda lo puede falsificar el cliente.
 * Con `trustedProxyHops = 0` no se confía en ninguna cabecera.
 */
export function getClientIp(headers: Headers, trustedProxyHops: number): string {
  if (trustedProxyHops <= 0) return UNKNOWN_IP

  const forwarded = headers.get('x-forwarded-for')
  if (!forwarded) return UNKNOWN_IP

  const entries = forwarded
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  if (entries.length === 0) return UNKNOWN_IP

  const candidate = entries[Math.max(0, entries.length - trustedProxyHops)] ?? UNKNOWN_IP
  return isIP(candidate) ? candidate.toLowerCase() : UNKNOWN_IP
}
