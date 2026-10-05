import { describe, expect, it } from 'vitest'

import { readLimitedJson } from './request-body'

const post = (body: BodyInit | null, headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    body,
    headers,
    duplex: 'half',
  } as RequestInit)

describe('readLimitedJson', () => {
  it('lee un JSON válido dentro del límite', async () => {
    const result = await readLimitedJson(post('{"a":1}'), 100)
    expect(result).toEqual({ ok: true, data: { a: 1 } })
  })

  it('rechaza cuerpos demasiado grandes aunque no declaren longitud', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"a":"'))
        controller.enqueue(new TextEncoder().encode('x'.repeat(200)))
        controller.enqueue(new TextEncoder().encode('"}'))
        controller.close()
      },
    })
    const result = await readLimitedJson(post(stream), 100)
    expect(result).toEqual({ ok: false, reason: 'too_large' })
  })

  it('rechaza por Content-Length declarado sin leer el cuerpo', async () => {
    const request = post('{}', { 'content-length': '5000' })
    expect(await readLimitedJson(request, 100)).toEqual({ ok: false, reason: 'too_large' })
  })

  it('rechaza JSON mal formado', async () => {
    expect(await readLimitedJson(post('{no es json'), 100)).toEqual({
      ok: false,
      reason: 'invalid',
    })
  })

  it('rechaza cuerpos vacíos y UTF-8 inválido', async () => {
    expect(await readLimitedJson(post(''), 100)).toEqual({ ok: false, reason: 'invalid' })
    expect(await readLimitedJson(post(new Uint8Array([0xff, 0xfe, 0xfd])), 100)).toEqual({
      ok: false,
      reason: 'invalid',
    })
  })
})
