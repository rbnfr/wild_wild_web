import { LegalDocument } from '@/components/sections/legal-document'
import { privacySections } from '@/content/legal'
import { buildPageMetadata } from '@/lib/seo/metadata'

const path = '/privacidad'
const title = 'Política de privacidad'

export const metadata = buildPageMetadata({
  title,
  description: 'Cómo se tratan los datos personales que se facilitan en el formulario de contacto.',
  path,
})

export default function PrivacyPage() {
  return (
    <LegalDocument
      title={title}
      path={path}
      intro="Esta política explica qué datos se recogen a través del formulario de contacto, para qué se usan y cómo puedes ejercer tus derechos."
      sections={privacySections}
    />
  )
}
