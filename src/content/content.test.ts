import { describe, expect, it } from 'vitest'

import { books } from '@/content/books'
import { legal } from '@/content/legal'
import { footerNav, headerNav, hero, press, sections, workAreas } from '@/content/site'
import { socialProfiles } from '@/content/social'
import { timeline } from '@/content/timeline'
import { contactHref, visibleNavItems } from '@/lib/navigation'
import { isContactReasonId } from '@/lib/validation/contact-reasons'

const anchors = ['inicio', ...Object.values(sections).map((section) => section.id)]
const isUnique = (values: string[]) => new Set(values).size === values.length

describe('navegación', () => {
  it('todos los enlaces apuntan a una sección que existe', () => {
    for (const item of [...headerNav, ...footerNav]) {
      expect(item.href.startsWith('/#'), item.href).toBe(true)
      expect(anchors, item.href).toContain(item.href.slice(2))
    }
  })

  it('con contenido en todas las secciones no se oculta ningún enlace', () => {
    expect(visibleNavItems(headerNav)).toEqual(headerNav)
  })

  it('contactHref preselecciona el motivo con el parámetro "motivo"', () => {
    expect(contactHref()).toBe('/#contacto')
    expect(contactHref('prensa-medios')).toBe('/?motivo=prensa-medios#contacto')
  })
})

describe('motivos de contacto', () => {
  it('todos los enlaces con motivo usan identificadores válidos', () => {
    const reasons = [
      ...hero.audiences.map((item) => item.reason),
      ...workAreas.map((item) => item.reason),
      ...press.types.map((item) => item.reason),
    ]
    for (const reason of reasons) expect(isContactReasonId(reason), reason).toBe(true)
  })
})

describe('identificadores', () => {
  it('no se repiten dentro de cada lista', () => {
    expect(isUnique(workAreas.map((item) => item.id))).toBe(true)
    expect(isUnique(press.types.map((item) => item.id))).toBe(true)
    expect(isUnique(timeline.map((item) => item.id))).toBe(true)
    expect(isUnique(books.map((item) => item.id))).toBe(true)
    expect(isUnique(socialProfiles.map((item) => item.platform))).toBe(true)
  })
})

describe('enlaces externos', () => {
  it('las redes publicadas usan https', () => {
    for (const profile of socialProfiles) {
      if (profile.url) expect(profile.url, profile.platform).toMatch(/^https:\/\//)
    }
  })

  it('los enlaces de compra usan https', () => {
    for (const book of books) {
      for (const link of book.purchaseLinks) expect(link.href, book.id).toMatch(/^https:\/\//)
    }
  })
})

describe('contenido provisional', () => {
  it('lo que no está marcado como muestra no contiene TODO', () => {
    for (const entry of timeline.filter((item) => !item.placeholder)) {
      expect(JSON.stringify(entry), entry.id).not.toContain('TODO')
    }
    for (const book of books.filter((item) => !item.placeholder)) {
      expect(JSON.stringify(book), book.id).not.toContain('TODO')
    }
    for (const profile of socialProfiles.filter((item) => !item.placeholder)) {
      expect(JSON.stringify(profile), profile.platform).not.toContain('TODO')
    }
  })

  it('las entradas de muestra no llevan datos que parezcan reales', () => {
    for (const book of books.filter((item) => item.placeholder)) {
      expect(book.isbn, book.id).toBeUndefined()
      expect(book.purchaseLinks, book.id).toEqual([])
    }
    for (const profile of socialProfiles.filter((item) => item.placeholder)) {
      expect(profile.url, profile.platform).toBeUndefined()
    }
  })

  it('las páginas legales solo se dan por revisadas si no queda ningún TODO', () => {
    if (legal.status === 'reviewed') {
      expect(JSON.stringify(legal)).not.toContain('TODO')
    }
  })
})
