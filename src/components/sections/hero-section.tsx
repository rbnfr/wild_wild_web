import Link from 'next/link'

import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Photo } from '@/components/ui/photo'
import { hero, identity } from '@/content/site'
import { contactHref } from '@/lib/navigation'

export function HeroSection() {
  const [firstName = identity.name, ...otherNames] = identity.name.split(' ')
  const lastName = otherNames.join(' ')

  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="overflow-x-clip bg-niebla pt-10 pb-20 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28"
    >
      <Container className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:row-start-1">
          <h1 id="hero-titulo" className="font-display font-extrabold text-abeto">
            <span className="hero-rise block text-display [--step:0] [font-variation-settings:'wdth'_96]">
              {firstName}
            </span>{' '}
            {lastName ? (
              <span className="hero-rise block text-display [--step:1] [font-variation-settings:'wdth'_96]">
                {lastName}
              </span>
            ) : null}
            <span className="sr-only">, </span>
            <span className="hero-rise mt-7 block text-h3 font-semibold text-ink [--step:2]">
              {identity.role} de {identity.specialty}
            </span>
          </h1>

          <p className="hero-rise mt-7 max-w-[36ch] text-lead text-ink [--step:3]">
            {hero.valueProposition}
          </p>

          <div className="hero-rise mt-9 flex flex-wrap gap-3 [--step:4]">
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="hero-frame viewfinder lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-start">
          <Photo
            image={hero.image}
            preload
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 80vw, 92vw"
          />
        </div>

        <div className="hero-rise [--step:5] lg:col-span-7 lg:row-start-2">
          <h2 className="font-display text-ui font-semibold text-musgo">{hero.audiencesTitle}</h2>
          <ul className="mt-3 grid border-t border-salvia sm:grid-cols-2 sm:gap-x-8">
            {hero.audiences.map((audience) => (
              <li key={audience.reason} className="border-b border-salvia">
                <Link
                  href={contactHref(audience.reason)}
                  className="flex min-h-14 items-center py-2 font-display text-[1.0625rem] font-medium text-abeto decoration-ambar decoration-2 underline-offset-[6px] hover:underline"
                >
                  {audience.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
