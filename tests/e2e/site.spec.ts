import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getDictionary } from "../../src/content/dictionaries";
import { site } from "../../src/content/site";
import { locales } from "../../src/i18n/config";
import { href, pageIds } from "../../src/i18n/routes";

const es = getDictionary("es");
const en = getDictionary("en");
const pages = locales.flatMap((lang) =>
  pageIds.map((page) => ({ lang, page, path: href(lang, page) })),
);
const paths = pages.map(({ path }) => path);
const wcag = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function openPage(page: Page, path = "/es/") {
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

for (const { lang, page: pageId, path } of pages) {
  test(`${path}: language, metadata, links and accessibility`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await openPage(page, path);
    const t = getDictionary(lang);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
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
      "index, follow",
    );
    for (const code of locales)
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${code}"]`),
      ).toHaveAttribute(
        "href",
        `https://marywildbehavior.com${href(code, pageId)}`,
      );
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveCount(1);
    if (pageId === "home") {
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
        .locator(`a[href^="/${lang}/#"]`)
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!)
            .filter(
              (href) => !document.getElementById(href.split("#")[1] ?? ""),
            ),
        );
      expect(brokenAnchors).toEqual([]);
      // Verify the exported local images, including the lazy-loaded cover.
      for (const image of [
        page.getByRole("img", { name: t.hero.imageAlt }),
        page.locator(".book img"),
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
      await expect(page.locator("#divulgacion .book h4").first()).toHaveText(
        book.name,
      );
      await expect(page.locator("#divulgacion")).toContainText(
        `ISBN: ${book.isbn}`,
      );
      const email = page.locator('#contacto a[href^="mailto:"]');
      await expect(email).toHaveAttribute(
        "href",
        `mailto:${await email.textContent()}`,
      );
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    for (const legal of pages.filter(
      (item) => item.lang === lang && item.page !== "home",
    ))
      await expect(
        page.locator(`footer a[href="${legal.path}"]`),
      ).toBeVisible();
    const result = await new AxeBuilder({ page }).withTags(wcag).analyze();
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

for (const [lang, width] of locales.flatMap((code) =>
  [320, 375, 768, 1024, 1440, 1920].map((size) => [code, size] as const),
)) {
  test(`${lang}: layout fits a ${width}px viewport`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page, href(lang));
    const dimensions = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (width === 375 || width === 1440) {
      const cover = page.locator(".book img");
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
        path: testInfo.outputPath(`home-${lang}-${width}.png`),
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
    navigation.getByRole("link", { name: "Sobre mí" }),
  ).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(navigation).toBeHidden();
  await toggle.click();
  await navigation.getByRole("link", { name: "Sobre mí" }).click();
  await expect(page).toHaveURL(/#sobre-mi$/);
  await expect(navigation).toBeHidden();
  await expect(page.locator("#sobre-mi")).toBeInViewport();
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
  await openPage(page, "/es/#contacto");
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
    (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
  ).toEqual([]);
});

test("contact prepares a complete draft without sending data or claiming delivery", async ({
  page,
}) => {
  await openPage(page, "/es/#contacto");
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
  expect(mail.pathname).toBe("wildbehaviorofficial@gmail.com");
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
    (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
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
  await openPage(page, "/es/#contacto");
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
  // "/" falls back to Spanish through its <noscript> refresh.
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveURL("http://localhost:3000/es/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#divulgacion .book h4").first()).toHaveText(
    "Lo que la ciencia sabe de tu gato",
  );
  await expect(
    page.locator('noscript a[href="mailto:wildbehaviorofficial@gmail.com"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Preparar correo" }),
  ).toBeHidden();
  // The <details> switcher still opens and links to the other language.
  await page.locator(".lang-switcher summary").click();
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("http://localhost:3000/en/");
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
  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    es.hero.title,
  );
  expect(errors).toEqual([]);
  expect((await request.get("/ruta-inexistente/")).status()).toBe(404);
  expect((await request.get("/fr/")).status()).toBe(404);
  for (const legacy of ["/aviso-legal/", "/privacidad", "/cookies/"]) {
    const moved = await request.get(legacy, { maxRedirects: 0 });
    expect(moved.status()).toBe(301);
    expect(moved.headers()["location"]).toBe(
      `/es/${legacy.replaceAll("/", "")}/`,
    );
  }
  expect((await request.post("/api/contact", { data: {} })).status()).toBe(405);
});

test("security headers and crawl endpoints describe the published website", async ({
  request,
}) => {
  const response = await request.get("/es/");
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
  expect(response.headers()["cross-origin-opener-policy"]).toBe("same-origin");
  expect(response.headers()["cache-control"]).toBe("no-cache");
  expect(response.headers()["link"]).toBe("</llms.txt>; rel=describedby");
  const html = await response.text();
  const chunk = html.match(/\/_next\/static\/[^"]+\.js/)![0];
  expect((await request.get(chunk)).headers()["cache-control"]).toContain(
    "immutable",
  );
  const policy = response.headers()["content-security-policy"] ?? "";
  const scriptDirective = policy
    .split(";")
    .find((directive) => directive.trim().startsWith("script-src"))!;
  expect(scriptDirective).toContain("sha256-");
  expect(scriptDirective).not.toContain("unsafe-inline");
  expect(scriptDirective).not.toContain("unsafe-eval");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  const robotsTxt = await robots.text();
  expect(robotsTxt).toMatch(
    /User-Agent: \*\nAllow: \/\nContent-Signal: search=yes, ai-input=yes, ai-train=no/,
  );
  expect(robotsTxt).toMatch(/User-Agent: GPTBot\n[\s\S]*?Disallow: \//);
  expect(await robots.text()).toContain(
    "Sitemap: https://marywildbehavior.com/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  for (const path of paths)
    expect(xml).toContain(`<loc>https://marywildbehavior.com${path}</loc>`);
  expect(
    xml.match(/<lastmod>\d{4}-\d{2}-\d{2}T[^<]+<\/lastmod>/g),
  ).toHaveLength(paths.length);
  const llms = await request.get("/llms.txt");
  expect(llms.ok()).toBeTruthy();
  expect(llms.headers()["content-type"]).toContain("text/plain");
  expect(await llms.text()).toMatch(/^# Mary Granero\n/);
});

test("the photo pile turns in a loop with buttons and swipes, lazily loaded", async ({
  page,
}) => {
  await openPage(page);
  const pile = page.getByRole("group", { name: es.about.photos.label });
  const top = pile.locator(".photo:not([aria-hidden=true]) img");
  const alts = Object.values(es.about.photos.alt);
  // Below the fold: nothing but the hero image is requested eagerly.
  for (const image of await pile.locator("img").all())
    await expect(image).toHaveAttribute("loading", "lazy");
  await pile.scrollIntoViewIfNeeded();
  await expect(top).toHaveAttribute("alt", alts[0]!);
  const next = pile.getByRole("button", { name: es.about.photos.next });
  for (const alt of [...alts.slice(1), alts[0]!]) {
    await next.click();
    await expect(top).toHaveAttribute("alt", alt);
  }
  await pile.getByRole("button", { name: es.about.photos.previous }).click();
  await expect(top).toHaveAttribute("alt", alts.at(-1)!);
  // Dragging to the left turns to the next photograph (back to the first).
  const box = (await pile.locator(".photo-pile").boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
  await page.mouse.up();
  await expect(top).toHaveAttribute("alt", alts[0]!);
  await expect(pile.getByText("1 de 3")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
  ).toEqual([]);
});

test("the photo pile turns by itself and can be paused", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.clock.install();
  await openPage(page);
  const pile = page.getByRole("group", { name: es.about.photos.label });
  const top = pile.locator(".photo:not([aria-hidden=true]) img");
  const alts = Object.values(es.about.photos.alt);
  await page.clock.runFor(site.aboutPhotosInterval + 500);
  await expect(top).toHaveAttribute("alt", alts[1]!);
  await pile.getByRole("button", { name: es.about.photos.pause }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(site.aboutPhotosInterval * 2);
  await expect(top).toHaveAttribute("alt", alts[1]!);
  await expect(
    pile.getByRole("button", { name: es.about.photos.play }),
  ).toBeVisible();
  await context.close();
});

test("service cards carry a lazy photograph and light up under the pointer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page);
  const cards = page.locator(".service");
  await expect(cards.locator("img")).toHaveCount(es.services.items.length);
  for (const image of await cards.locator("img").all()) {
    await expect(image).toHaveAttribute("loading", "lazy");
    await expect(image).toHaveAttribute("alt", /\S/);
  }
  const card = cards.first();
  await card.scrollIntoViewIfNeeded();
  const shadow = () => card.evaluate((e) => getComputedStyle(e).boxShadow);
  const rest = await shadow();
  await card.hover();
  await expect.poll(shadow).not.toBe(rest);
});

test("book cover lifts on pointer hover and keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page);
  const cover = page.locator(".book-cover-inner");
  await cover.scrollIntoViewIfNeeded();
  const transform = () =>
    cover.evaluate((element) => getComputedStyle(element).transform);
  const rest = await transform();
  await page.locator(".book-cover").hover();
  await expect.poll(transform).not.toBe(rest);
  await page.mouse.move(0, 0);
  await expect.poll(transform).toBe(rest);
  await page.locator("#divulgacion .book a").focus();
  await expect.poll(transform).not.toBe(rest);
});

test("touch screens get no hover-only effects and no horizontal overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await openPage(page);
  expect(
    await page.evaluate(
      () => matchMedia("(hover: hover) and (pointer: fine)").matches,
    ),
  ).toBe(false);
  // The arrow next to links must not stay displaced after a tap.
  const arrow = page.locator(".service-link span[aria-hidden]").first();
  const before = await arrow.evaluate((e) => getComputedStyle(e).transform);
  await arrow.tap();
  expect(await arrow.evaluate((e) => getComputedStyle(e).transform)).toBe(
    before,
  );
  await page.locator("#divulgacion").scrollIntoViewIfNeeded();
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await context.close();
});

test("reduced motion disables decorative animation", async ({ page }) => {
  await openPage(page);
  const names = await page
    .locator(".hero-copy h1, .hero-actions, .site-header")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).animationName),
    );
  expect(names.every((name) => name === "none")).toBe(true);
});

for (const [locale, expected] of [
  ["en-US", "/en/"],
  ["es-ES", "/es/"],
  ["fr-FR", "/es/"],
] as const) {
  test(`"/" opens ${expected} for a browser in ${locale}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(`http://localhost:3000${expected}`);
    // Old links to sections keep working.
    await page.goto("/#contacto");
    await expect(page).toHaveURL(`http://localhost:3000${expected}#contacto`);
    await context.close();
  });
}

test("the language switcher keeps the page, shows flags and remembers the choice", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openPage(page, "/en/privacy/");
  const trigger = page.locator(".lang-switcher summary");
  await expect(trigger).toHaveAccessibleName(`${en.common.language}: English`);
  await expect(trigger.locator('img[src="/flags/en.svg"]')).toBeVisible();
  await trigger.click();
  const options = page.getByRole("list", { name: en.common.language });
  await expect(options).toBeVisible();
  await expect(options.getByRole("link", { name: "English" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(options.locator('img[src="/flags/es.svg"]')).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(options).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await options.getByRole("link", { name: "Español" }).click();
  await expect(page).toHaveURL("http://localhost:3000/es/privacidad/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    es.legal.privacy.title,
  );
  // The browser prefers English, but the reader chose Spanish.
  await page.goto("/");
  await expect(page).toHaveURL("http://localhost:3000/es/");
  // Clicking outside closes the list.
  await trigger.click();
  await page.locator("h1").click();
  await expect(
    page.getByRole("list", { name: es.common.language }),
  ).toBeHidden();
  expect(errors).toEqual([]);
  await context.close();
});

test("the switcher shows only the flag in the mobile header and fits 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await openPage(page, "/en/");
  const trigger = page.locator(".lang-switcher summary");
  await expect(trigger).toHaveAccessibleName(`${en.common.language}: English`);
  await expect(trigger.locator(".lang-name")).toHaveCSS("width", "1px");
  await trigger.click();
  await expect(page.getByRole("link", { name: "Español" })).toBeInViewport();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

test("the English contact form validates and drafts in English", async ({
  page,
}) => {
  const form = en.contact.form;
  await openPage(page, "/en/#contacto");
  await page.getByRole("button", { name: form.submit }).click();
  await expect(page.getByRole("status")).toHaveText(form.status.invalid);
  await expect(page.locator("#name-error")).toHaveText(form.errors.nameShort);
  await page.getByLabel(form.fields.name, { exact: false }).fill("Test person");
  await page
    .getByLabel(form.fields.email, { exact: false })
    .fill("qa@example.com");
  await page.getByLabel(form.reason).selectOption("evento");
  await page
    .getByLabel(form.message)
    .fill("I would like information about a talk for our association.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: form.submit }).click();
  await expect(page.getByRole("status")).toHaveText(form.status.ready);
  const mail = new URL(
    (await page
      .getByRole("link", { name: form.draft.open })
      .getAttribute("href"))!,
  );
  expect(mail.searchParams.get("subject")).toBe(
    `${form.mail.reasons.evento} — ${form.mail.subject}`,
  );
  await expect(
    page.locator(`.privacy-field a[href="/en/privacy/"]`),
  ).toBeVisible();
});

test("unknown URLs get a bilingual 404 page", async ({ page }) => {
  const response = await page.goto("/ruta-inexistente/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    es.notFound.title,
  );
  await expect(page.locator('section[lang="en"]')).toContainText(
    en.notFound.title,
  );
});
