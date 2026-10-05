import { expect, type Page } from '@playwright/test'

/** Recoge errores de consola y excepciones (incluidas las violaciones de CSP). */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console.error: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  return errors
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow, 'desbordamiento horizontal en px').toBeLessThanOrEqual(0)
}

export const legalPages = [
  { path: '/aviso-legal', heading: 'Aviso legal' },
  { path: '/privacidad', heading: 'Política de privacidad' },
  { path: '/cookies', heading: 'Política de cookies' },
]

/** El formulario rechaza envíos anteriores a este tiempo (ver MIN_FILL_TIME_MS). */
export const MIN_FILL_WAIT_MS = 2700

/**
 * Congela el reloj del navegador para que la prueba no dependa de lo rápido que se rellene
 * el formulario. `elapse` simula que ha pasado ese tiempo desde que se cargó la página.
 */
export async function freezeClock(page: Page) {
  const start = new Date('2026-06-01T10:00:00Z')
  await page.clock.install({ time: start })
  await page.clock.setFixedTime(start)
  return { elapse: (ms: number) => page.clock.setFixedTime(new Date(start.getTime() + ms)) }
}

export const validMessage = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  message: 'Hola Mary, me gustaría proponerte una colaboración para nuestro podcast.',
}
