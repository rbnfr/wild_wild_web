import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact/schema";
import { createMailDraft } from "@/lib/contact/mail-draft";

const input = {
  name: "Ana García",
  email: "ana@example.com",
  reason: "evento",
  message:
    "¿Podríamos hablar de gatos? & perros = convivencia.\nSegunda línea.",
  privacy: true,
};
describe("mail draft", () => {
  it("round-trips accents, special characters and line breaks without query injection", () => {
    const draft = createMailDraft(
      contactSchema.parse(input),
      "mary@example.com",
    );
    const url = new URL(draft.href);
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("mary@example.com");
    expect([...url.searchParams.keys()]).toEqual(["subject", "body"]);
    expect(url.searchParams.get("subject")).toBe(
      "Charla o evento — Contacto con Mary Granero",
    );
    expect(url.searchParams.get("body")).toContain(input.message);
    expect(draft.text).toContain("Nombre: Ana García");
  });
  it("includes optional contact information and preserves long messages in the copyable fallback", () => {
    const value = contactSchema.parse({
      ...input,
      company: "Asociación & bienestar",
      phone: "+34 123456789",
      message: "á".repeat(4000),
    });
    const draft = createMailDraft(value, "mary@example.com");
    expect(draft.text).toContain(value.message);
    expect(draft.text).toContain(value.company);
    expect(draft.text).toContain(value.phone);
    expect(new URL(draft.href).searchParams.get("body")).toContain(
      value.message,
    );
  });
});
