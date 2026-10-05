'use client'

import { buttonStyles } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="bg-niebla py-24 md:py-32">
      <Container className="max-w-[56rem]">
        <h1 className="text-h2 font-extrabold text-abeto">Algo ha fallado</h1>
        <p className="mt-6 max-w-[52ch] text-lead">
          No hemos podido mostrar esta página. Inténtalo de nuevo; si el problema continúa, vuelve
          más tarde.
        </p>
        <div className="mt-9">
          <button type="button" onClick={reset} className={buttonStyles()}>
            Intentarlo de nuevo
          </button>
        </div>
      </Container>
    </section>
  )
}
