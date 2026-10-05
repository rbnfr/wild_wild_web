import { CONTACT_REASON_LABELS } from '@/lib/validation/contact-reasons'
import type { ContactFields } from '@/lib/validation/contact'

export type ContactEmailInput = Pick<
  ContactFields,
  'name' | 'email' | 'organization' | 'phone' | 'reason' | 'message'
>

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** El asunto solo usa texto propio (nunca contenido del usuario). */
export function buildSubject(reason: ContactEmailInput['reason']): string {
  return `Nuevo mensaje desde la web: ${CONTACT_REASON_LABELS[reason]}`
}

function detailRows(input: ContactEmailInput): [label: string, value: string][] {
  return [
    ['Motivo', CONTACT_REASON_LABELS[input.reason]],
    ['Nombre', input.name],
    ['Correo', input.email],
    ...(input.organization ? [['Organización', input.organization] as [string, string]] : []),
    ...(input.phone ? [['Teléfono', input.phone] as [string, string]] : []),
  ]
}

export function renderText(input: ContactEmailInput, receivedAt: Date): string {
  const lines = detailRows(input).map(([label, value]) => `${label}: ${value}`)
  return [
    ...lines,
    `Recibido: ${receivedAt.toISOString()}`,
    '',
    'Mensaje:',
    input.message,
    '',
    '— Responde a este correo para contestar a la persona que escribe.',
  ].join('\n')
}

export function renderHtml(input: ContactEmailInput, receivedAt: Date): string {
  const rows = detailRows(input)
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 16px 4px 0;color:#4b6355;font-weight:600">${escapeHtml(label)}</th><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return `<!doctype html><html lang="es"><body style="font-family:system-ui,sans-serif;color:#1a2b27;line-height:1.5"><h1 style="font-size:18px">Nuevo mensaje desde la web</h1><table role="presentation" cellspacing="0" cellpadding="0">${rows}<tr><th align="left" style="padding:4px 16px 4px 0;color:#4b6355;font-weight:600">Recibido</th><td style="padding:4px 0">${escapeHtml(receivedAt.toISOString())}</td></tr></table><h2 style="font-size:15px;margin-top:24px">Mensaje</h2><p style="white-space:pre-wrap;margin:0">${escapeHtml(input.message)}</p><p style="color:#4b6355;font-size:13px;margin-top:24px">Responde a este correo para contestar a la persona que escribe.</p></body></html>`
}
