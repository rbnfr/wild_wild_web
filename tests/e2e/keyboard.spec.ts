import { expect, test } from '@playwright/test'

test.describe('Navegación por teclado', () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, 'El teclado se prueba en escritorio'))

  test('el primer Tab llega al enlace de salto y este lleva al contenido', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const skip = page.getByRole('link', { name: 'Saltar al contenido principal' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()

    await page.keyboard.press('Enter')
    await expect(page.getByRole('main')).toBeFocused()
    await page.keyboard.press('Tab')
    // El siguiente foco queda dentro del contenido, no en la cabecera.
    const insideMain = await page.evaluate(() => Boolean(document.activeElement?.closest('main')))
    expect(insideMain).toBe(true)
  })

  test('el orden de tabulación recorre cabecera y contenido de forma lógica', async ({ page }) => {
    await page.goto('/')
    const order: string[] = []
    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press('Tab')
      order.push(
        await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null
          return (element?.getAttribute('aria-label') ?? element?.textContent ?? '')
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 40)
        }),
      )
    }

    expect(order.slice(0, 9)).toEqual([
      'Saltar al contenido principal',
      'Mary Granero, ir al inicio',
      'Inicio',
      'Sobre Mary',
      'Trayectoria',
      'Libros',
      'Redes y contenido',
      'Contacto',
      'Contactar',
    ])
  })

  test('el foco es siempre visible', async ({ page }) => {
    await page.goto('/')
    for (let step = 0; step < 14; step += 1) {
      await page.keyboard.press('Tab')
      const outline = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement as Element)
        return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }
      })
      expect(outline.style).not.toBe('none')
      expect(outline.width).toBeGreaterThanOrEqual(2)
    }
  })

  test('Enter en un enlace de la cabecera desplaza a la sección', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Libros' })
      .focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#libros$/)
    await expect(page.locator('#libros')).toBeInViewport()
  })
})

test.describe('Menú móvil con teclado', () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, 'Solo en móvil'))

  test('el botón se activa con Enter y los enlaces quedan en el orden de tabulación', async ({
    page,
  }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menú' })
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Tab')
    await expect(
      page.getByRole('navigation', { name: 'Menú móvil' }).getByRole('link', { name: 'Inicio' }),
    ).toBeFocused()
  })
})
