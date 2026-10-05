import { describe, expect, it } from 'vitest'

import { normalizeMultiline, normalizeSingleLine } from './normalize'

describe('normalizeSingleLine', () => {
  it('recorta y colapsa espacios', () => {
    expect(normalizeSingleLine('  Mary   Granero \t ')).toBe('Mary Granero')
  })

  it('elimina saltos de línea para impedir inyección de cabeceras', () => {
    expect(normalizeSingleLine('Mary\r\nBcc: spam@example.com')).toBe('Mary Bcc: spam@example.com')
  })

  it('elimina caracteres de control y de dirección de texto', () => {
    expect(normalizeSingleLine('Ma\u0000ry\u202E Gra\u200Bnero')).toBe('Mary Granero')
  })

  it('normaliza Unicode a NFC', () => {
    expect(normalizeSingleLine('Cafe\u0301')).toBe('Café')
  })
})

describe('normalizeMultiline', () => {
  it('unifica saltos de línea y limita las líneas en blanco', () => {
    expect(normalizeMultiline('a\r\nb\r\n\r\n\r\n\r\nc')).toBe('a\nb\n\nc')
  })

  it('quita espacios al final de cada línea y recorta', () => {
    expect(normalizeMultiline('  hola   \nmundo \t\n')).toBe('hola\nmundo')
  })

  it('conserva emojis y tildes', () => {
    expect(normalizeMultiline('¡Hola, Mary! 🐶🐱')).toBe('¡Hola, Mary! 🐶🐱')
  })

  it('elimina caracteres de control salvo saltos de línea', () => {
    expect(normalizeMultiline('a\u0007b\nc')).toBe('ab\nc')
  })
})
