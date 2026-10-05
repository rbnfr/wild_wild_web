import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Container } from './container'

type SectionProps = {
  id: string
  title: string
  /** Texto introductorio bajo el título. */
  intro?: string
  /** Contenido adicional bajo la introducción (por ejemplo, datos de contacto). */
  aside?: ReactNode
  tone?: 'light' | 'paper' | 'sand' | 'dark'
  className?: string
  children: ReactNode
}

const tones = {
  light: 'bg-niebla text-ink',
  paper: 'bg-papel text-ink',
  sand: 'bg-arena/60 text-ink',
  dark: 'on-dark bg-abeto text-niebla',
} as const

/**
 * Sección con título editorial a la izquierda y contenido a la derecha en pantallas
 * anchas. El `h2` nombra la región para lectores de pantalla.
 */
export function Section({
  id,
  title,
  intro,
  aside,
  tone = 'light',
  className,
  children,
}: SectionProps) {
  const headingId = `${id}-titulo`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(tones[tone], 'py-20 md:py-28 lg:py-32')}
    >
      <Container className={cn('grid gap-10 xl:grid-cols-12 xl:gap-x-12', className)}>
        <header className="xl:sticky xl:top-28 xl:col-span-4 xl:self-start">
          <h2 id={headingId} className="text-section font-extrabold">
            {title}
          </h2>
          {intro ? (
            <p
              className={cn(
                'mt-5 max-w-[34ch] text-lg leading-relaxed',
                tone === 'dark' ? 'text-abeto-claro' : 'text-musgo',
              )}
            >
              {intro}
            </p>
          ) : null}
          {aside}
        </header>
        <div className="xl:col-span-8">{children}</div>
      </Container>
    </section>
  )
}
