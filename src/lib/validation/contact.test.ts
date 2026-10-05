import { describe, expect, it } from 'vitest'

import {
  CONTACT_LIMITS,
  contactFieldsSchema,
  contactRequestSchema,
  getFieldErrors,
  MIN_FILL_TIME_MS,
} from './contact'

const valid = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  organization: '',
  phone: '',
  reason: 'prensa-medios',
  message: 'Hola Mary, me gustaría proponerte una colaboración.',
  privacy: true,
}

describe('contactFieldsSchema', () => {
  it('acepta un mensaje válido y omite los opcionales vacíos', () => {
    const result = contactFieldsSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.organization).toBeUndefined()
      expect(result.data.phone).toBeUndefined()
    }
  })

  it('normaliza nombre, correo y mensaje', () => {
    const result = contactFieldsSchema.parse({
      ...valid,
      name: '  Ana   Pérez\r\n',
      email: '  ANA@Example.COM ',
      message: 'Línea uno   \r\n\r\n\r\n\r\nLínea dos con texto suficiente.',
    })
    expect(result.name).toBe('Ana Pérez')
    expect(result.email).toBe('ana@example.com')
    expect(result.message).toBe('Línea uno\n\nLínea dos con texto suficiente.')
  })

  it('rechaza correos no válidos y los que intentan inyectar cabeceras', () => {
    for (const email of [
      'ana',
      'ana@',
      'ana@example',
      'ana@example.com\r\nBcc: x@y.com',
      'a b@example.com',
    ]) {
      expect(contactFieldsSchema.safeParse({ ...valid, email }).success, email).toBe(false)
    }
  })

  it('exige nombre con al menos dos caracteres', () => {
    const result = contactFieldsSchema.safeParse({ ...valid, name: ' A ' })
    expect(result.success).toBe(false)
    if (!result.success) expect(getFieldErrors(result.error).name).toBeDefined()
  })

  it('aplica los límites de longitud', () => {
    const tooLong = {
      name: 'a'.repeat(CONTACT_LIMITS.nameMax + 1),
      organization: 'a'.repeat(CONTACT_LIMITS.organizationMax + 1),
      message: 'a'.repeat(CONTACT_LIMITS.messageMax + 1),
    }
    const result = contactFieldsSchema.safeParse({ ...valid, ...tooLong })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = getFieldErrors(result.error)
      expect(errors.name).toBeDefined()
      expect(errors.organization).toBeDefined()
      expect(errors.message).toBeDefined()
    }
  })

  it('exige un mensaje mínimo', () => {
    expect(contactFieldsSchema.safeParse({ ...valid, message: 'Hola' }).success).toBe(false)
  })

  it('valida el teléfono solo si se rellena', () => {
    expect(contactFieldsSchema.safeParse({ ...valid, phone: '+34 600 123 456' }).success).toBe(true)
    expect(contactFieldsSchema.safeParse({ ...valid, phone: '12' }).success).toBe(false)
    expect(contactFieldsSchema.safeParse({ ...valid, phone: 'llámame' }).success).toBe(false)
  })

  it('rechaza motivos desconocidos', () => {
    expect(contactFieldsSchema.safeParse({ ...valid, reason: 'spam' }).success).toBe(false)
    expect(contactFieldsSchema.safeParse({ ...valid, reason: undefined }).success).toBe(false)
  })

  it('exige aceptar la política de privacidad', () => {
    const result = contactFieldsSchema.safeParse({ ...valid, privacy: false })
    expect(result.success).toBe(false)
    if (!result.success) expect(getFieldErrors(result.error).privacy).toBeDefined()
    expect(contactFieldsSchema.safeParse({ ...valid, privacy: undefined }).success).toBe(false)
  })

  it('rechaza campos inesperados', () => {
    expect(contactFieldsSchema.safeParse({ ...valid, role: 'admin' }).success).toBe(false)
  })

  it('devuelve mensajes en español para cada campo, nunca los textos por defecto de Zod', () => {
    const result = contactFieldsSchema.safeParse({
      name: '',
      email: '',
      phone: 'abc',
      reason: 'otra-cosa',
      message: '',
      privacy: false,
    })
    expect(result.success).toBe(false)
    if (result.success) return

    const errors = getFieldErrors(result.error)
    expect(errors.name?.[0]).toBe('Escribe tu nombre.')
    expect(errors.email?.[0]).toBe('Escribe tu correo electrónico.')
    expect(errors.reason?.[0]).toBe('Elige un motivo de contacto.')
    expect(errors.privacy?.[0]).toBe(
      'Debes aceptar la política de privacidad para enviar el mensaje.',
    )
    expect(errors.phone?.[0]).toContain('teléfono válido')
    for (const messages of Object.values(errors)) {
      for (const message of messages ?? []) {
        expect(message, message).not.toMatch(/invalid|expected|received|too (small|big)|required/i)
      }
    }
  })

  it('distingue un correo vacío de uno con formato incorrecto', () => {
    const empty = contactFieldsSchema.safeParse({ ...valid, email: '' })
    const wrong = contactFieldsSchema.safeParse({ ...valid, email: 'ana@' })
    expect(!empty.success && getFieldErrors(empty.error).email?.[0]).toBe(
      'Escribe tu correo electrónico.',
    )
    expect(!wrong.success && getFieldErrors(wrong.error).email?.[0]).toContain(
      'correo electrónico válido',
    )
  })
})

describe('contactRequestSchema', () => {
  const request = {
    ...valid,
    website: '',
    turnstileToken: 'token',
    elapsedMs: MIN_FILL_TIME_MS + 1,
  }

  it('acepta los campos anti-spam', () => {
    expect(contactRequestSchema.safeParse(request).success).toBe(true)
  })

  it('exige el tiempo transcurrido como entero no negativo', () => {
    expect(contactRequestSchema.safeParse({ ...request, elapsedMs: undefined }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...request, elapsedMs: -1 }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...request, elapsedMs: 'rápido' }).success).toBe(false)
  })

  it('limita el tamaño del token y del honeypot', () => {
    expect(
      contactRequestSchema.safeParse({ ...request, turnstileToken: 'x'.repeat(3000) }).success,
    ).toBe(false)
    expect(contactRequestSchema.safeParse({ ...request, website: 'x'.repeat(500) }).success).toBe(
      false,
    )
  })

  it('sigue rechazando campos desconocidos', () => {
    expect(contactRequestSchema.safeParse({ ...request, isAdmin: true }).success).toBe(false)
  })
})
