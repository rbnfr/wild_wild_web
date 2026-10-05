import { expect, test } from '@playwright/test'

import { expectNoHorizontalOverflow } from './helpers'

const viewports = [320, 375, 768, 1024, 1440, 1920]
const pages = ['/', '/privacidad']

test.describe('Diseño adaptable', () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, 'Cada prueba fija su propio ancho'))
  test.use({ reducedMotion: 'reduce' })

  for (const width of viewports) {
    for (const path of pages) {
      test(`${path} a ${width}px: sin desbordamiento y con el contenido visible`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        await page.waitForLoadState('networkidle')

        await expectNoHorizontalOverflow(page)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

        // La navegación en línea aparece desde 1024 px; por debajo, el botón de menú.
        if (path === '/') {
          const inline = page.getByRole('navigation', { name: 'Principal' })
          const menu = page.getByRole('button', { name: 'Menú' })
          if (width >= 1024) {
            await expect(inline).toBeVisible()
            await expect(menu).toBeHidden()
          } else {
            await expect(inline).toBeHidden()
            await expect(menu).toBeVisible()
          }
        }

        // Ningún elemento visible sobresale de la ventana por la derecha.
        const overflowing = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>('body *')]
            .filter((element) => {
              const rect = element.getBoundingClientRect()
              const style = getComputedStyle(element)
              return (
                rect.width > 0 &&
                style.position !== 'fixed' &&
                !element.closest('[aria-hidden="true"]') &&
                rect.right > window.innerWidth + 1
              )
            })
            .map((element) => `${element.tagName.toLowerCase()}.${element.className}`.slice(0, 80)),
        )
        expect(overflowing).toEqual([])

        await page.screenshot({
          path: testInfo.outputPath(`${path === '/' ? 'inicio' : 'privacidad'}-${width}.png`),
          fullPage: true,
        })
      })
    }
  }

  test('los botones y enlaces principales tienen al menos 44 px de alto en móvil', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    const small = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          'main a.rounded-full, main button, header a.rounded-full, main input[type="radio"] + span',
        ),
      ]
        .map((element) => ({
          name: (element.textContent ?? '').trim().slice(0, 40),
          height: element.getBoundingClientRect().height,
        }))
        .filter((item) => item.height > 0 && item.height < 44),
    )
    expect(small).toEqual([])
  })
})
