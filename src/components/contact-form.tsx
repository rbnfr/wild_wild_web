"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { contactSchema } from "@/lib/contact/schema";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

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

export function ContactForm({ nonce }: { nonce?: string }) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [challengeError, setChallengeError] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!scriptReady || !siteKey || !container.current || !window.turnstile)
      return;
    widget.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action: "contact",
      callback: (value) => {
        setToken(value);
        setChallengeError(false);
      },
      "expired-callback": () => setToken(""),
      "error-callback": () => {
        setToken("");
        setChallengeError(true);
      },
    });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [scriptReady, siteKey]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      phone: data.get("phone"),
      reason: data.get("reason"),
      message: data.get("message"),
      privacy: data.get("privacy") === "on",
      website: data.get("website"),
      turnstileToken: token,
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        nextErrors[key] = [...(nextErrors[key] ?? []), issue.message];
      }
      setErrors(nextErrors);
      setStatus("error");
      setMessage("Revisa los campos indicados antes de enviar.");
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    setMessage("Enviando tu mensaje…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(30000),
      });
      const result: {
        ok?: boolean;
        mode?: string;
        message?: string;
        errors?: Record<string, string[]>;
      } = await response.json();
      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setStatus("error");
        setMessage(
          result.message ??
            "No se ha enviado el mensaje. Inténtalo de nuevo más tarde.",
        );
      } else {
        setStatus("success");
        setMessage(
          result.mode === "mock"
            ? "Prueba local completada. No se ha enviado ningún correo."
            : "Mensaje enviado. Gracias por ponerte en contacto.",
        );
        form.reset();
      }
    } catch {
      setStatus("error");
      setMessage(
        "No se ha podido confirmar el envío. Comprueba tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
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
      aria-label="Formulario de contacto"
    >
      <p className="form-note">Los campos con * son obligatorios.</p>
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
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Deja este campo vacío</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
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
            <Link href="/privacidad">política de privacidad</Link>. *
          </label>
        </div>
        {errorFor("privacy")}
      </div>
      {siteKey && (
        <>
          <Script
            nonce={nonce}
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
            onError={() => setChallengeError(true)}
          />
          <div ref={container} className="turnstile-container" />
          {challengeError && (
            <p role="alert" className="field-error">
              No se ha podido cargar la verificación de seguridad. Recarga la
              página para volver a intentarlo.
            </p>
          )}
        </>
      )}
      <button
        className="button submit-button"
        type="submit"
        disabled={status === "sending" || (!!siteKey && !token)}
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
        <span aria-hidden="true">↗</span>
      </button>
      <p
        className={`form-status ${status}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </p>
    </form>
  );
}
