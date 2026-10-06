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
export const reasonLabels: Record<(typeof contactReasons)[number], string> = {
  consulta: "Consulta",
  contratacion: "Contratación",
  evento: "Charla o evento",
  prensa: "Prensa o medios",
  editorial: "Proyecto editorial",
  colaboracion: "Colaboración comercial",
  otro: "Otro",
};
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres.`)
    .regex(
      /^[^\u0000-\u001f\u007f]*$/,
      "No se permiten caracteres de control.",
    );
const optionalLine = (max: number) =>
  singleLine(max)
    .optional()
    .transform((value) => value || undefined);
export const contactSchema = z
  .object({
    name: singleLine(100).min(2, "Escribe tu nombre."),
    email: singleLine(254)
      .pipe(z.email("Escribe un email válido."))
      .transform((value) => value.toLowerCase()),
    company: optionalLine(150),
    phone: optionalLine(40),
    reason: z.enum(contactReasons, {
      error: "Selecciona un motivo de contacto.",
    }),
    message: z
      .string()
      .transform((value) => value.replace(/\r\n?/g, "\n").trim())
      .pipe(
        z
          .string()
          .min(20, "Escribe un mensaje de al menos 20 caracteres.")
          .max(4000, "Máximo 4000 caracteres.")
          .regex(
            /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]*$/,
            "El mensaje contiene caracteres no permitidos.",
          ),
      ),
    privacy: z.literal(true, { error: "Acepta la política de privacidad." }),
  })
  .strict();
export type ContactInput = z.infer<typeof contactSchema>;
