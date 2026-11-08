import type { ContactInput, ContactReason } from "./schema";

// Labels of the draft, in the language the visitor is reading.
export type MailDraftText = {
  to: string;
  subjectLabel: string;
  subject: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  reason: string;
  reasons: Record<ContactReason, string>;
};

export function createMailDraft(
  input: ContactInput,
  recipient: string,
  t: MailDraftText,
) {
  const reason = t.reasons[input.reason];
  const subject = `${reason} — ${t.subject}`;
  const body = [
    `${t.name}: ${input.name}`,
    `${t.email}: ${input.email}`,
    ...(input.company ? [`${t.company}: ${input.company}`] : []),
    ...(input.phone ? [`${t.phone}: ${input.phone}`] : []),
    `${t.reason}: ${reason}`,
    "",
    input.message,
  ].join("\n");
  return {
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `${t.to}: ${recipient}\n${t.subjectLabel}: ${subject}\n\n${body}`,
  };
}
