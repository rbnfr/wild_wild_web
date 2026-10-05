export const CONTACT_REASON_IDS = [
  'consulta',
  'contratacion',
  'charla-evento',
  'prensa-medios',
  'editorial',
  'colaboracion-comercial',
  'otro',
] as const

export type ContactReasonId = (typeof CONTACT_REASON_IDS)[number]

export const CONTACT_REASON_LABELS: Record<ContactReasonId, string> = {
  consulta: 'Consulta',
  contratacion: 'Contratación',
  'charla-evento': 'Charla o evento',
  'prensa-medios': 'Prensa o medios',
  editorial: 'Editorial',
  'colaboracion-comercial': 'Colaboración comercial',
  otro: 'Otro',
}

export function isContactReasonId(value: unknown): value is ContactReasonId {
  return typeof value === 'string' && (CONTACT_REASON_IDS as readonly string[]).includes(value)
}
