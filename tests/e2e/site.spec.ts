import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/aviso-legal", "/privacidad", "/cookies"];

async function openPage(page: Page, path = "/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function fillContact(page: Page) {
  await page.getByLabel("Nombre", { exact: false }).fill("Persona de prueba");
  await page.getByLabel("Email", { exact: false }).fill("qa@example.com");
  await page.getByLabel("Motivo de contacto").selectOption("evento");
  await page
    .getByLabel("Tu mensaje")
    .fill(
      "Me gustaría recibir información sobre una charla para nuestra asociación.",
    );
  await page.getByRole("checkbox").check();
}

for (const path of paths) {
  test(`${path}: Spanish semantics, metadata, links and accessibility`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await openPage(page, path);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(/Mary Granero/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S.{30}/,
    );
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(new URL(canonical!).href).toBe(
      `http://localhost:3000${path === "/" ? "/" : path}`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    if (path === "/") {
      const brokenAnchors = await page
        .locator('a[href^="/#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!)
            .filter((href) => !document.getElementById(href.split("#")[1])),
        );
      expect(brokenAnchors).toEqual([]);
    }
    for (const legalPath of paths.slice(1))
      await expect(page.locator(`footer a[href="${legalPath}"]`)).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    const labelResult = await new AxeBuilder({ page })
      .withRules(["label-content-name-mismatch"])
      .analyze();
    expect(labelResult.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("each public page has a distinct title and description", async ({
  page,
}) => {
  const titles: string[] = [];
  const descriptions: string[] = [];
  for (const path of paths) {
    await openPage(page, path);
    titles.push(await page.title());
    descriptions.push(
      (await page.locator('meta[name="description"]').getAttribute("content"))!,
    );
  }
  expect(new Set(titles).size).toBe(paths.length);
  expect(new Set(descriptions).size).toBe(paths.length);
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`layout fits a ${width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page);
    const dimensions = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (width === 375 || width === 1440) {
      await page.screenshot({
        path: testInfo.outputPath(`home-${width}.png`),
        fullPage: true,
      });
    }
  });
}

test("mobile navigation supports keyboard, Escape, focus restoration and section navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openPage(page);
  const toggle = page.getByRole("button", { name: "Menú" });
  const navigation = page.getByRole("navigation", {
    name: "Navegación principal",
  });
  await expect(navigation).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Cerrar" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.keyboard.press("Tab");
  await expect(
    navigation.getByRole("link", { name: "Sobre Mary" }),
  ).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(navigation).toBeHidden();
  await toggle.click();
  await navigation.getByRole("link", { name: "Sobre Mary" }).click();
  await expect(page).toHaveURL(/#sobre-mary$/);
  await expect(navigation).toBeHidden();
  await expect(page.locator("#sobre-mary")).toBeInViewport();
});

test("keyboard skip link moves focus to main content", async ({ page }) => {
  await openPage(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("contact validation associates inline errors and focuses the first invalid field", async ({
  page,
}) => {
  await openPage(page, "/#contacto");
  let apiRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/contact")) apiRequests++;
  });
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByLabel("Nombre", { exact: false })).toBeFocused();
  for (const id of ["name", "email", "reason", "message", "privacy"]) {
    await expect(page.locator(`#${id}`)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator(`#${id}`)).toHaveAttribute(
      "aria-describedby",
      new RegExp(`${id}-error`),
    );
    await expect(page.locator(`#${id}-error`)).toBeVisible();
  }
  await expect(page.getByRole("status")).toHaveText(
    "Revisa los campos indicados antes de enviar.",
  );
  expect(apiRequests).toBe(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("contact submits to the real local API in mock mode and reports no email delivery", async ({
  page,
}) => {
  await openPage(page, "/#contacto");
  await fillContact(page);
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/contact") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ ok: true, mode: "mock" });
  await expect(page.getByRole("status")).toHaveText(
    "Prueba local completada. No se ha enviado ningún correo.",
  );
  await expect(page.getByLabel("Nombre", { exact: false })).toHaveValue("");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
});

test("contact retains user input when the server is unavailable", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        message: "Servicio temporalmente no disponible. Inténtalo más tarde.",
      }),
    }),
  );
  await openPage(page, "/#contacto");
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Servicio temporalmente no disponible. Inténtalo más tarde.",
  );
  await expect(page.getByLabel("Nombre", { exact: false })).toHaveValue(
    "Persona de prueba",
  );
  await expect(
    page.getByRole("button", { name: "Enviar mensaje" }),
  ).toBeEnabled();
});

test("security headers and crawl endpoints describe the draft website", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(response.headers()["content-security-policy"]).toContain(
    "object-src 'none'",
  );
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Disallow: /");
  expect(await robots.text()).toContain(
    "Sitemap: http://localhost:3000/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  for (const path of paths)
    expect(xml).toContain(
      `<loc>http://localhost:3000${path === "/" ? "/" : path}</loc>`,
    );
});
