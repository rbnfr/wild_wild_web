import type { ContactReasonId } from '@/lib/validation/contact-reasons'

/**
 * Convención de contenido provisional:
 * - Todo texto pendiente de datos reales empieza por "TODO:".
 * - Las entradas completas que son de muestra llevan `placeholder: true`.
 * - `npm run check:content` lista todo lo que sigue pendiente.
 */

/** Hueco para una fotografía. Mientras `src` esté vacío se muestra un marcador visible. */
export type ImageSlot = {
  /** Ruta dentro de /public, por ejemplo "/images/mary-hero.jpg". */
  src?: string
  /** Texto alternativo descriptivo. Si la foto fuese decorativa, usa "". */
  alt: string
  /** Dimensiones reales del archivo (o proporción deseada mientras sea un marcador). */
  width: number
  height: number
  /** Texto del marcador, con la proporción y el tamaño recomendados. */
  placeholderLabel: string
}

export type Link = { label: string; href: string }

export type NavItem = Link

export type Audience = {
  /** Frase corta desde el punto de vista del visitante. */
  label: string
  reason: ContactReasonId
}

export type WorkArea = {
  id: string
  title: string
  summary: string
  reason: ContactReasonId
}

export type CollaborationType = {
  id: string
  title: string
  summary: string
  reason: ContactReasonId
}

export type SectionIntro = { id: string; title: string; intro: string }

export type TimelineKind =
  'formacion' | 'hito' | 'proyecto' | 'publicacion' | 'aparicion' | 'colaboracion'

export type TimelineEntry = {
  id: string
  /** Texto libre: "2019", "2018 - 2021"… */
  period: string
  kind: TimelineKind
  title: string
  description?: string
  placeholder?: boolean
}

export type BookPurchaseLink = { label: string; href: string }

export type Book = {
  id: string
  title: string
  subtitle?: string
  year?: number
  publisher?: string
  description: string
  isbn?: string
  cover: ImageSlot
  /** Solo enlaces confirmados. No añadir enlaces afiliados sin indicación expresa. */
  purchaseLinks: BookPurchaseLink[]
  /** Los libros de muestra no generan datos estructurados. */
  placeholder?: boolean
}

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin' | 'x'

export type SocialProfile = {
  platform: SocialPlatform
  /** Nombre visible: "Instagram". */
  label: string
  /** Perfil público, con https. Si falta, se muestra como pendiente y no se enlaza. */
  url?: string
  handle?: string
  /** Qué se puede encontrar allí. */
  description: string
  placeholder?: boolean
}
