import { books } from '@/content/books'
import type { NavItem } from '@/content/types'
import { socialProfiles } from '@/content/social'
import { timeline } from '@/content/timeline'

/** Secciones que se ocultan solas cuando su contenido está vacío. */
function hiddenSectionIds(): Set<string> {
  const hidden = new Set<string>()
  if (books.length === 0) hidden.add('libros')
  if (socialProfiles.length === 0) hidden.add('redes')
  if (timeline.length === 0) hidden.add('trayectoria')
  return hidden
}

/** Quita de los menús los enlaces a secciones que no se muestran. */
export function visibleNavItems(items: NavItem[]): NavItem[] {
  const hidden = hiddenSectionIds()
  return items.filter((item) => !hidden.has(item.href.replace('/#', '')))
}

export function contactHref(reason?: string): string {
  return reason ? `/?motivo=${encodeURIComponent(reason)}#contacto` : '/#contacto'
}
