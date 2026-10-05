import Link from 'next/link'

import { ExternalLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { IrisMark } from '@/components/ui/icons'
import { contactInfo, footer, footerNav, identity } from '@/content/site'
import { getPublishedProfiles } from '@/content/social'
import { visibleNavItems } from '@/lib/navigation'

const legalLinks = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Política de cookies', href: '/cookies' },
]

const linkClass =
  'inline-flex min-h-11 items-center font-display text-ui text-niebla underline-offset-4 decoration-ambar decoration-2 hover:underline'

export function SiteFooter() {
  const profiles = getPublishedProfiles()
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark bg-abeto text-niebla">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-between lg:gap-x-16 lg:py-20">
        <div className="lg:max-w-[20rem]">
          <p className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight">
            <IrisMark className="size-7" />
            {identity.name}
          </p>
          <p className="mt-3 max-w-[28ch] text-abeto-claro">{footer.tagline}</p>
          {contactInfo.email ? (
            <p className="mt-6">
              <a href={`mailto:${contactInfo.email}`} className={linkClass}>
                {contactInfo.email}
              </a>
            </p>
          ) : null}
        </div>

        <nav aria-label="Pie de página">
          <h2 className="font-display text-lg font-bold">Navegación</h2>
          <ul className="mt-3">
            {visibleNavItems(footerNav).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {profiles.length > 0 ? (
          <div>
            <h2 className="font-display text-lg font-bold">Redes</h2>
            <ul className="mt-3">
              {profiles.map((profile) => (
                <li key={profile.platform}>
                  <ExternalLink href={profile.url} className={linkClass}>
                    {profile.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <nav aria-label="Información legal">
          <h2 className="font-display text-lg font-bold">Información legal</h2>
          <ul className="mt-3">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-niebla/20">
        <Container className="py-6 text-sm text-abeto-claro">
          <p>
            © {year} {identity.name}. Todos los derechos reservados.
          </p>
        </Container>
      </div>
    </footer>
  )
}
