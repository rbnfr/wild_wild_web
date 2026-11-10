// Dependency-free validation: the form is seven fields, so a schema library
// would only add weight to the browser bundle.

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

export const contactFields = [
  "name",
  "email",
  "company",
  "phone",
  "reason",
  "message",
  "privacy",
] as const;
export type ContactField = (typeof contactFields)[number];

export const contactLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 150 },
  phone: { max: 40 },
  message: { min: 20, max: 4000 },
} as const;

export type ContactInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  reason: ContactReason;
  message: string;
  privacy: true;
};

export type ContactResult =
  | { success: true; data: ContactInput }
  | { success: false; errors: Partial<Record<ContactField, ContactError>> };

// Single-line fields reject every control character (no header injection in
// the mail draft); the message keeps tabs and line breaks only.
const CONTROL = /[\u0000-\u001f\u007f]/;
const MESSAGE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const EMAIL =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-.]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

const text = (value: unknown) => (typeof value === "string" ? value : "");

function line(value: unknown, max: number): [string, ContactError?] {
  const clean = text(value).trim();
  if (clean.length > max) return [clean, "tooLong"];
  if (CONTROL.test(clean)) return [clean, "controlChars"];
  return [clean];
}

export function validateContact(input: unknown): ContactResult {
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const errors: Partial<Record<ContactField, ContactError>> = {};
  const unexpected = Object.keys(raw).some(
    (key) => !contactFields.includes(key as ContactField),
  );

  const [name, nameError] = line(raw.name, contactLimits.name.max);
  if (nameError) errors.name = nameError;
  else if (name.length < contactLimits.name.min) errors.name = "nameShort";

  const [email, emailError] = line(raw.email, contactLimits.email.max);
  if (emailError) errors.email = emailError;
  else if (!EMAIL.test(email)) errors.email = "emailInvalid";

  const [company, companyError] = line(raw.company, contactLimits.company.max);
  if (companyError) errors.company = companyError;
  const [phone, phoneError] = line(raw.phone, contactLimits.phone.max);
  if (phoneError) errors.phone = phoneError;

  const reason = contactReasons.find((item) => item === raw.reason);
  if (!reason) errors.reason = "reasonRequired";

  const message = text(raw.message).replace(/\r\n?/g, "\n").trim();
  if (message.length < contactLimits.message.min)
    errors.message = "messageShort";
  else if (message.length > contactLimits.message.max)
    errors.message = "tooLong";
  else if (MESSAGE_CONTROL.test(message)) errors.message = "messageChars";

  if (raw.privacy !== true) errors.privacy = "privacyRequired";

  if (unexpected || !reason || Object.keys(errors).length)
    return { success: false, errors };
  return {
    success: true,
    data: {
      name,
      email: email.toLowerCase(),
      company: company || undefined,
      phone: phone || undefined,
      reason,
      message,
      privacy: true,
    },
  };
}
