import { expect, test } from '@playwright/test'

import { collectConsoleErrors, legalPages } from './helpers'

test.describe('Navegación de escritorio', () => {
  test.beforeEach(({ isMobile }) =>
    test.skip(isMobile, 'La navegación en línea solo existe en escritorio'),
  )

  const targets = [
    { link: 'Sobre Mary', id: 'sobre-mary' },
    { link: 'Trayectoria', id: 'trayectoria' },
    { link: 'Libros', id: 'libros' },
    { link: 'Redes y contenido', id: 'redes' },
    { link: 'Contacto', id: 'contacto' },
  ]

  for (const { link, id } of targets) {
    test(`el enlace "${link}" lleva a #${id}`, async ({ page }) => {
      await page.goto('/')
      await page
        .getByRole('navigation', { name: 'Principal' })
        .getByRole('link', { name: link, exact: true })
        .click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeInViewport()
    })
  }

  test('el botón principal de la cabecera lleva al formulario', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Contactar' })
      .click()
    await expect(page).toHaveURL(/#contacto$/)
    await expect(page.locator('#contacto')).toBeInViewport()
  })

  test('el menú móvil no es accesible en escritorio', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Menú' })).toBeHidden()
  })
})

test.describe('Menú móvil', () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, 'Solo en pantallas táctiles estrechas'))

  test('se abre, expone la navegación y se cierra al elegir un destino', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menú' })
    const menu = page.getByRole('navigation', { name: 'Menú móvil' })

    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(menu).toBeHidden()

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(menu).toBeVisible()
    for (const name of [
      'Inicio',
      'Sobre Mary',
      'Trayectoria',
      'Libros',
      'Redes y contenido',
      'Contacto',
      'Contactar',
    ]) {
      await expect(menu.getByRole('link', { name, exact: true })).toBeVisible()
    }

    await menu.getByRole('link', { name: 'Trayectoria' }).click()
    await expect(menu).toBeHidden()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page).toHaveURL(/#trayectoria$/)
  })

  test('Escape cierra el menú y devuelve el foco al botón', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menú' })
    await toggle.click()
    await expect(page.getByRole('navigation', { name: 'Menú móvil' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Menú móvil' })).toBeHidden()
    await expect(toggle).toBeFocused()
  })

  test('los destinos del botón y de los enlaces tienen un área táctil suficiente', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Menú' }).click()
    const boxes = await page
      .getByRole('navigation', { name: 'Menú móvil' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getBoundingClientRect().height))
    for (const height of boxes) expect(height).toBeGreaterThanOrEqual(44)
  })
})

test.describe('Enlaces principales', () => {
  test('los enlaces del pie llevan a las páginas legales', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.goto('/')
    const footer = page.getByRole('contentinfo')

    for (const { path, heading } of legalPages) {
      await footer.locator(`a[href="${path}"]`).click()
      await expect(page).toHaveURL(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      await page.goBack()
    }
    expect(errors).toEqual([])
  })

  test('el logotipo vuelve al inicio desde una página interior', async ({ page }) => {
    await page.goto('/privacidad')
    await page.getByRole('link', { name: 'Mary Granero, ir al inicio' }).click()
    await expect(page).toHaveURL('/')
  })

  test('todos los enlaces internos de la home responden', async ({ page, request }) => {
    await page.goto('/')
    const hrefs = await page.$$eval('a[href]', (links) =>
      [...new Set(links.map((link) => link.getAttribute('href') ?? ''))].filter(
        (href) => href.startsWith('/') && !href.startsWith('/#'),
      ),
    )
    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      const status = (await request.get(href.split('#')[0] ?? href)).status()
      expect(status, href).toBe(200)
    }
  })

  test('los enlaces de "¿Cuál es tu caso?" preseleccionan el motivo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Trabajas en un medio o una editorial' }).click()
    await expect(page).toHaveURL(/motivo=prensa-medios#contacto$/)
    await expect(page.getByRole('radio', { name: 'Prensa o medios' })).toBeChecked()
  })

  test('los enlaces de ámbitos y colaboraciones preseleccionan su motivo', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Escribir sobre este ámbito (Charlas y formación)' })
      .click()
    await expect(page.getByRole('radio', { name: 'Charla o evento' })).toBeChecked()

    await page.goto('/')
    await page.getByRole('link', { name: 'Enviar una propuesta (Editoriales)' }).click()
    await expect(page.getByRole('radio', { name: 'Editorial' })).toBeChecked()
  })

  test('un motivo desconocido en la URL se ignora', async ({ page }) => {
    await page.goto('/?motivo=otra-cosa#contacto')
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  })
})
