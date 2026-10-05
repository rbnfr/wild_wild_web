import { LegalDocument } from '@/components/sections/legal-document'
import { cookieSections } from '@/content/legal'
import { buildPageMetadata } from '@/lib/seo/metadata'

const path = '/cookies'
const title = 'Política de cookies'

export const metadata = buildPageMetadata({
  title,
  description: 'Información sobre el uso de cookies y tecnologías similares en este sitio web.',
  path,
})

export default function CookiesPage() {
  return <LegalDocument title={title} path={path} sections={cookieSections} />
}
