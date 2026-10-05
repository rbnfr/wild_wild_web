import type { ContactConfig } from '@/lib/config/contact-config'

import { EmailDeliveryError, sendWithResend } from './resend'
import { buildSubject, renderHtml, renderText, type ContactEmailInput } from './render'

/**
 * Entrega el mensaje según `CONTACT_DELIVERY_MODE`.
 * En `dry-run` no se envía nada y solo se registran metadatos, nunca el contenido.
 */
export async function deliverContactMessage(
  config: ContactConfig,
  input: ContactEmailInput,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  if (config.deliveryMode === 'dry-run') {
    console.info('[contact] dry-run: mensaje validado y no enviado', {
      reason: input.reason,
      messageLength: input.message.length,
    })
    return
  }

  if (!config.resendApiKey || !config.fromEmail || !config.toEmail) {
    throw new EmailDeliveryError('Configuración de correo incompleta.')
  }

  const receivedAt = new Date()
  await sendWithResend(
    {
      apiKey: config.resendApiKey,
      from: config.fromEmail,
      to: config.toEmail,
      replyTo: input.email,
      subject: buildSubject(input.reason),
      text: renderText(input, receivedAt),
      html: renderHtml(input, receivedAt),
    },
    fetchImpl,
  )
}
