export type BodyReadResult =
  { ok: true; data: unknown } | { ok: false; reason: 'too_large' | 'invalid' }

/**
 * Lee un cuerpo JSON sin pasarse de `maxBytes`. Corta la lectura en cuanto se supera,
 * aunque el cliente mienta en Content-Length o use transferencia por fragmentos.
 */
export async function readLimitedJson(request: Request, maxBytes: number): Promise<BodyReadResult> {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, reason: 'too_large' }
  if (!request.body) return { ok: false, reason: 'invalid' }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.byteLength
      if (received > maxBytes) {
        await reader.cancel()
        return { ok: false, reason: 'too_large' }
      }
      chunks.push(value)
    }
  } catch {
    return { ok: false, reason: 'invalid' }
  }

  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { ok: true, data: JSON.parse(text) as unknown }
  } catch {
    return { ok: false, reason: 'invalid' }
  }
}
