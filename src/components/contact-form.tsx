"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRightIcon } from "@/components/icon";
import type { Dictionary } from "@/content/dictionaries";
import {
  contactLimits,
  contactReasons,
  validateContact,
  type ContactError,
  type ContactField,
} from "@/lib/contact/schema";
import { createMailDraft } from "@/lib/contact/mail-draft";

type FieldErrors = Partial<Record<ContactField, ContactError>>;

const fields = [
  {
    name: "name",
    type: "text",
    autoComplete: "name",
    maxLength: contactLimits.name.max,
    required: true,
  },
  {
    name: "email",
    type: "email",
    autoComplete: "email",
    maxLength: contactLimits.email.max,
    required: true,
  },
  {
    name: "company",
    type: "text",
    autoComplete: "organization",
    maxLength: contactLimits.company.max,
    required: false,
  },
  {
    name: "phone",
    type: "tel",
    autoComplete: "tel",
    maxLength: contactLimits.phone.max,
    required: false,
  },
] as const;

export function ContactForm({
  t,
  email,
  privacyHref,
}: {
  t: Dictionary["contact"]["form"];
  email: string;
  privacyHref: string;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof createMailDraft> | null>(
    null,
  );
  const draftText = useRef<HTMLTextAreaElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = validateContact({
      ...Object.fromEntries(data),
      privacy: data.get("privacy") === "on",
    });
    if (!parsed.success) {
      setErrors(parsed.errors);
      setDraft(null);
      setMessage(t.status.invalid);
      const first = Object.keys(parsed.errors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setDraft(createMailDraft(parsed.data, email, t.mail));
    setMessage(t.status.ready);
  };

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      setMessage(t.status.copied);
    } catch {
      draftText.current?.focus();
      draftText.current?.select();
      setMessage(t.status.copyFailed);
    }
  };
  const errorFor = (name: ContactField) => {
    const error = errors[name];
    return error ? (
      <span className="field-error" id={`${name}-error`}>
        {t.errors[error]}
      </span>
    ) : null;
  };
  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={submit}
      onChange={() => {
        setDraft(null);
        setMessage("");
      }}
      aria-label={t.label}
    >
      <p className="form-note">{t.note}</p>
      <div className="form-grid">
        {fields.map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={field.name}>
              {t.fields[field.name]}
              {field.required ? " *" : ` ${t.optional}`}
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
        <label htmlFor="reason">{t.reason} *</label>
        <select
          id="reason"
          name="reason"
          required
          defaultValue=""
          aria-invalid={!!errors.reason}
          aria-describedby={errors.reason ? "reason-error" : undefined}
        >
          <option value="" disabled>
            {t.reasonPlaceholder}
          </option>
          {contactReasons.map((reason) => (
            <option key={reason} value={reason}>
              {t.mail.reasons[reason]}
            </option>
          ))}
        </select>
        {errorFor("reason")}
      </div>
      <div className="form-field">
        <label htmlFor="message">{t.message} *</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={contactLimits.message.min}
          maxLength={contactLimits.message.max}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={`message-help${errors.message ? " message-error" : ""}`}
        />
        <span className="field-help" id="message-help">
          {t.messageHelp}
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
            {t.privacyAccept} <a href={privacyHref}>{t.privacyLink}</a>. *
          </label>
        </div>
        {errorFor("privacy")}
      </div>
      <button className="button submit-button" type="submit">
        {t.submit}
        <span aria-hidden="true">
          <ArrowUpRightIcon />
        </span>
      </button>
      {draft && (
        <div className="mail-draft">
          <h3>{t.draft.title}</h3>
          <p>{t.draft.text}</p>
          <div className="draft-actions">
            <a className="button" href={draft.href}>
              {t.draft.open}
            </a>
            <button className="draft-copy" type="button" onClick={copyDraft}>
              {t.draft.copy}
            </button>
          </div>
          <label htmlFor="draft-content">{t.draft.label}</label>
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
          {t.noscript} <a href={`mailto:${email}`}>{email}</a>.
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
