import { Photo } from '@/components/ui/photo'
import { Section } from '@/components/ui/section'
import { about, sections } from '@/content/site'

export function AboutSection() {
  const { id, title } = sections.about

  return (
    <Section id={id} title={title}>
      <div className="grid gap-12 md:grid-cols-5 md:gap-10">
        <div className="space-y-10 md:col-span-3">
          <div className="space-y-5">
            {about.bio.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-lead' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          <div>
            <h3 className="font-display text-ui font-semibold text-musgo">Su forma de trabajar</h3>
            <p className="mt-3 font-display text-h3 font-semibold text-abeto">{about.philosophy}</p>
          </div>

          <aside className="border-l-4 border-ambar pl-5">
            <h3 className="font-display text-lg font-bold text-abeto">{about.ethologyTitle}</h3>
            <p className="mt-2 max-w-[56ch] text-musgo">{about.ethologyText}</p>
          </aside>
        </div>

        <div className="viewfinder md:col-span-2 md:self-start">
          <Photo
            image={about.image}
            sizes="(min-width: 1024px) 26vw, (min-width: 768px) 36vw, 90vw"
          />
        </div>
      </div>
    </Section>
  )
}
