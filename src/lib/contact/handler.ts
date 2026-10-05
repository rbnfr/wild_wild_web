import { isIP } from "node:net";
import { contactSchema, reasonLabels, type ContactInput } from "./schema";
import { ContactRateLimiter } from "./rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const limiter = new ContactRateLimiter();
const json = (status: number, body: object, extra?: Record<string, string>) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
const fail = (
  status: number,
  message: string,
  extra?: Record<string, string>,
) => json(status, { ok: false, message }, extra);
const unavailable = () =>
  fail(
    503,
    "El envío no está disponible en este momento. Inténtalo más tarde.",
  );

function trustedAddress(request: Request): string {
  if (process.env.CONTACT_TRUST_PROXY !== "true") return "shared";
  // Enable only if your trusted reverse proxy overwrites this header, removing client-supplied values.
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return address && isIP(address) ? address : "shared";
}
async function readBody(request: Request): Promise<string> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new Error("payload");
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("payload");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(result);
}
async function verifyTurnstile(
  token: string,
  secret: string,
  hostname: string,
): Promise<boolean> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) return false;
  const result: unknown = await response.json();
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    result.success === true &&
    "hostname" in result &&
    result.hostname === hostname &&
    "action" in result &&
    result.action === "contact"
  );
}
async function sendEmail(
  input: ContactInput,
  apiKey: string,
  from: string,
  to: string,
): Promise<boolean> {
  const text = [
    `Nombre: ${input.name}`,
    `Email: ${input.email}`,
    `Empresa: ${input.company ?? "No indicada"}`,
    `Teléfono: ${input.phone ?? "No indicado"}`,
    `Motivo: ${reasonLabels[input.reason]}`,
    "",
    input.message,
    "",
    "La persona remitente ha aceptado la política de privacidad.",
  ].join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Contacto web · ${reasonLabels[input.reason]}`,
      text,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return false;
  const result: unknown = await response.json();
  return (
    typeof result === "object" &&
    result !== null &&
    "id" in result &&
    typeof result.id === "string" &&
    result.id.length > 0
  );
}
export async function handleContact(
  request: Request,
  rateLimiter = limiter,
): Promise<Response> {
  if (request.method !== "POST")
    return fail(405, "Método no permitido.", { Allow: "POST" });
  if (
    request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !==
    "application/json"
  )
    return fail(415, "Envía el formulario en formato JSON.");
  let site: URL;
  try {
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.NEXT_PUBLIC_SITE_URL
    )
      return unavailable();
    site = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url);
    if (!["http:", "https:"].includes(site.protocol)) return unavailable();
  } catch {
    return unavailable();
  }
  if (request.headers.get("origin") !== site.origin)
    return fail(403, "El origen de la solicitud no es válido.");
  const rate = rateLimiter.check(trustedAddress(request));
  if (!rate.allowed)
    return fail(
      429,
      "Has enviado demasiadas solicitudes. Espera unos minutos.",
      { "Retry-After": String(rate.retryAfter) },
    );
  let raw: unknown;
  try {
    raw = JSON.parse(await readBody(request));
  } catch (error) {
    return fail(
      error instanceof Error && error.message === "payload" ? 413 : 400,
      "No se pudo leer el formulario.",
    );
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success)
    return json(422, {
      ok: false,
      message: "Revisa los campos del formulario.",
      errors: parsed.error.flatten().fieldErrors,
    });
  if (parsed.data.website !== "")
    return fail(400, "No se pudo validar el formulario.");
  const mock =
    process.env.NODE_ENV !== "production" &&
    process.env.CONTACT_EMAIL_MODE === "mock";
  if (mock)
    return json(200, {
      ok: true,
      mode: "mock",
      message: "Prueba local completada. No se ha enviado ningún correo.",
    });
  const {
    RESEND_API_KEY: apiKey,
    CONTACT_FROM_EMAIL: from,
    CONTACT_TO_EMAIL: to,
    TURNSTILE_SECRET_KEY: secret,
  } = process.env;
  if (!apiKey || !from || !to || !secret) return unavailable();
  if (!parsed.data.turnstileToken)
    return fail(422, "Completa la verificación anti-spam.");
  try {
    if (
      !(await verifyTurnstile(
        parsed.data.turnstileToken,
        secret,
        site.hostname,
      ))
    )
      return fail(
        422,
        "La verificación anti-spam ha caducado o no es válida. Inténtalo de nuevo.",
      );
    if (!(await sendEmail(parsed.data, apiKey, from, to))) return unavailable();
    return json(200, {
      ok: true,
      mode: "live",
      message: "Tu mensaje se ha enviado correctamente.",
    });
  } catch {
    return unavailable();
  }
}
