import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import { legalPages } from './helpers'

// Con movimiento reducido no hay animaciones a medias que falseen los cálculos de contraste.
test.use({ reducedMotion: 'reduce' })

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()

  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 3).map((node) => node.target.join(' ')),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
}

test.describe('Accesibilidad automatizada (axe, WCAG 2.2 AA)', () => {
  test('la página de inicio no tiene violaciones', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expectNoViolations(page)
  })

  for (const { path } of legalPages) {
    test(`${path} no tiene violaciones`, async ({ page }) => {
      await page.goto(path)
      await expectNoViolations(page)
    })
  }

  test('la página 404 no tiene violaciones', async ({ page }) => {
    await page.goto('/no-existe')
    await expectNoViolations(page)
  })

  test('el formulario con errores de validación no tiene violaciones', async ({ page }) => {
    await page.goto('/#contacto')
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect(page.getByRole('heading', { name: /campos que revisar/ })).toBeVisible()
    await expectNoViolations(page)
  })

  test('el menú móvil abierto no tiene violaciones', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Solo en móvil')
    await page.goto('/')
    await page.getByRole('button', { name: 'Menú' }).click()
    await expect(page.getByRole('navigation', { name: 'Menú móvil' })).toBeVisible()
    await expectNoViolations(page)
  })
})
