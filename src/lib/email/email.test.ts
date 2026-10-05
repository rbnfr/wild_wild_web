import { describe, expect, it, vi } from 'vitest'

import type { ContactConfig } from '@/lib/config/contact-config'

import { deliverContactMessage } from './deliver'
import { buildSubject, escapeHtml, renderHtml, renderText, type ContactEmailInput } from './render'
import { EmailDeliveryError, sendWithResend } from './resend'

const input: ContactEmailInput = {
  name: 'Ana <script>alert(1)</script>',
  email: 'ana@example.com',
  organization: 'Editorial "Luna" & Co',
  phone: undefined,
  reason: 'editorial',
  message: 'Hola\n<img src=x onerror=alert(1)>\nUn saludo',
}

const config: ContactConfig = {
  deliveryMode: 'resend',
  toEmail: 'mary@example.com',
  fromEmail: 'Web <web@example.com>',
  resendApiKey: 're_test_key',
  turnstileSecret: 'secret',
  rateLimit: { max: 5, globalMax: 50, windowMs: 600_000 },
  trustedProxyHops: 1,
  missing: [],
}

describe('render', () => {
  it('escapeHtml neutraliza los caracteres especiales', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    )
  })

  it('el asunto solo contiene texto propio, nunca contenido del usuario', () => {
    const subject = buildSubject('editorial')
    expect(subject).toBe('Nuevo mensaje desde la web: Editorial')
    expect(subject).not.toMatch(/[\r\n]/)
  })

  it('el HTML escapa todos los datos del usuario', () => {
    const html = renderHtml(input, new Date('2026-01-01T10:00:00Z'))
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(html).toContain('Editorial &quot;Luna&quot; &amp; Co')
  })

  it('el texto plano incluye los datos y omite los opcionales vacíos', () => {
    const text = renderText(input, new Date('2026-01-01T10:00:00Z'))
    expect(text).toContain('Motivo: Editorial')
    expect(text).toContain('Correo: ana@example.com')
    expect(text).toContain('Organización:')
    expect(text).not.toContain('Teléfono:')
    expect(text).toContain('2026-01-01T10:00:00.000Z')
  })
})

describe('sendWithResend', () => {
  const email = {
    apiKey: 're_key',
    from: 'web@example.com',
    to: 'mary@example.com',
    replyTo: 'ana@example.com',
    subject: 'Asunto',
    text: 'texto',
    html: '<p>html</p>',
  }

  it('envía el correo con la clave en la cabecera Authorization y reply_to', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{"id":"1"}', { status: 200 }))
    await sendWithResend(email, fetchImpl)

    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_key')
    expect(JSON.parse(init.body as string)).toEqual({
      from: 'web@example.com',
      to: ['mary@example.com'],
      reply_to: 'ana@example.com',
      subject: 'Asunto',
      text: 'texto',
      html: '<p>html</p>',
    })
  })

  it('lanza un error con solo el estado cuando el proveedor rechaza', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('detalle interno con datos', { status: 422 }))
    const error = await sendWithResend(email, fetchImpl).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(EmailDeliveryError)
    expect((error as EmailDeliveryError).status).toBe(422)
    expect((error as EmailDeliveryError).message).not.toContain('detalle')
  })

  it('lanza un error ante fallos de red', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('ECONNRESET'))
    await expect(sendWithResend(email, fetchImpl)).rejects.toBeInstanceOf(EmailDeliveryError)
  })
})

describe('deliverContactMessage', () => {
  it('en dry-run no envía nada y no registra el contenido', async () => {
    const fetchImpl = vi.fn()
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    await deliverContactMessage({ ...config, deliveryMode: 'dry-run' }, input, fetchImpl)

    expect(fetchImpl).not.toHaveBeenCalled()
    expect(JSON.stringify(info.mock.calls)).not.toContain('onerror')
    expect(JSON.stringify(info.mock.calls)).not.toContain('ana@example.com')
  })

  it('en modo resend usa remitente, destinatario y reply-to correctos', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    await deliverContactMessage(config, input, fetchImpl)

    const body = JSON.parse((fetchImpl.mock.calls[0]?.[1] as RequestInit).body as string)
    expect(body.from).toBe('Web <web@example.com>')
    expect(body.to).toEqual(['mary@example.com'])
    expect(body.reply_to).toBe('ana@example.com')
    expect(body.subject).toBe('Nuevo mensaje desde la web: Editorial')
  })

  it('falla si falta configuración', async () => {
    await expect(
      deliverContactMessage({ ...config, resendApiKey: undefined }, input, vi.fn()),
    ).rejects.toBeInstanceOf(EmailDeliveryError)
  })
})
