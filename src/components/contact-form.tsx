"use client";
import { useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { contactSchema } from "@/lib/contact/schema";
import { createMailDraft } from "@/lib/contact/mail-draft";
const fields = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    autoComplete: "name",
    maxLength: 100,
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
    required: true,
  },
  {
    name: "company",
    label: "Empresa u organización",
    type: "text",
    autoComplete: "organization",
    maxLength: 150,
    required: false,
  },
  {
    name: "phone",
    label: "Teléfono",
    type: "tel",
    autoComplete: "tel",
    maxLength: 40,
    required: false,
  },
] as const;

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof createMailDraft> | null>(
    null,
  );
  const draftText = useRef<HTMLTextAreaElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      phone: data.get("phone"),
      reason: data.get("reason"),
      message: data.get("message"),
      privacy: data.get("privacy") === "on",
    });
    if (!parsed.success) {
      const nextErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        nextErrors[key] = [...(nextErrors[key] ?? []), issue.message];
      }
      setErrors(nextErrors);
      setDraft(null);
      setMessage("Revisa los campos indicados antes de preparar el correo.");
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    setErrors({});
    setDraft(createMailDraft(parsed.data, site.contact.email));
    setMessage("Borrador preparado. Todavía no se ha enviado ningún correo.");
  };

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      setMessage(
        "Borrador copiado. Pégalo en tu correo, revísalo y envíalo desde allí.",
      );
    } catch {
      draftText.current?.focus();
      draftText.current?.select();
      setMessage(
        "No se ha podido copiar automáticamente. El borrador está seleccionado para que lo copies manualmente.",
      );
    }
  };
  const errorFor = (name: string) =>
    errors[name]?.length ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name][0]}
      </span>
    ) : null;
  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={submit}
      onChange={() => {
        setDraft(null);
        setMessage("");
      }}
      aria-label="Formulario de contacto"
    >
      <p className="form-note">
        Los campos con * son obligatorios. Prepararemos un correo para que lo
        envíes desde tu aplicación; también podrás copiarlo.
      </p>
      <div className="form-grid">
        {fields.map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required ? " *" : " (opcional)"}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              required={field.required}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            />
            {errorFor(field.name)}
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor="reason">Motivo de contacto *</label>
        <select
          id="reason"
          name="reason"
          required
          defaultValue=""
          aria-invalid={!!errors.reason}
          aria-describedby={errors.reason ? "reason-error" : undefined}
        >
          <option value="" disabled>
            Selecciona un motivo
          </option>
          {site.contact.reasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
        {errorFor("reason")}
      </div>
      <div className="form-field">
        <label htmlFor="message">Tu mensaje *</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={`message-help${errors.message ? " message-error" : ""}`}
        />
        <span className="field-help" id="message-help">
          Entre 20 y 4.000 caracteres. No incluyas datos sensibles.
        </span>
        {errorFor("message")}
      </div>
      <div className="privacy-field">
        <div className="checkbox-line">
          <input
            type="checkbox"
            name="privacy"
            id="privacy"
            required
            aria-invalid={!!errors.privacy}
            aria-describedby={errors.privacy ? "privacy-error" : undefined}
          />
          <label htmlFor="privacy">
            He leído y acepto la{" "}
            <a href="/privacidad/">política de privacidad</a>. *
          </label>
        </div>
        {errorFor("privacy")}
      </div>
      <button className="button submit-button" type="submit">
        Preparar correo
        <span aria-hidden="true">↗</span>
      </button>
      {draft && (
        <div className="mail-draft">
          <h3>Tu correo está preparado</h3>
          <p>
            Ábrelo en tu aplicación, revisa el contenido y pulsa enviar allí. Si
            no tienes una aplicación configurada, copia el borrador en tu correo
            habitual.
          </p>
          <div className="draft-actions">
            <a className="button" href={draft.href}>
              Abrir mi aplicación de correo
            </a>
            <button className="draft-copy" type="button" onClick={copyDraft}>
              Copiar borrador
            </button>
          </div>
          <label htmlFor="draft-content">Borrador para copiar</label>
          <textarea
            ref={draftText}
            id="draft-content"
            readOnly
            value={draft.text}
            rows={8}
          />
        </div>
      )}
      <noscript>
        <style>{".contact-form > :not(noscript) { display: none; }"}</style>
        <p>
          Para usar el formulario, activa JavaScript. También puedes escribir
          directamente a{" "}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      </noscript>
      <p
        className="form-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </p>
    </form>
  );
}
