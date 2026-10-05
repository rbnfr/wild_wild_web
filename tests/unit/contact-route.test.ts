import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleContact } from "../../src/lib/contact/handler";
import { ContactRateLimiter } from "../../src/lib/contact/rate-limit";
const valid = {
  name: "Ana García",
  email: "ana@example.com",
  reason: "consulta",
  message: "Quisiera consultar sobre la convivencia con mis animales.",
  privacy: true,
  website: "",
  turnstileToken: "token",
};
function request(
  body: unknown = valid,
  headers: Record<string, string> = {},
  method = "POST",
) {
  return new Request("https://mary.example/api/contact", {
    method,
    headers: {
      Origin: "https://mary.example",
      "Content-Type": "application/json",
      ...headers,
    },
    ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
  });
}
const run = (req = request()) => handleContact(req, new ContactRateLimiter());
const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("CONTACT_EMAIL_MODE", "live");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://mary.example");
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "form@mary.example");
  vi.stubEnv("CONTACT_TO_EMAIL", "contact@mary.example");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("CONTACT_TRUST_PROXY", "false");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
function verified(
  result: object = {
    success: true,
    hostname: "mary.example",
    action: "contact",
  },
) {
  fetchMock.mockResolvedValueOnce(Response.json(result));
}
describe("contact handler", () => {
  it("verifies anti-bot and sends a text email with fixed subject and normalized reply address", async () => {
    verified();
    fetchMock.mockResolvedValueOnce(Response.json({ id: "email-id" }));
    const response = await run(
      request({
        ...valid,
        email: " ANA@EXAMPLE.COM ",
        message: "<b>This stays plain text with enough content.</b>",
      }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, mode: "live" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    const options = fetchMock.mock.calls[1][1];
    const email = JSON.parse(String(options?.body));
    expect(email).toMatchObject({
      reply_to: "ana@example.com",
      subject: "Contacto web · Consulta",
      to: ["contact@mary.example"],
    });
    expect(email.text).toContain("<b>This stays plain text");
    expect(email).not.toHaveProperty("html");
  });
  it("has an explicit local mock without calling providers", async () => {
    vi.stubEnv("CONTACT_EMAIL_MODE", "mock");
    const response = await run();
    expect(await response.json()).toMatchObject({ ok: true, mode: "mock" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("never bypasses real delivery in production even if mock is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTACT_EMAIL_MODE", "mock");
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await run()).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("requires a canonical production origin", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect((await run()).status).toBe(503);
  });
  it.each([
    ["missing origin", { Origin: "" }, 403],
    ["foreign origin", { Origin: "https://attacker.example" }, 403],
    ["wrong content type", { "Content-Type": "text/plain" }, 415],
    ["oversize content length", { "Content-Length": "17000" }, 413],
  ])("rejects %s before provider calls", async (_, headers, status) => {
    expect(
      (await run(request(valid, headers as Record<string, string>))).status,
    ).toBe(status);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("enforces the streamed body limit even without content length", async () => {
    const response = await run(
      new Request("https://mary.example/api/contact", {
        method: "POST",
        headers: {
          Origin: "https://mary.example",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...valid, message: "x".repeat(17000) }),
      }),
    );
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON and other methods", async () => {
    const malformed = new Request("https://mary.example/api/contact", {
      method: "POST",
      headers: {
        Origin: "https://mary.example",
        "Content-Type": "application/json",
      },
      body: "{",
    });
    expect((await run(malformed)).status).toBe(400);
    expect((await run(request(valid, {}, "GET"))).status).toBe(405);
  });
  it("returns field validation errors and rejects honeypot without sending", async () => {
    const response = await run(request({ ...valid, privacy: false }));
    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({
      errors: { privacy: expect.any(Array) },
    });
    expect(
      (await run(request({ ...valid, website: "bot.example" }))).status,
    ).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([
    { success: false, hostname: "mary.example", action: "contact" },
    { success: true, hostname: "attacker.example", action: "contact" },
    { success: true, hostname: "mary.example", action: "other" },
  ])("rejects failed or mismatched Turnstile responses", async (result) => {
    verified(result);
    expect((await run()).status).toBe(422);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("requires a token and configured providers", async () => {
    expect((await run(request({ ...valid, turnstileToken: "" }))).status).toBe(
      422,
    );
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect((await run()).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("returns a safe error when delivery fails or times out", async () => {
    verified();
    fetchMock.mockResolvedValueOnce(
      Response.json({ message: "internal provider detail" }, { status: 500 }),
    );
    const response = await run();
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("internal");
    fetchMock.mockRejectedValueOnce(new Error("private connection detail"));
    const timeout = await run();
    expect(timeout.status).toBe(503);
    expect(JSON.stringify(await timeout.json())).not.toContain("private");
  });
  it("does not trust arbitrary IP headers by default", async () => {
    vi.stubEnv("CONTACT_EMAIL_MODE", "mock");
    const limiter = new ContactRateLimiter(1);
    expect(
      (
        await handleContact(
          request(valid, { "x-forwarded-for": "1.1.1.1" }),
          limiter,
        )
      ).status,
    ).toBe(200);
    const response = await handleContact(
      request(valid, { "x-forwarded-for": "2.2.2.2" }),
      limiter,
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });
  it("separates IP buckets only with the trusted-proxy opt-in", async () => {
    vi.stubEnv("CONTACT_EMAIL_MODE", "mock");
    vi.stubEnv("CONTACT_TRUST_PROXY", "true");
    const limiter = new ContactRateLimiter(1);
    expect(
      (
        await handleContact(
          request(valid, { "x-forwarded-for": "1.1.1.1" }),
          limiter,
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await handleContact(
          request(valid, { "x-forwarded-for": "2.2.2.2" }),
          limiter,
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await handleContact(
          request(valid, { "x-forwarded-for": "1.1.1.1" }),
          limiter,
        )
      ).status,
    ).toBe(429);
  });
});
