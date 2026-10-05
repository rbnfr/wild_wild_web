// Se usa `zod/mini`: es la misma validación con una API que permite descartar lo que no se usa,
// y este módulo también se envía al navegador (el formulario valida antes de enviar).
import * as z from 'zod/mini'

import { CONTACT_REASON_IDS } from './contact-reasons'
import { normalizeMultiline, normalizeSingleLine } from './normalize'

// Zod prueba si puede compilar esquemas con `new Function`. Bajo nuestra CSP (sin unsafe-eval)
// esa prueba falla de forma controlada, pero el navegador la registra como violación de CSP.
// Con jitless se omite la prueba; los esquemas son pequeños y no se nota la diferencia.
z.config({ jitless: true })

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  organizationMax: 120,
  phoneMax: 20,
  messageMin: 10,
  messageMax: 3000,
  tokenMax: 2048,
  honeypotMax: 200,
} as const

/** Tiempo mínimo razonable entre que se muestra el formulario y se envía. */
export const MIN_FILL_TIME_MS = 2500
const MAX_FILL_TIME_MS = 1000 * 60 * 60 * 24

const PHONE_PATTERN = /^\+?[\d\s().-]+$/

function isPhoneOrEmpty(value: string): boolean {
  if (value === '') return true
  if (!PHONE_PATTERN.test(value)) return false
  const digits = value.replace(/\D/g, '').length
  return digits >= 6 && digits <= 15
}

const emptyToUndefined = z.transform((value: string) => value || undefined)

const nameSchema = z
  .string({ error: 'Escribe tu nombre.' })
  .check(
    z.overwrite(normalizeSingleLine),
    z.minLength(CONTACT_LIMITS.nameMin, 'Escribe tu nombre.'),
    z.maxLength(
      CONTACT_LIMITS.nameMax,
      `El nombre no puede superar ${CONTACT_LIMITS.nameMax} caracteres.`,
    ),
  )

// El formato se valida en una segunda fase para que un correo vacío muestre "Escribe tu correo".
const emailSchema = z.pipe(
  z.string({ error: 'Escribe tu correo electrónico.' }).check(
    z.overwrite(normalizeSingleLine),
    z.overwrite((value) => value.toLowerCase()),
    z.minLength(1, 'Escribe tu correo electrónico.'),
    z.maxLength(CONTACT_LIMITS.emailMax, 'El correo electrónico es demasiado largo.'),
  ),
  z.email('Escribe un correo electrónico válido, por ejemplo nombre@dominio.com.'),
)

const organizationSchema = z.optional(
  z.pipe(
    z
      .string()
      .check(
        z.overwrite(normalizeSingleLine),
        z.maxLength(
          CONTACT_LIMITS.organizationMax,
          `La organización no puede superar ${CONTACT_LIMITS.organizationMax} caracteres.`,
        ),
      ),
    emptyToUndefined,
  ),
)

const phoneSchema = z.optional(
  z.pipe(
    z
      .string()
      .check(
        z.overwrite(normalizeSingleLine),
        z.maxLength(CONTACT_LIMITS.phoneMax, 'El teléfono es demasiado largo.'),
        z.refine(
          isPhoneOrEmpty,
          'Escribe un teléfono válido (solo números, espacios y + ( ) . -) o déjalo en blanco.',
        ),
      ),
    emptyToUndefined,
  ),
)

const messageSchema = z
  .string({ error: 'Escribe tu mensaje.' })
  .check(
    z.overwrite(normalizeMultiline),
    z.minLength(
      CONTACT_LIMITS.messageMin,
      `Cuéntale un poco más: mínimo ${CONTACT_LIMITS.messageMin} caracteres.`,
    ),
    z.maxLength(
      CONTACT_LIMITS.messageMax,
      `El mensaje no puede superar ${CONTACT_LIMITS.messageMax} caracteres.`,
    ),
  )

/** Campos visibles del formulario. Se valida igual en navegador y en servidor. */
export const contactFieldsSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  organization: organizationSchema,
  phone: phoneSchema,
  reason: z.enum(CONTACT_REASON_IDS, { error: 'Elige un motivo de contacto.' }),
  message: messageSchema,
  privacy: z.literal(true, {
    error: 'Debes aceptar la política de privacidad para enviar el mensaje.',
  }),
})

/** Cuerpo completo que acepta la API: campos visibles más señales anti-spam. */
export const contactRequestSchema = z.extend(contactFieldsSchema, {
  /** Honeypot: las personas no lo ven y no lo rellenan. */
  website: z.optional(z.string().check(z.maxLength(CONTACT_LIMITS.honeypotMax))),
  turnstileToken: z.optional(z.string().check(z.maxLength(CONTACT_LIMITS.tokenMax))),
  /** Milisegundos transcurridos entre mostrar el formulario y enviarlo. */
  elapsedMs: z.number().check(z.int(), z.minimum(0), z.maximum(MAX_FILL_TIME_MS)),
})

export type ContactFields = z.output<typeof contactFieldsSchema>
export type ContactFieldName = keyof ContactFields
export type ContactRequest = z.output<typeof contactRequestSchema>
export type FieldErrors = Partial<Record<string, string[]>>

export function getFieldErrors(error: z.core.$ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors
}
