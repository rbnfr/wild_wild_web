import { describe, expect, it } from "vitest";
import { validateContact } from "../../src/lib/contact/schema";
const valid = {
  name: "  Ana García  ",
  email: " ANA@EXAMPLE.COM ",
  reason: "consulta",
  message: "  Quisiera comentar una consulta sobre convivencia.\r\nGracias.  ",
  privacy: true,
};
describe("contact validation", () => {
  it("normalizes whitespace, email casing, line endings and empty optional fields", () => {
    const result = validateContact({ ...valid, company: "  ", phone: "  " });
    expect(result.success && result.data).toEqual({
      name: "Ana García",
      email: "ana@example.com",
      reason: "consulta",
      message: "Quisiera comentar una consulta sobre convivencia.\nGracias.",
      privacy: true,
      company: undefined,
      phone: undefined,
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
    { message: "a".repeat(20) + "\u0000" },
    { email: "a@b" },
    { email: "a..b@example.com" },
    { name: 42 },
  ])("rejects invalid or unexpected input: %j", (changes) => {
    expect(validateContact({ ...valid, ...changes }).success).toBe(false);
  });
  it("reports one error key per invalid field", () => {
    expect(validateContact({})).toEqual({
      success: false,
      errors: {
        name: "nameShort",
        email: "emailInvalid",
        reason: "reasonRequired",
        message: "messageShort",
        privacy: "privacyRequired",
      },
    });
  });
});
