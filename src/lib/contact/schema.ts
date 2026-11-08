import { z } from "zod";

// Disable code-generation probes so validation respects the script CSP in the browser.
z.config({ jitless: true });

export const contactReasons = [
  "consulta",
  "contratacion",
  "evento",
  "prensa",
  "editorial",
  "colaboracion",
  "otro",
] as const;
export type ContactReason = (typeof contactReasons)[number];

// Validation messages are keys: the form shows them in the page language.
export const contactErrors = [
  "nameShort",
  "emailInvalid",
  "tooLong",
  "controlChars",
  "reasonRequired",
  "messageShort",
  "messageChars",
  "privacyRequired",
] as const;
export type ContactError = (typeof contactErrors)[number];
const error = (key: ContactError) => key;

const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max, error("tooLong"))
    .regex(/^[^\u0000-\u001f\u007f]*$/, error("controlChars"));
const optionalLine = (max: number) =>
  singleLine(max)
    .optional()
    .transform((value) => value || undefined);
export const contactSchema = z
  .object({
    name: singleLine(100).min(2, error("nameShort")),
    email: singleLine(254)
      .pipe(z.email(error("emailInvalid")))
      .transform((value) => value.toLowerCase()),
    company: optionalLine(150),
    phone: optionalLine(40),
    reason: z.enum(contactReasons, { error: error("reasonRequired") }),
    message: z
      .string()
      .transform((value) => value.replace(/\r\n?/g, "\n").trim())
      .pipe(
        z
          .string()
          .min(20, error("messageShort"))
          .max(4000, error("tooLong"))
          .regex(
            /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]*$/,
            error("messageChars"),
          ),
      ),
    privacy: z.literal(true, { error: error("privacyRequired") }),
  })
  .strict();
export type ContactInput = z.infer<typeof contactSchema>;
