import Link from 'next/link'

import { contactHref } from '@/lib/navigation'
import { cn } from '@/lib/cn'

type ContactLinkProps = {
  reason: string
  children: string
  /** Contexto extra solo para lectores de pantalla, para que el enlace sea descriptivo. */
  context?: string
  onDark?: boolean
}

/** Enlace al formulario con el motivo ya elegido. */
export function ContactLink({ reason, children, context, onDark = false }: ContactLinkProps) {
  return (
    <Link
      href={contactHref(reason)}
      className={cn(
        'inline-flex min-h-11 items-center font-display font-semibold underline decoration-ambar decoration-2 underline-offset-[6px] hover:decoration-4',
        onDark ? 'text-niebla' : 'text-abeto',
      )}
    >
      <span>
        {children}
        {context ? <span className="sr-only"> ({context})</span> : null}
      </span>
    </Link>
  )
}
