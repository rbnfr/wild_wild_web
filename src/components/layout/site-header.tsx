import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { IrisMark } from '@/components/ui/icons'
import { headerCta, headerNav, identity } from '@/content/site'
import { visibleNavItems } from '@/lib/navigation'

import { MobileMenu } from './mobile-menu'

export function SiteHeader() {
  const navItems = visibleNavItems(headerNav)

  return (
    <header className="sticky top-0 z-40 border-b border-salvia bg-niebla">
      <Container className="flex h-[4.25rem] items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${identity.name}, ir al inicio`}
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-abeto"
        >
          <IrisMark className="size-6" />
          {identity.name}
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-display text-ui font-medium text-abeto decoration-ambar decoration-2 underline-offset-8 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href={headerCta.href} size="sm">
            {headerCta.label}
          </ButtonLink>
        </nav>

        <MobileMenu items={navItems} cta={headerCta} />
      </Container>
    </header>
  )
}
