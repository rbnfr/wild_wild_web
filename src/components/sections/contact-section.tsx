import { headers } from 'next/headers'

import { ContactForm } from '@/components/forms/contact-form'
import { Section } from '@/components/ui/section'
import { contactInfo, sections } from '@/content/site'
import type { ContactReasonId } from '@/lib/validation/contact-reasons'

type ContactSectionProps = { defaultReason?: ContactReasonId }

export async function ContactSection({ defaultReason }: ContactSectionProps) {
  const { id, title, intro } = sections.contact
  // El nonce permite que Turnstile cargue bajo la CSP estricta.
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined
  const { email, phone, location } = contactInfo
  const hasDirectContact = Boolean(email || phone || location)

  return (
    <Section
      id={id}
      title={title}
      intro={intro}
      tone="paper"
      aside={
        hasDirectContact ? (
          <ul className="mt-8 space-y-1 font-display text-lg font-medium text-abeto">
            {email ? (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="underline decoration-ambar decoration-2 underline-offset-4"
                >
                  {email}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="underline decoration-ambar decoration-2 underline-offset-4"
                >
                  {phone}
                </a>
              </li>
            ) : null}
            {location ? <li>{location}</li> : null}
          </ul>
        ) : null
      }
    >
      <div className="rounded-panel border border-salvia bg-niebla p-6 shadow-float sm:p-10">
        <ContactForm
          key={defaultReason ?? 'sin-motivo'}
          defaultReason={defaultReason}
          turnstileSiteKey={turnstileSiteKey}
          nonce={nonce}
        />
      </div>
    </Section>
  )
}
