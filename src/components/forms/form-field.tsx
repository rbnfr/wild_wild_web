import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { AlertIcon } from '@/components/ui/icons'

export const inputClass = (invalid: boolean) =>
  cn(
    'min-h-12 w-full rounded-control border-2 bg-papel px-4 py-2.5 font-display text-[1.0625rem] text-ink',
    'placeholder:text-musgo/70',
    invalid ? 'border-error' : 'border-musgo',
  )

type FieldLabelProps = { htmlFor: string; children: ReactNode; optional?: boolean }

export function FieldLabel({ htmlFor, children, optional = false }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-display text-ui font-semibold text-abeto">
      {children}
      {optional ? <span className="ml-1.5 font-normal text-musgo">(opcional)</span> : null}
    </label>
  )
}

export function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null

  return (
    <p
      id={id}
      className="mt-1.5 flex items-start gap-2 font-display text-ui font-medium text-error"
    >
      <AlertIcon className="mt-0.5 size-5 shrink-0" />
      <span>
        <span className="sr-only">Error: </span>
        {message}
      </span>
    </p>
  )
}

type TextFieldProps = {
  name: string
  label: string
  error: string | undefined
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel'
  optional?: boolean
  hint?: string
  maxLength?: number
}

export function TextField({
  name,
  label,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  optional = false,
  hint,
  maxLength,
}: TextFieldProps) {
  const id = `contacto-${name}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-required={!optional}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={inputClass(Boolean(error))}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 font-display text-sm text-musgo">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  )
}
