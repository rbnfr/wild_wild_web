"use client";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { ArrowUpRightIcon } from "@/components/icon";
import type { Dictionary } from "@/content/dictionaries";
import {
  contactLimits,
  contactFields,
  contactReasons,
  validateContact,
  type ContactError,
  type ContactField,
} from "@/lib/contact/schema";
import { createMailDraft } from "@/lib/contact/mail-draft";

type FieldErrors = Partial<Record<ContactField, ContactError>>;

function validateForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return validateContact({
    ...Object.fromEntries(data),
    privacy: data.get("privacy") === "on",
  });
}

const isField = (name: string): name is ContactField =>
  contactFields.includes(name as ContactField);

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
    // An address, not prose: no autocorrection or capitals from the keyboard.
    autoCorrect: "off",
    autoCapitalize: "none",
    spellCheck: false,
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
  // Fields the visitor has changed: only these are checked when left, so
  // tabbing through an empty form never reports errors.
  const changed = useRef(new Set<ContactField>());
  // VoiceOver skips a status message identical to the previous one, so a
  // repeat gets an invisible no-break space to make it differ.
  const lastAnnounced = useRef("");
  const announce = (text: string) => {
    const next = text === lastAnnounced.current ? `${text}\u00A0` : text;
    lastAnnounced.current = next;
    setMessage(next);
  };

  // Rechecks one field and shows or clears its own error.
  const recheck = (form: HTMLFormElement, name: ContactField) => {
    const parsed = validateForm(form);
    const error = parsed.success ? undefined : parsed.errors[name];
    setErrors((current) =>
      current[name] === error ? current : { ...current, [name]: error },
    );
  };

  const fieldChanged = (event: ChangeEvent<HTMLFormElement>) => {
    setDraft(null);
    setMessage("");
    const name = (event.target as Element).getAttribute("name") ?? "";
    if (!isField(name)) return;
    changed.current.add(name);
    // An error goes away as soon as the value is fixed, without waiting for
    // the field to be left; new errors wait until then.
    if (errors[name] || name === "privacy" || name === "reason")
      recheck(event.currentTarget, name);
  };

  const fieldLeft = (event: FocusEvent<HTMLFormElement>) => {
    const name = (event.target as Element).getAttribute("name") ?? "";
    if (isField(name) && changed.current.has(name))
      recheck(event.currentTarget, name);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = validateForm(form);
    if (!parsed.success) {
      setErrors(parsed.errors);
      setDraft(null);
      announce(t.status.invalid);
      const first = Object.keys(parsed.errors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setDraft(createMailDraft(parsed.data, email, t.mail));
    announce(t.status.ready);
  };

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      announce(t.status.copied);
    } catch {
      draftText.current?.focus();
      draftText.current?.select();
      announce(t.status.copyFailed);
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
      onChange={fieldChanged}
      onBlur={fieldLeft}
      aria-label={t.label}
    >
      <p className="form-note">{t.note}</p>
      <div className="form-grid">
        {fields.map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={field.name}>
              {t.fields[field.name]}
              {field.required ? <Required /> : ` ${t.optional}`}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              autoCorrect={
                "autoCorrect" in field ? field.autoCorrect : undefined
              }
              autoCapitalize={
                "autoCapitalize" in field ? field.autoCapitalize : undefined
              }
              spellCheck={"spellCheck" in field ? field.spellCheck : undefined}
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
        <label htmlFor="reason">
          {t.reason}
          <Required />
        </label>
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
        <label htmlFor="message">
          {t.message}
          <Required />
        </label>
        {/* Above the field, so the on-screen keyboard never covers it. */}
        <span className="field-help" id="message-help">
          {t.messageHelp}
        </span>
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
            {t.privacyAccept} <a href={privacyHref}>{t.privacyLink}</a>.
            <Required />
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

// The asterisk is visual: `required` already tells assistive technology.
function Required() {
  return <span aria-hidden="true"> *</span>;
}
