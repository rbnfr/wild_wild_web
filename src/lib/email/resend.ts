const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const TIMEOUT_MS = 10_000

export type ResendEmail = {
  apiKey: string
  from: string
  to: string
  replyTo: string
  subject: string
  text: string
  html: string
}

/** Solo lleva el estado HTTP: el cuerpo de la respuesta podría contener datos del mensaje. */
export class EmailDeliveryError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'EmailDeliveryError'
    this.status = status
  }
}

export async function sendWithResend(
  { apiKey, from, to, replyTo, subject, text, html }: ResendEmail,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  let response: Response
  try {
    response = await fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text, html }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch {
    throw new EmailDeliveryError('No se pudo contactar con el proveedor de correo.')
  }

  if (!response.ok) {
    throw new EmailDeliveryError('El proveedor de correo rechazó el envío.', response.status)
  }
}
