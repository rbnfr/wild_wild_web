import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of ["/", "/privacidad", "/aviso-legal", "/cookies"]) {
    const response = await page.goto(`http://localhost:3000${path}`);
    await page.waitForLoadState("networkidle");
    assert.equal(response.status(), 200);
    const csp = response.headers()["content-security-policy"];
    assert.ok(csp.includes("nonce-"));
    assert.ok(!csp.includes("unsafe-eval"));
    assert.ok(
      response
        .headers()
        ["strict-transport-security"].includes("max-age=31536000"),
    );
  }
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");
  await fs.mkdir("test-results/production", { recursive: true });
  await page.screenshot({
    path: "test-results/production/desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await page.getByRole("status").waitFor();
  assert.equal(
    await page.getByRole("status").textContent(),
    "Revisa los campos indicados antes de enviar.",
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Menú" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Cerrar" })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  await page.screenshot({
    path: "test-results/production/mobile.png",
    fullPage: true,
  });
  const response = await page.request.post(
    "http://localhost:3000/api/contact",
    {
      headers: { Origin: "http://localhost:3000" },
      data: {
        name: "Persona de prueba",
        email: "qa@example.com",
        reason: "consulta",
        message: "Consulta de prueba sin correo real.",
        privacy: true,
        website: "",
        turnstileToken: "",
      },
    },
  );
  assert.equal(response.status(), 503);
  assert.equal((await response.json()).ok, false);
  assert.deepEqual(errors, []);
  console.log(
    "Production smoke passed: pages, CSP, HSTS, hydration, mobile menu, no fake email success, console.",
  );
} finally {
  await browser.close();
}
