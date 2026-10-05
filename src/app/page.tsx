import { AboutSection } from '@/components/sections/about-section'
import { BooksSection } from '@/components/sections/books-section'
import { ContactSection } from '@/components/sections/contact-section'
import { HeroSection } from '@/components/sections/hero-section'
import { PressSection } from '@/components/sections/press-section'
import { SocialSection } from '@/components/sections/social-section'
import { TimelineSection } from '@/components/sections/timeline-section'
import { WorkAreasSection } from '@/components/sections/work-areas-section'
import { books } from '@/content/books'
import { identity } from '@/content/site'
import { getPublishedProfiles } from '@/content/social'
import { buildHomeJsonLd, serializeJsonLd } from '@/lib/seo/jsonld'
import { resolveSiteUrl } from '@/lib/seo/site-url'
import { isContactReasonId } from '@/lib/validation/contact-reasons'

type HomePageProps = { searchParams: Promise<{ motivo?: string | string[] }> }

export default async function HomePage({ searchParams }: HomePageProps) {
  const { motivo } = await searchParams
  const defaultReason = isContactReasonId(motivo) ? motivo : undefined

  const jsonLd = buildHomeJsonLd({
    siteUrl: resolveSiteUrl(),
    name: identity.name,
    jobTitle: identity.role,
    locale: identity.locale,
    sameAs: getPublishedProfiles().map((profile) => profile.url),
    books,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HeroSection />
      <AboutSection />
      <WorkAreasSection />
      <TimelineSection />
      <BooksSection />
      <SocialSection />
      <PressSection />
      <ContactSection defaultReason={defaultReason} />
    </>
  )
}
