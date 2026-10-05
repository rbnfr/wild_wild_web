import { IrisMark } from '@/components/ui/icons'
import { Section } from '@/components/ui/section'
import { sections } from '@/content/site'
import { timeline, timelineKindLabels } from '@/content/timeline'

export function TimelineSection() {
  const { id, title, intro } = sections.timeline
  if (timeline.length === 0) return null

  return (
    <Section id={id} title={title} intro={intro}>
      <ol className="relative ml-2 space-y-12 border-l-2 border-salvia pl-9 sm:ml-3 sm:pl-12">
        {timeline.map((entry) => (
          <li key={entry.id} className="relative">
            <IrisMark className="absolute top-1 -left-[3.06rem] size-6 rounded-full bg-niebla sm:-left-[3.81rem]" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-display text-lg font-bold text-ambar-oscuro">{entry.period}</p>
              <p className="rounded-full border border-musgo/60 px-3 py-0.5 font-display text-sm font-medium text-musgo">
                {timelineKindLabels[entry.kind]}
              </p>
            </div>
            <h3 className="mt-2 text-h3 font-bold text-abeto">{entry.title}</h3>
            {entry.description ? (
              <p className="mt-2 max-w-[56ch] text-musgo">{entry.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  )
}
