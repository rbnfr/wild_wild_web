// Se eliminan caracteres de control (salvo tabulador y saltos de línea) y los de
// dirección de texto o anchura cero que se usan para falsificar contenido.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g
const SPOOFING_CHARS = /[\u200B\u202A-\u202E\u2066-\u2069\uFEFF]/g

function stripUnsafeChars(value: string): string {
  return value.normalize('NFC').replace(CONTROL_CHARS, '').replace(SPOOFING_CHARS, '')
}

/** Texto de una línea: sin saltos, con espacios colapsados. Evita inyección de cabeceras. */
export function normalizeSingleLine(value: string): string {
  return stripUnsafeChars(value).replace(/\s+/g, ' ').trim()
}

/** Texto de varias líneas: saltos unificados y como máximo una línea en blanco seguida. */
export function normalizeMultiline(value: string): string {
  return stripUnsafeChars(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
