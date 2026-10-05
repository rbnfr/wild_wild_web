import { expect, test, type Page } from '@playwright/test'

import { collectConsoleErrors, freezeClock, MIN_FILL_WAIT_MS, validMessage } from './helpers'

async function openForm(page: Page) {
  await page.goto('/#contacto')
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeVisible()
}

async function fillValidForm(page: Page, reason = 'Prensa o medios') {
  await page.getByText(reason, { exact: true }).click()
  await page.getByLabel('Nombre', { exact: true }).fill(validMessage.name)
  await page.getByLabel('Correo electrónico').fill(validMessage.email)
  await page.getByLabel('Mensaje', { exact: true }).fill(validMessage.message)
  await page.getByLabel(/He leído y acepto/).check()
}

const submit = (page: Page) => page.getByRole('button', { name: /Enviar mensaje|Enviando/ })

test.describe('Formulario de contacto: validación', () => {
  test('un envío vacío muestra un resumen y un error asociado a cada campo', async ({ page }) => {
    await openForm(page)
    await submit(page).click()

    const summary = page.getByRole('heading', { name: 'Hay 5 campos que revisar' })
    await expect(summary).toBeVisible()

    const name = page.getByLabel('Nombre', { exact: true })
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription(/Escribe tu nombre/)
    await expect(page.getByLabel('Correo electrónico')).toHaveAccessibleDescription(
      /correo electrónico/,
    )
    await expect(page.getByLabel('Mensaje', { exact: true })).toHaveAccessibleDescription(
      /mínimo 10 caracteres/,
    )
    await expect(page.getByLabel(/He leído y acepto/)).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Elige un motivo de contacto.').first()).toBeVisible()

    // El foco se mueve al resumen para que los lectores de pantalla lo anuncien.
    await expect(
      page.locator('#contacto [tabindex="-1"]').filter({ hasText: 'Hay 5 campos que revisar' }),
    ).toBeFocused()
  })

  test('los enlaces del resumen llevan el foco al campo con el error', async ({ page }) => {
    await openForm(page)
    await submit(page).click()
    await page.getByRole('link', { name: 'Escribe tu correo electrónico.' }).click()
    await expect(page.getByLabel('Correo electrónico')).toBeFocused()
  })

  test('valida el formato del correo y del teléfono', async ({ page }) => {
    await openForm(page)
    await fillValidForm(page)
    await page.getByLabel('Correo electrónico').fill('no-es-un-correo')
    await page.getByLabel('Teléfono').fill('abc')
    await submit(page).click()

    await expect(page.getByLabel('Correo electrónico')).toHaveAccessibleDescription(
      /correo electrónico válido/,
    )
    await expect(page.getByLabel('Teléfono')).toHaveAttribute('aria-invalid', 'true')
  })

  test('la casilla de privacidad es obligatoria y no está premarcada', async ({ page }) => {
    await openForm(page)
    const privacy = page.getByLabel(/He leído y acepto/)
    await expect(privacy).not.toBeChecked()

    await fillValidForm(page)
    await privacy.uncheck()
    await submit(page).click()
    await expect(
      page.getByText('Debes aceptar la política de privacidad para enviar el mensaje.').first(),
    ).toBeVisible()
  })

  test('los campos opcionales se marcan como tales y el motivo no viene elegido', async ({
    page,
  }) => {
    await openForm(page)
    await expect(page.getByLabel('Empresa u organización')).toHaveAttribute(
      'aria-required',
      'false',
    )
    await expect(page.getByLabel('Teléfono')).toHaveAttribute('aria-required', 'false')
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveAttribute(
      'aria-required',
      'true',
    )
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  })

  test('el campo trampa no es visible ni accesible', async ({ page }) => {
    await openForm(page)
    const trap = page.locator('input[name="website"]')
    await expect(trap).toBeAttached()
    await expect(page.getByRole('textbox', { name: /No rellenes este campo/ })).toHaveCount(0)
    const tabindex = await trap.getAttribute('tabindex')
    expect(tabindex).toBe('-1')
  })
})

