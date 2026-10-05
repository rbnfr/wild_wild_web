'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'

import { buttonStyles, ExternalLink } from '@/components/ui/button'
import { AlertIcon, CheckCircleIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { ContactApiResponse } from '@/lib/contact/types'
import {
  CONTACT_LIMITS,
  contactFieldsSchema,
  getFieldErrors,
  type ContactFieldName,
  type FieldErrors,
} from '@/lib/validation/contact'
import type { ContactReasonId } from '@/lib/validation/contact-reasons'

import { FieldError, FieldLabel, inputClass, TextField } from './form-field'
import { ReasonPicker } from './reason-picker'
import { TurnstileWidget } from './turnstile-widget'

type Status = 'idle' | 'sending' | 'success' | 'error'
type VisibleErrors = Partial<Record<ContactFieldName, string>>

const FIELD_ORDER: ContactFieldName[] = [
  'name',
  'email',
  'organization',
  'phone',
  'reason',
  'message',
  'privacy',
]

/** Id del primer control de cada campo, para que el resumen de errores enlace con él. */
const FIELD_ANCHORS: Record<ContactFieldName, string> = {
  name: 'contacto-name',
  email: 'contacto-email',
  organization: 'contacto-organization',
  phone: 'contacto-phone',
  reason: 'contacto-reason',
  message: 'contacto-message',
  privacy: 'contacto-privacy',
}

const NETWORK_ERROR =
  'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.'
const WAIT_FOR_VERIFICATION =
  'Estamos comprobando que eres una persona. Espera un momento y vuelve a pulsar «Enviar mensaje».'

function firstMessages(errors: FieldErrors): VisibleErrors {
  const visible: VisibleErrors = {}
  for (const field of FIELD_ORDER) {
    const message = errors[field]?.[0]
    if (message) visible[field] = message
  }
  return visible
}

type ContactFormProps = {
  defaultReason?: ContactReasonId
  turnstileSiteKey?: string
  nonce?: string
}

export function ContactForm({ defaultReason, turnstileSiteKey, nonce }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [errors, setErrors] = useState<VisibleErrors>({})
  const [errorRound, setErrorRound] = useState(0)
  const [messageLength, setMessageLength] = useState(0)
  const [verificationRequested, setVerificationRequested] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)

  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const startedAt = useRef(0)
  // Cuenta las ediciones para no borrar lo que se escriba mientras un envío está en curso.
  const editRevision = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  // Tras un intento con errores, el foco pasa al resumen para que se lea enseguida.
  useEffect(() => {
    if (errorRound > 0) summaryRef.current?.focus()
  }, [errorRound])

  const handleToken = useCallback((token: string | null) => setTurnstileToken(token), [])

  const showErrors = (visible: VisibleErrors) => {
    setErrors(visible)
    setErrorRound((round) => round + 1)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const data = new FormData(event.currentTarget)
    const text = (name: string) => String(data.get(name) ?? '')

    const parsed = contactFieldsSchema.safeParse({
      name: text('name'),
      email: text('email'),
      organization: text('organization'),
      phone: text('phone'),
      reason: data.get('reason') ?? undefined,
      message: text('message'),
      privacy: data.get('privacy') === 'on',
    })

    if (!parsed.success) {
      setStatus('idle')
      setStatusMessage('')
      showErrors(firstMessages(getFieldErrors(parsed.error)))
      return
    }

    setErrors({})

    if (turnstileSiteKey && !turnstileToken) {
      setVerificationRequested(true)
      setStatus('error')
      setStatusMessage(WAIT_FOR_VERIFICATION)
      return
    }

    setStatus('sending')
    setStatusMessage('')
    const revisionAtSubmit = editRevision.current

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          website: text('website'),
          turnstileToken: turnstileToken ?? undefined,
          elapsedMs: Date.now() - startedAt.current,
        }),
      })
      const result = (await response.json().catch(() => null)) as ContactApiResponse | null

      if (response.ok && result?.ok) {
        if (editRevision.current === revisionAtSubmit) {
          formRef.current?.reset()
          setMessageLength(0)
        }
        setStatus('success')
        setStatusMessage(result.message)
        startedAt.current = Date.now()
        return
      }

      setStatus('error')
      setStatusMessage(result && !result.ok ? result.message : NETWORK_ERROR)
      if (result && !result.ok && result.fieldErrors) {
        const visible = firstMessages(result.fieldErrors)
        if (Object.keys(visible).length > 0) showErrors(visible)
      }
    } catch {
      setStatus('error')
      setStatusMessage(NETWORK_ERROR)
    } finally {
      // Los tokens de Turnstile son de un solo uso.
      setTurnstileToken(null)
      setTurnstileResetKey((key) => key + 1)
    }
  }

  function focusField(field: ContactFieldName) {
    document.getElementById(FIELD_ANCHORS[field])?.focus()
  }

  const errorEntries = FIELD_ORDER.flatMap((field) => {
    const message = errors[field]
    return message ? [{ field, message }] : []
  })

  const sending = status === 'sending'

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={sending}
      onSubmit={handleSubmit}
      onInput={() => {
        editRevision.current += 1
      }}
      onFocusCapture={() => {
        if (turnstileSiteKey) setVerificationRequested(true)
      }}
      className="space-y-6"
    >
      {errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="rounded-control border-2 border-error bg-papel p-5 focus-visible:outline-offset-4"
        >
          <h3 className="font-display text-lg font-bold text-error">
            {errorEntries.length === 1
              ? 'Hay un campo que revisar'
              : `Hay ${errorEntries.length} campos que revisar`}
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-display text-ui">
            {errorEntries.map(({ field, message }) => (
              <li key={field}>
                <a
                  href={`#${FIELD_ANCHORS[field]}`}
                  onClick={(event) => {
                    event.preventDefault()
                    focusField(field)
                  }}
                  className="font-medium text-error underline underline-offset-4"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="font-display text-sm text-musgo">
        Los campos sin la marca «opcional» son obligatorios.
      </p>

      <ReasonPicker defaultValue={defaultReason} error={errors.reason} />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label="Nombre"
          autoComplete="name"
          error={errors.name}
          maxLength={CONTACT_LIMITS.nameMax}
        />
        <TextField
          name="email"
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errors.email}
          maxLength={CONTACT_LIMITS.emailMax}
        />
        <TextField
          name="organization"
          label="Empresa u organización"
          autoComplete="organization"
          optional
          error={errors.organization}
          maxLength={CONTACT_LIMITS.organizationMax}
        />
        <TextField
          name="phone"
          label="Teléfono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
          error={errors.phone}
          maxLength={CONTACT_LIMITS.phoneMax}
        />
      </div>

      <div>
        <FieldLabel htmlFor="contacto-message">Mensaje</FieldLabel>
        <textarea
          id="contacto-message"
          name="message"
          rows={7}
          maxLength={CONTACT_LIMITS.messageMax}
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={cn(
            errors.message && 'contacto-message-error',
            'contacto-message-count',
          )}
          onChange={(event) => setMessageLength(event.currentTarget.value.length)}
          className={cn(inputClass(Boolean(errors.message)), 'resize-y leading-relaxed')}
        />
        <p
          id="contacto-message-count"
          className={cn(
            'mt-1.5 font-display text-sm',
            messageLength > CONTACT_LIMITS.messageMax ? 'font-semibold text-error' : 'text-musgo',
          )}
        >
          {messageLength} de {CONTACT_LIMITS.messageMax} caracteres
        </p>
        <FieldError id="contacto-message-error" message={errors.message} />
      </div>

      {/* Trampa para bots: fuera de pantalla, sin foco y ocultada a lectores de pantalla. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          No rellenes este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="contacto-privacy"
            name="privacy"
            type="checkbox"
            aria-invalid={Boolean(errors.privacy)}
            aria-describedby={errors.privacy ? 'contacto-privacy-error' : undefined}
            className={cn(
              'mt-1 size-6 shrink-0 cursor-pointer rounded-md border-2 accent-abeto',
              errors.privacy ? 'border-error' : 'border-musgo',
            )}
          />
          <label
            htmlFor="contacto-privacy"
            className="font-display text-[1.0625rem] leading-snug text-ink"
          >
            He leído y acepto la{' '}
            <ExternalLink
              href="/privacidad"
              className="font-semibold text-abeto underline decoration-ambar decoration-2 underline-offset-4"
            >
              política de privacidad
            </ExternalLink>
            .
          </label>
        </div>
        <FieldError id="contacto-privacy-error" message={errors.privacy} />
      </div>

      <div>
        <button
          type="submit"
          aria-disabled={sending}
          className={cn(
            buttonStyles({ size: 'md' }),
            'w-full sm:w-auto',
            sending && 'cursor-wait opacity-80',
          )}
        >
          {sending ? 'Enviando…' : 'Enviar mensaje'}
        </button>

        {turnstileSiteKey && verificationRequested ? (
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            nonce={nonce}
            onToken={handleToken}
            resetKey={turnstileResetKey}
          />
        ) : null}

        <p className="mt-4 max-w-[52ch] font-display text-sm text-musgo">
          Usaremos tus datos solo para responder a tu mensaje.
          {turnstileSiteKey
            ? ' El formulario se protege con Cloudflare Turnstile para evitar el spam.'
            : ''}
        </p>
      </div>

      {/* Las regiones en vivo están siempre en el DOM para que los cambios se anuncien. */}
      <div role="status" aria-live="polite" className="empty:hidden">
        {sending ? (
          <p className="font-display font-medium text-abeto">Enviando tu mensaje…</p>
        ) : null}
        {status === 'success' ? (
          <p className="flex items-start gap-3 rounded-control border-2 border-ok bg-papel p-4 font-display font-semibold text-ok">
            <CheckCircleIcon className="mt-0.5 size-6 shrink-0" />
            <span>{statusMessage} Puedes enviar otro mensaje si lo necesitas.</span>
          </p>
        ) : null}
      </div>
      <div role="alert" className="empty:hidden">
        {status === 'error' ? (
          <p className="flex items-start gap-3 rounded-control border-2 border-error bg-papel p-4 font-display font-semibold text-error">
            <AlertIcon className="mt-0.5 size-6 shrink-0" />
            <span>{statusMessage}</span>
          </p>
        ) : null}
      </div>
    </form>
  )
}
