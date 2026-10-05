import type { FieldErrors } from '@/lib/validation/contact'

export type ContactFailureCode =
  | 'bad_request'
  | 'payload_too_large'
  | 'validation'
  | 'too_fast'
  | 'captcha'
  | 'rate_limited'
  | 'unavailable'

/** Forma de las respuestas JSON de POST /api/contact, compartida por servidor y cliente. */
export type ContactApiResponse =
  | { ok: true; message: string }
  | { ok: false; code: ContactFailureCode; message: string; fieldErrors?: FieldErrors }
