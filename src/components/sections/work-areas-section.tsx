import { ContactLink } from '@/components/ui/contact-link'
import { Section } from '@/components/ui/section'
import { sections, workAreas } from '@/content/site'

export function WorkAreasSection() {
  const { id, title, intro } = sections.workAreas

  return (
    <Section id={id} title={title} intro={intro} tone="dark">
      <ul className="border-y border-niebla/25">
        {workAreas.map((area) => (
          <li
            key={area.id}
            className="grid gap-4 border-b border-niebla/25 py-9 last:border-b-0 md:grid-cols-12 md:gap-8"
          >
            <h3 className="text-h3 font-bold md:col-span-5">{area.title}</h3>
            <div className="md:col-span-7">
              <p className="max-w-[52ch] text-abeto-claro">{area.summary}</p>
              <p className="mt-3">
                <ContactLink reason={area.reason} context={area.title} onDark>
                  Escribir sobre este ámbito
                </ContactLink>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
