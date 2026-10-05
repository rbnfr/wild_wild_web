import { expect, test } from '@playwright/test'

import { collectConsoleErrors, expectNoHorizontalOverflow, legalPages } from './helpers'

test.describe('Página de inicio', () => {
  test('carga con el contenido esencial y sin errores de consola', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle('Mary Granero | Etóloga de perros y gatos')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')

    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText('Mary')
    await expect(h1).toContainText('Granero')
    await expect(h1).toContainText('Etóloga de perros y gatos')

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Escribir a Mary' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Conocer a Mary' })).toBeVisible()

    for (const name of [
      'Sobre Mary',
      'Ámbitos de contacto',
      'Trayectoria',
      'Libros y publicaciones',
      'Redes y contenido',
      'Prensa y colaboraciones',
      'Contacto',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeAttached()
    }

    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })

  test('los encabezados forman una jerarquía sin saltos', async ({ page }) => {
    await page.goto('/')
    const levels = await page.$$eval('h1, h2, h3, h4', (nodes) =>
      nodes.map((node) => Number(node.tagName[1])),
    )
    let previous = 0
    for (const level of levels) {
      expect(level - previous, `salto de h${previous} a h${level}`).toBeLessThanOrEqual(1)
      previous = level
    }
  })

  test('las imágenes pendientes se identifican como marcadores y no hay imágenes rotas', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('img', { name: /Foto principal pendiente/ })).toBeVisible()
    const broken = await page.$$eval(
      'img',
      (images) => images.filter((image) => image.complete && image.naturalWidth === 0).length,
    )
    expect(broken).toBe(0)
  })

  test('respeta prefers-reduced-motion en la animación de entrada', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const animation = await page
      .locator('.hero-rise')
      .first()
      .evaluate((node) => getComputedStyle(node).animationName)
    expect(animation).toBe('none')
  })

  test('no hay desbordamiento horizontal', async ({ page }) => {
    await page.goto('/')
    await expectNoHorizontalOverflow(page)
  })
})

test.describe('Páginas legales y 404', () => {
  for (const { path, heading } of legalPages) {
    test(`${path} carga con un único h1`, async ({ page }) => {
      const errors = collectConsoleErrors(page)
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page.getByText('Borrador pendiente de revisión legal')).toBeVisible()
      await expectNoHorizontalOverflow(page)
      expect(errors).toEqual([])
    })
  }

  test('una ruta inexistente devuelve 404 con salida clara', async ({ page }) => {
    const response = await page.goto('/no-existe')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página')
    await page.getByRole('link', { name: 'Volver al inicio' }).click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('SEO y datos estructurados', () => {
  test('incluye canonical, Open Graph, Twitter y robots', async ({ page }) => {
    await page.goto('/')
    const meta = (selector: string) => page.locator(selector).first().getAttribute('content')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /^http:\/\/127\.0\.0\.1:3100\/?$/,
    )
    expect(await meta('meta[name="description"]')).toContain(
      'etóloga especializada en perros y gatos',
    )
    expect(await meta('meta[property="og:title"]')).toContain('Mary Granero')
    expect(await meta('meta[property="og:type"]')).toBe('website')
    expect(await meta('meta[property="og:locale"]')).toBe('es_ES')
    expect(await meta('meta[property="og:image"]')).toContain('/opengraph-image')
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image')
    expect(await meta('meta[name="twitter:image"]')).toContain('/twitter-image')
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', /icon\.svg/)
  })

  test('el JSON-LD describe a la persona y al sitio sin datos inventados', async ({ page }) => {
    await page.goto('/')
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent()
    const data = JSON.parse(raw ?? '{}') as { '@graph': Record<string, unknown>[] }
    const types = data['@graph'].map((node) => node['@type'])

    expect(types).toContain('Person')
    expect(types).toContain('WebSite')
    expect(types).not.toContain('Book')
    const person = data['@graph'].find((node) => node['@type'] === 'Person')
    expect(person).toMatchObject({ name: 'Mary Granero', jobTitle: 'Etóloga' })
    expect(person).not.toHaveProperty('sameAs')
  })

  test('las páginas legales publican migas de pan', async ({ page }) => {
    await page.goto('/privacidad')
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(JSON.parse(raw ?? '{}')).toMatchObject({ '@type': 'BreadcrumbList' })
  })

  test('robots.txt y sitemap.xml existen y se corresponden', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    const robotsText = await robots.text()
    expect(robotsText).toContain('Disallow: /api/')
    expect(robotsText).toContain('Sitemap: http://127.0.0.1:3100/sitemap.xml')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const xml = await sitemap.text()
    for (const path of ['/', '/aviso-legal', '/privacidad', '/cookies']) {
      expect(xml).toContain(`<loc>http://127.0.0.1:3100${path}</loc>`)
    }
  })
})

test.describe('Seguridad HTTP', () => {
  test('envía las cabeceras de seguridad y una CSP con nonce', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers() ?? {}

    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['strict-transport-security']).toContain('max-age=')
    expect(headers['cross-origin-opener-policy']).toBe('same-origin')
    expect(headers['x-powered-by']).toBeUndefined()

    const csp = headers['content-security-policy'] ?? ''
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/)
    const nonce = /'nonce-([^']+)'/.exec(csp)?.[1]
    expect(nonce).toBeTruthy()
    // Los navegadores ocultan el valor del nonce en el DOM, así que se comprueba en el HTML recibido.
    expect((await response?.text()) ?? '').toContain(`nonce="${nonce}"`)
  })

  test('cada petición recibe un nonce distinto', async ({ request }) => {
    const nonceOf = async () =>
      /'nonce-([^']+)'/.exec(
        (await request.get('/')).headers()['content-security-policy'] ?? '',
      )?.[1]
    expect(await nonceOf()).not.toBe(await nonceOf())
  })
})
