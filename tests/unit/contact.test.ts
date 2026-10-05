import { describe, expect, it } from "vitest";
import { contactSchema } from "../../src/lib/contact/schema";
import { ContactRateLimiter } from "../../src/lib/contact/rate-limit";
const valid = {
  name: "  Ana García  ",
  email: " ANA@EXAMPLE.COM ",
  reason: "consulta",
  message: "  Quisiera comentar una consulta sobre convivencia.\r\nGracias.  ",
  privacy: true,
};
describe("contact validation", () => {
  it("normalizes whitespace, email casing, line endings and empty optional fields", () => {
    expect(
      contactSchema.parse({ ...valid, company: "  ", phone: "  " }),
    ).toEqual({
      name: "Ana García",
      email: "ana@example.com",
      reason: "consulta",
      message: "Quisiera comentar una consulta sobre convivencia.\nGracias.",
      privacy: true,
      company: undefined,
      phone: undefined,
      website: "",
      turnstileToken: "",
    });
  });
  it.each([
    { privacy: false },
    { reason: "unknown" },
    { name: "A" },
    { email: "invalid" },
    { message: "short" },
    { message: "a".repeat(4001) },
    { name: "Ana\nInjected" },
    { unexpected: "extra" },
    { phone: "a".repeat(41) },
    { turnstileToken: "a".repeat(2049) },
    { message: "a".repeat(20) + "\u0000" },
  ])("rejects invalid or unexpected input: %j", (changes) => {
    expect(contactSchema.safeParse({ ...valid, ...changes }).success).toBe(
      false,
    );
  });
});
describe("bounded rate limiter", () => {
  it("limits each address and permits it again once the window expires", () => {
    const limiter = new ContactRateLimiter(2, 1000);
    expect(limiter.check("one", 0).allowed).toBe(true);
    expect(limiter.check("one", 10).allowed).toBe(true);
    expect(limiter.check("one", 20)).toEqual({ allowed: false, retryAfter: 1 });
    expect(limiter.check("two", 20).allowed).toBe(true);
    expect(limiter.check("one", 1000).allowed).toBe(true);
  });
  it("rejects new keys at capacity, preserves active limits and prunes expired keys", () => {
    const limiter = new ContactRateLimiter(1, 1000, 2);
    limiter.check("one", 0);
    limiter.check("two", 0);
    expect(limiter.check("three", 1).allowed).toBe(false);
    expect(limiter.check("one", 2).allowed).toBe(false);
    expect(limiter.check("three", 1000).allowed).toBe(true);
  });
});
