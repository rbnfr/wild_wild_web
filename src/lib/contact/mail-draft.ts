import { reasonLabels, type ContactInput } from "./schema";

export function createMailDraft(input: ContactInput, recipient: string) {
  const subject = `${reasonLabels[input.reason]} — Contacto con Mary Granero`;
  const body = [
    `Nombre: ${input.name}`,
    `Email de contacto: ${input.email}`,
    ...(input.company ? [`Empresa u organización: ${input.company}`] : []),
    ...(input.phone ? [`Teléfono: ${input.phone}`] : []),
    `Motivo: ${reasonLabels[input.reason]}`,
    "",
    input.message,
  ].join("\n");
  return {
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `Para: ${recipient}\nAsunto: ${subject}\n\n${body}`,
  };
}
