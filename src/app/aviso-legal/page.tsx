import { LegalDocument } from '@/components/sections/legal-document'
import { legalNoticeSections } from '@/content/legal'
import { buildPageMetadata } from '@/lib/seo/metadata'

const path = '/aviso-legal'
const title = 'Aviso legal'

export const metadata = buildPageMetadata({
  title,
  description: 'Aviso legal y condiciones de uso del sitio web de Mary Granero.',
  path,
})

export default function LegalNoticePage() {
  return <LegalDocument title={title} path={path} sections={legalNoticeSections} />
}
