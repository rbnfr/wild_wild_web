import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/aviso-legal/", "/privacidad/", "/cookies/"];

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
    request,
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
      `https://marywildbehavior.com${path}`,
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
      const imageUrl = new URL(
        (await page
          .locator('meta[property="og:image"]')
          .getAttribute("content"))!,
      );
      const imageResponse = await request.get(
        imageUrl.pathname + imageUrl.search,
      );
      expect(imageResponse.status()).toBe(200);
      expect(imageResponse.headers()["content-type"]).toContain("image/png");
      expect((await imageResponse.body()).subarray(0, 8)).toEqual(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );
      const brokenAnchors = await page
        .locator('a[href^="/#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!)
            .filter((href) => !document.getElementById(href.split("#")[1])),
        );
      expect(brokenAnchors).toEqual([]);
      // Verify the exported local images, including the lazy-loaded cover.
      for (const image of [
        page.getByRole("img", { name: /^Retrato de Mary/ }),
        page.getByRole("img", { name: /^Portada de/ }),
      ]) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toBeVisible();
        await expect
          .poll(() =>
            image.evaluate(
              (element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      const graph = JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent())!,
      )["@graph"] as { "@type": string; name: string; isbn?: string }[];
      const book = graph.find((entry) => entry["@type"] === "Book")!;
      await expect(page.locator("#libros h3").first()).toHaveText(book.name);
      await expect(page.locator("#libros")).toContainText(`ISBN: ${book.isbn}`);
      const email = page.locator('#contacto a[href^="mailto:"]');
      await expect(email).toHaveAttribute(
        "href",
        `mailto:${await email.textContent()}`,
      );
      await page.evaluate(() => window.scrollTo(0, 0));
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
      const cover = page.getByRole("img", { name: /^Portada de/ });
      await cover.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          cover.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
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
  await page.getByRole("button", { name: "Preparar correo" }).click();
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
    "Revisa los campos indicados antes de preparar el correo.",
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

test("contact prepares a complete draft without sending data or claiming delivery", async ({
  page,
}) => {
  await openPage(page, "/#contacto");
  const transmissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") transmissions.push(request.url());
  });
  await fillContact(page);
  await page.getByLabel("Empresa u organización").fill("Asociación & gatos");
  await page.getByRole("button", { name: "Preparar correo" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Borrador preparado. Todavía no se ha enviado ningún correo.",
  );
  const link = page.getByRole("link", {
    name: "Abrir mi aplicación de correo",
  });
  const mail = new URL((await link.getAttribute("href"))!);
  expect(mail.protocol).toBe("mailto:");
  expect(mail.pathname).toBe("mdolores.granfer@gmail.com");
  expect(mail.searchParams.get("body")).toContain("Asociación & gatos");
  expect(mail.searchParams.get("body")).toContain("qa@example.com");
  await expect(page.getByLabel("Borrador para copiar")).toHaveValue(
    /Persona de prueba/,
  );
  await expect(page.getByLabel("Nombre", { exact: false })).toHaveValue(
    "Persona de prueba",
  );
  expect(transmissions).toEqual([]);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.setViewportSize({ width: 320, height: 812 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page.screenshot({
    path: "test-results/contact-draft-320.png",
    fullPage: true,
  });
  await page
    .getByLabel("Tu mensaje")
    .fill("Este es un mensaje nuevo que sustituye al anterior.");
  await expect(link).toHaveCount(0);
});

test("copying a draft works and retains the manual fallback when clipboard access fails", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await openPage(page, "/#contacto");
  await fillContact(page);
  await page.getByRole("button", { name: "Preparar correo" }).click();
  await page.getByRole("button", { name: "Copiar borrador" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Persona de prueba",
  );
  await expect(page.getByRole("status")).toContainText("Borrador copiado.");
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: async () => {
        throw new Error("Denied");
      },
    });
  });
  await page.getByRole("button", { name: "Copiar borrador" }).click();
  await expect(page.getByLabel("Borrador para copiar")).toBeFocused();
  await expect(page.getByRole("status")).toContainText("copies manualmente");
});

test("static pages preserve content and direct email without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#libros h3").first()).toHaveText(
    "Lo que la ciencia sabe de tu gato",
  );
  await expect(
    page.locator('noscript a[href="mailto:mdolores.granfer@gmail.com"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Preparar correo" }),
  ).toBeHidden();
  await context.close();
});

test("static links work under the exported CSP and unknown URLs return 404", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await openPage(page);
  await page.getByRole("link", { name: "Aviso legal", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Aviso legal",
  );
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Comprenderles cambia la forma de convivir.",
  );
  expect(errors).toEqual([]);
  expect((await request.get("/ruta-inexistente/")).status()).toBe(404);
  expect((await request.post("/api/contact", { data: {} })).status()).toBe(405);
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
  const policy = response.headers()["content-security-policy"];
  const scriptDirective = policy
    .split(";")
    .find((directive) => directive.trim().startsWith("script-src"))!;
  expect(scriptDirective).toContain("sha256-");
  expect(scriptDirective).not.toContain("unsafe-inline");
  expect(scriptDirective).not.toContain("unsafe-eval");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Disallow: /");
  expect(await robots.text()).toContain(
    "Sitemap: https://marywildbehavior.com/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  for (const path of paths)
    expect(xml).toContain(`<loc>https://marywildbehavior.com${path}</loc>`);
});
