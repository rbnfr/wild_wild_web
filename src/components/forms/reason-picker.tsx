import {
  CONTACT_REASON_IDS,
  CONTACT_REASON_LABELS,
  type ContactReasonId,
} from '@/lib/validation/contact-reasons'

import { FieldError } from './form-field'

type ReasonPickerProps = {
  defaultValue: ContactReasonId | undefined
  error: string | undefined
}

/**
 * Motivo de contacto como grupo de botones de opción: así cada perfil ve de un vistazo
 * dónde encaja. Los radios nativos garantizan teclado (flechas) y lectores de pantalla.
 */
export function ReasonPicker({ defaultValue, error }: ReasonPickerProps) {
  const errorId = 'contacto-reason-error'

  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)}>
      <legend className="mb-2 font-display text-ui font-semibold text-abeto">
        Motivo de contacto
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {CONTACT_REASON_IDS.map((id, index) => (
          <label key={id} className="relative">
            <input
              id={index === 0 ? 'contacto-reason' : undefined}
              type="radio"
              name="reason"
              value={id}
              defaultChecked={defaultValue === id}
              className="peer sr-only"
            />
            <span
              className={[
                'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 bg-papel px-4 font-display text-ui font-medium text-abeto',
                error ? 'border-error' : 'border-musgo',
                'peer-checked:border-abeto peer-checked:bg-abeto peer-checked:text-niebla',
                'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-abeto',
                'hover:border-abeto',
                'peer-checked:[&_svg]:inline',
              ].join(' ')}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                className="hidden size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {CONTACT_REASON_LABELS[id]}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  )
}
