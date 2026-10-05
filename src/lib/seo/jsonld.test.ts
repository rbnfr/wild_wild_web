import { describe, expect, it } from 'vitest'

import type { Book } from '@/content/types'

import { buildBookJsonLd, buildBreadcrumbJsonLd, buildHomeJsonLd, serializeJsonLd } from './jsonld'

const siteUrl = 'https://marygranero.example'

const realBook: Book = {
  id: 'libro',
  title: 'Título real',
  subtitle: 'Subtítulo',
  year: 2020,
  publisher: 'Editorial X',
  description: 'Descripción.',
  isbn: '978-84-0000-000-0',
  cover: {
    src: '/images/libro.jpg',
    alt: 'Portada',
    width: 800,
    height: 1200,
    placeholderLabel: '',
  },
  purchaseLinks: [],
}

const sampleBook: Book = { ...realBook, id: 'muestra', title: 'TODO', placeholder: true }

const base = { siteUrl, name: 'Mary Granero', jobTitle: 'Etóloga', locale: 'es-ES' }

describe('serializeJsonLd', () => {
  it('escapa "<" para que no se pueda cerrar el script', () => {
    const output = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(output).not.toContain('<')
    expect(JSON.parse(output)).toEqual({ name: '</script><script>alert(1)</script>' })
  })

  it('escapa los separadores de línea Unicode', () => {
    expect(serializeJsonLd({ a: 'x\u2028y\u2029z' })).not.toMatch(/[\u2028\u2029]/)
  })
})

describe('buildHomeJsonLd', () => {
  it('describe a la persona y el sitio sin inventar datos', () => {
    const data = buildHomeJsonLd({ ...base, sameAs: [], books: [] })
    const graph = data['@graph'] as Record<string, unknown>[]
    const person = graph.find((node) => node['@type'] === 'Person')
    const website = graph.find((node) => node['@type'] === 'WebSite')

    expect(person).toEqual({
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Mary Granero',
      jobTitle: 'Etóloga',
      url: siteUrl,
    })
    expect(person).not.toHaveProperty('sameAs')
    expect(website).toMatchObject({ '@type': 'WebSite', inLanguage: 'es-ES', url: siteUrl })
  })

  it('incluye sameAs solo cuando hay perfiles reales', () => {
    const data = buildHomeJsonLd({
      ...base,
      sameAs: ['https://www.instagram.com/mary/'],
      books: [],
    })
    const person = (data['@graph'] as Record<string, unknown>[]).find(
      (node) => node['@type'] === 'Person',
    )
    expect(person?.sameAs).toEqual(['https://www.instagram.com/mary/'])
  })

  it('incluye los libros reales y excluye los de muestra', () => {
    const data = buildHomeJsonLd({ ...base, sameAs: [], books: [realBook, sampleBook] })
    const books = (data['@graph'] as Record<string, unknown>[]).filter(
      (node) => node['@type'] === 'Book',
    )
    expect(books).toHaveLength(1)
    expect(books[0]?.name).toBe('Título real')
  })
})

describe('buildBookJsonLd', () => {
  it('incluye los datos presentes y omite los ausentes', () => {
    const book = buildBookJsonLd(realBook, { siteUrl })
    expect(book).toMatchObject({
      '@type': 'Book',
      name: 'Título real',
      isbn: '978-84-0000-000-0',
      datePublished: '2020',
      publisher: { '@type': 'Organization', name: 'Editorial X' },
      image: `${siteUrl}/images/libro.jpg`,
      author: { '@id': `${siteUrl}/#person` },
    })

    const minimal = buildBookJsonLd(
      {
        ...realBook,
        isbn: undefined,
        year: undefined,
        publisher: undefined,
        subtitle: undefined,
        cover: { ...realBook.cover, src: undefined },
      },
      { siteUrl },
    )
    expect(minimal).not.toHaveProperty('isbn')
    expect(minimal).not.toHaveProperty('datePublished')
    expect(minimal).not.toHaveProperty('publisher')
    expect(minimal).not.toHaveProperty('image')
  })
})

describe('buildBreadcrumbJsonLd', () => {
  it('numera las posiciones y usa URLs absolutas', () => {
    const data = buildBreadcrumbJsonLd(
      [
        { name: 'Mary Granero', path: '/' },
        { name: 'Privacidad', path: '/privacidad' },
      ],
      siteUrl,
    )
    expect(data.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Mary Granero', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Privacidad', item: `${siteUrl}/privacidad` },
    ])
  })
})