test.describe('Formulario de contacto: envío', () => {
  test('envía el mensaje con éxito y anuncia el resultado', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    const clock = await freezeClock(page)
    await openForm(page)
    await fillValidForm(page)
    await clock.elapse(MIN_FILL_WAIT_MS)

    const requests: { body: Record<string, unknown> }[] = []
    page.on('request', (request) => {
      if (request.url().endsWith('/api/contact')) requests.push({ body: request.postDataJSON() })
    })

    await submit(page).click()

    const status = page.getByRole('status').filter({ hasText: 'Mensaje enviado' })
    await expect(status).toBeVisible()
    await expect(status).toContainText('Gracias por escribir')

    expect(requests).toHaveLength(1)
    expect(requests[0]?.body).toMatchObject({
      name: validMessage.name,
      email: validMessage.email,
      reason: 'prensa-medios',
      privacy: true,
      website: '',
    })
    expect(requests[0]?.body.elapsedMs).toBeGreaterThanOrEqual(2500)

    // El formulario se vacía para el siguiente envío.
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('')
    await expect(page.getByLabel(/He leído y acepto/)).not.toBeChecked()
    expect(errors).toEqual([])
  })

  test('muestra "Enviando…" mientras espera y evita envíos duplicados', async ({ page }) => {
    let calls = 0
    await page.route('**/api/contact', async (route) => {
      calls += 1
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.fulfill({
        status: 200,
        json: { ok: true, message: 'Mensaje enviado. Gracias por escribir.' },
      })
    })

    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()
    await submit(page).click({ force: true })

    await expect(page.getByRole('button', { name: 'Enviando…' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await expect(page.getByRole('status').filter({ hasText: 'Enviando tu mensaje' })).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'Mensaje enviado' })).toBeVisible()
    expect(calls).toBe(1)
  })

  test('no borra lo que se escribe mientras el envío está en curso', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.fulfill({
        status: 200,
        json: { ok: true, message: 'Mensaje enviado. Gracias por escribir.' },
      })
    })

    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()
    await expect(page.getByRole('button', { name: 'Enviando…' })).toBeVisible()

    await page.getByLabel('Mensaje', { exact: true }).fill('Otro mensaje distinto, ya en borrador.')
    await expect(page.getByRole('status').filter({ hasText: 'Mensaje enviado' })).toBeVisible()
    await expect(page.getByLabel('Mensaje', { exact: true })).toHaveValue(
      'Otro mensaje distinto, ya en borrador.',
    )
  })

  test('el mensaje no admite más caracteres que el límite', async ({ page }) => {
    await openForm(page)
    await page.getByLabel('Mensaje', { exact: true }).fill('a'.repeat(3100))
    await expect(page.getByText('3000 de 3000 caracteres')).toBeVisible()
  })

  test('un envío demasiado rápido recibe un error claro y se puede reintentar', async ({
    page,
  }) => {
    const clock = await freezeClock(page)
    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()

    const alert = page.locator('#contacto').getByRole('alert')
    await expect(alert).toContainText('demasiado rápido')
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue(validMessage.name)

    await clock.elapse(MIN_FILL_WAIT_MS)
    await submit(page).click()
    await expect(page.getByRole('status').filter({ hasText: 'Mensaje enviado' })).toBeVisible()
    await expect(alert).toBeHidden()
  })

  test('muestra el error del servidor sin perder lo escrito', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 503,
        json: {
          ok: false,
          code: 'unavailable',
          message:
            'No hemos podido enviar tu mensaje en este momento. Inténtalo de nuevo en unos minutos.',
        },
      }),
    )
    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()

    await expect(page.locator('#contacto').getByRole('alert')).toContainText(
      'No hemos podido enviar tu mensaje',
    )
    await expect(page.getByLabel('Mensaje', { exact: true })).toHaveValue(validMessage.message)
    await expect(submit(page)).toBeEnabled()
  })

  test('muestra los errores de campo que devuelve el servidor', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 422,
        json: {
          ok: false,
          code: 'validation',
          message: 'Revisa los campos marcados e inténtalo de nuevo.',
          fieldErrors: { email: ['Este correo no es válido.'] },
        },
      }),
    )
    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()

    await expect(page.getByLabel('Correo electrónico')).toHaveAccessibleDescription(
      /Este correo no es válido/,
    )
    await expect(page.locator('#contacto').getByRole('alert')).toContainText(
      'Revisa los campos marcados',
    )
  })

  test('muestra un error si se cae la conexión', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort('connectionrefused'))
    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()
    await expect(page.locator('#contacto').getByRole('alert')).toContainText(
      'No hemos podido conectar con el servidor',
    )
  })

  test('muestra el límite de frecuencia del servidor', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 429,
        headers: { 'retry-after': '120' },
        json: {
          ok: false,
          code: 'rate_limited',
          message: 'Has enviado demasiados mensajes seguidos. Inténtalo de nuevo más tarde.',
        },
      }),
    )
    await openForm(page)
    await fillValidForm(page)
    await submit(page).click()
    await expect(page.locator('#contacto').getByRole('alert')).toContainText('demasiados mensajes')
  })
})

