import { ButtonLink } from '@/components/ui/button'
import { ContactLink } from '@/components/ui/contact-link'
import { Section } from '@/components/ui/section'
import { press, sections } from '@/content/site'
import { contactHref } from '@/lib/navigation'

export function PressSection() {
  const { id, title, intro } = sections.press

  return (
    <Section id={id} title={title} intro={intro} tone="sand">
      <ul className="grid border-t border-abeto/30 sm:grid-cols-2">
        {press.types.map((type, index) => (
          <li
            key={type.id}
            className={`border-b border-abeto/30 py-8 sm:px-8 ${index % 2 === 0 ? 'sm:border-r sm:pl-0' : 'sm:pr-0'}`}
          >
            <h3 className="text-h3 font-bold text-abeto">{type.title}</h3>
            <p className="mt-3 max-w-[40ch]">{type.summary}</p>
            <p className="mt-3">
              <ContactLink reason={type.reason} context={type.title}>
                Enviar una propuesta
              </ContactLink>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href={contactHref('prensa-medios')}>{press.cta.label}</ButtonLink>
      </div>
    </Section>
  )
}
