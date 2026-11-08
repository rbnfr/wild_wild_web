import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact/schema";
import { createMailDraft } from "@/lib/contact/mail-draft";
import { getDictionary } from "@/content/dictionaries";

const es = getDictionary("es").contact.form.mail;
const en = getDictionary("en").contact.form.mail;
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
      es,
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
  it("labels the draft in the visitor's language", () => {
    const draft = createMailDraft(
      contactSchema.parse(input),
      "mary@example.com",
      en,
    );
    expect(new URL(draft.href).searchParams.get("subject")).toBe(
      "Talk or event — Contact with Mary Granero",
    );
    expect(draft.text).toMatch(/^To: mary@example.com\nSubject: /);
    expect(draft.text).toContain("Name: Ana García");
  });
  it("includes optional contact information and preserves long messages in the copyable fallback", () => {
    const value = contactSchema.parse({
      ...input,
      company: "Asociación & bienestar",
      phone: "+34 123456789",
      message: "á".repeat(4000),
    });
    const draft = createMailDraft(value, "mary@example.com", es);
    expect(draft.text).toContain(value.message);
    expect(draft.text).toContain(value.company);
    expect(draft.text).toContain(value.phone);
    expect(new URL(draft.href).searchParams.get("body")).toContain(
      value.message,
    );
  });
});