test.describe('Formulario de contacto: teclado', () => {
  test.beforeEach(({ isMobile }) =>
    test.skip(isMobile, 'El flujo de teclado se prueba en escritorio'),
  )

  test('se puede rellenar y enviar solo con el teclado', async ({ page }) => {
    const clock = await freezeClock(page)
    await openForm(page)

    // Foco en el primer botón de opción del grupo y selección con las flechas.
    await page.getByRole('radio').first().focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: 'Charla o evento' })).toBeChecked()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Nombre', { exact: true })).toBeFocused()
    await page.keyboard.type(validMessage.name)
    await page.keyboard.press('Tab')
    await page.keyboard.type(validMessage.email)
    await page.keyboard.press('Tab') // organización
    await page.keyboard.press('Tab') // teléfono
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Mensaje', { exact: true })).toBeFocused()
    await page.keyboard.type(validMessage.message)
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/He leído y acepto/)).toBeFocused()
    await page.keyboard.press('Space')
    await expect(page.getByLabel(/He leído y acepto/)).toBeChecked()

    await clock.elapse(MIN_FILL_WAIT_MS)
    await page.keyboard.press('Tab') // enlace de política (en nueva pestaña)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(page.getByRole('status').filter({ hasText: 'Mensaje enviado' })).toBeVisible()
    // El botón sigue existiendo y conserva el foco: no se pierde la posición.
    await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeFocused()
  })
})

test.describe('API /api/contact', () => {
  const body = {
    ...validMessage,
    organization: '',
    phone: '',
    reason: 'consulta',
    privacy: true,
    website: '',
    elapsedMs: 5000,
  }

  test('solo acepta POST', async ({ request }) => {
    for (const method of ['get', 'put', 'delete'] as const) {
      const response = await request[method]('/api/contact')
      expect(response.status(), method).toBe(405)
    }
  })

  test('valida en el servidor y no devuelve los datos enviados', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { ...body, email: 'valor-secreto-invalido' },
    })
    expect(response.status()).toBe(422)
    const json = await response.json()
    expect(json).toMatchObject({ ok: false, code: 'validation' })
    expect(JSON.stringify(json)).not.toContain('valor-secreto-invalido')
  })

  test('rechaza contenido que no es JSON y cuerpos enormes', async ({ request }) => {
    const text = await request.post('/api/contact', {
      headers: { 'content-type': 'text/plain' },
      data: 'hola',
    })
    expect(text.status()).toBe(400)

    const big = await request.post('/api/contact', {
      data: { ...body, message: 'x'.repeat(40_000) },
    })
    expect(big.status()).toBe(413)
  })

  test('el honeypot recibe un éxito falso', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { ...body, website: 'https://spam.example' },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toMatchObject({ ok: true })
  })

  test('acepta un mensaje válido en modo de prueba (dry-run) y no cachea la respuesta', async ({
    request,
  }) => {
    const response = await request.post('/api/contact', { data: body })
    expect(response.status()).toBe(200)
    expect(response.headers()['cache-control']).toBe('no-store')
    expect(await response.json()).toMatchObject({ ok: true })
  })
})
