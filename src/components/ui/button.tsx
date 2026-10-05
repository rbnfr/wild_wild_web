import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

import { ExternalIcon } from './icons'

type Variant = 'primary' | 'secondary'
type Size = 'md' | 'sm'

type ButtonStyleOptions = {
  variant?: Variant
  size?: Size
  /** Sobre fondos oscuros (abeto) cambian los colores de contraste. */
  onDark?: boolean
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  onDark = false,
}: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full border-2 font-display font-semibold',
    'transition-colors duration-200 ease-soft select-none',
    size === 'md' ? 'min-h-12 px-7 text-[1.0625rem]' : 'min-h-11 px-5 text-ui',
    variant === 'primary' &&
      !onDark &&
      'border-abeto bg-abeto text-niebla hover:border-ink hover:bg-ink',
    variant === 'primary' &&
      onDark &&
      'border-ambar bg-ambar text-ink hover:border-niebla hover:bg-niebla',
    variant === 'secondary' &&
      !onDark &&
      'border-abeto bg-transparent text-abeto hover:bg-abeto hover:text-niebla',
    variant === 'secondary' &&
      onDark &&
      'border-niebla bg-transparent text-niebla hover:bg-niebla hover:text-abeto',
  )
}

type ButtonLinkProps = ButtonStyleOptions &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & { className?: string }

/** Enlace con aspecto de botón (navegación interna). */
export function ButtonLink({ variant, size, onDark, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size, onDark }), className)} {...props} />
}

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'target' | 'rel'>

/** Enlace externo: nueva pestaña, sin filtrar el referrer y avisado a lectores de pantalla. */
export function ExternalLink({ children, className, ...props }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={className} {...props}>
      {children}
      <ExternalIcon className="ml-1.5 inline-block size-[1em] align-[-0.125em]" />
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  )
}
