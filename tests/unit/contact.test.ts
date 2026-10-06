import { describe, expect, it } from "vitest";
import { contactSchema } from "../../src/lib/contact/schema";
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
  ])("rejects invalid or unexpected input: %j", (changes) => {
    expect(contactSchema.safeParse({ ...valid, ...changes }).success).toBe(
      false,
    );
  });
});
