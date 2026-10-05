import { Container } from '@/components/ui/container'
import { legal, type LegalSection } from '@/content/legal'
import { buildBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/jsonld'
import { resolveSiteUrl } from '@/lib/seo/site-url'
import { identity } from '@/content/site'

type LegalDocumentProps = {
  title: string
  path: string
  intro?: string
  sections: LegalSection[]
}

/** Estructura común de las páginas legales: un único h1, secciones con h2 y migas para SEO. */
export function LegalDocument({ title, path, intro, sections }: LegalDocumentProps) {
  const breadcrumbs = buildBreadcrumbJsonLd(
    [
      { name: identity.name, path: '/' },
      { name: title, path },
    ],
    resolveSiteUrl(),
  )

  return (
    <article className="bg-niebla py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Container className="max-w-[56rem]">
        <h1 className="text-h2 font-extrabold text-abeto">{title}</h1>

        {legal.status === 'draft' ? (
          <p className="mt-6 rounded-control border-2 border-dashed border-ambar-oscuro bg-papel p-4 font-display text-ui font-medium text-ink">
            Borrador pendiente de revisión legal. Los datos marcados con TODO deben completarse con
            información real antes de publicar la web.
          </p>
        ) : null}

        <p className="mt-6 font-display text-ui text-musgo">
          Última actualización: {legal.lastUpdated}
        </p>
        {intro ? <p className="mt-6 max-w-[62ch] text-lead">{intro}</p> : null}

        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`${section.id}-titulo`}>
              <h2 id={`${section.id}-titulo`} className="text-h3 font-bold text-abeto">
                {section.title}
              </h2>
              <div className="mt-4 max-w-[62ch] space-y-4">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items ? (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  )
}
