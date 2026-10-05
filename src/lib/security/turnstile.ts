const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TIMEOUT_MS = 5000

export type TurnstileResult =
  | { ok: true }
  /** `rejected`: token inválido o caducado. `unreachable`: no se pudo consultar a Cloudflare. */
  | { ok: false; reason: 'rejected' | 'unreachable' }

type VerifyOptions = {
  secret: string
  token: string | undefined
  ip?: string
  fetchImpl?: typeof fetch
}

export async function verifyTurnstile({
  secret,
  token,
  ip,
  fetchImpl = fetch,
}: VerifyOptions): Promise<TurnstileResult> {
  if (!token) return { ok: false, reason: 'rejected' }

  const body = new URLSearchParams({ secret, response: token })
  if (ip && ip !== 'unknown') body.set('remoteip', ip)

  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) return { ok: false, reason: 'unreachable' }

    const result: unknown = await response.json()
    const success =
      typeof result === 'object' &&
      result !== null &&
      'success' in result &&
      result.success === true
    return success ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch {
    return { ok: false, reason: 'unreachable' }
  }
}
