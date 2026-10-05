import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export default function NotFound() {
  return (
    <section className="bg-niebla py-24 md:py-32">
      <Container className="max-w-[56rem]">
        <h1 className="text-h2 font-extrabold text-abeto">No encontramos esta página</h1>
        <p className="mt-6 max-w-[52ch] text-lead">
          Es posible que el enlace esté mal escrito o que la página ya no exista.
        </p>
        <div className="mt-9">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
        </div>
      </Container>
    </section>
  )
}
