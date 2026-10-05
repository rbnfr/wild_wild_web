import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildPageMetadata, buildRootMetadata } from './metadata'

afterEach(() => vi.unstubAllEnvs())

describe('buildRootMetadata', () => {
  it('define título, descripción, canonical y tarjetas sociales', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://marygranero.example')
    const metadata = buildRootMetadata()

    expect(metadata.metadataBase?.toString()).toBe('https://marygranero.example/')
    expect(metadata.title).toMatchObject({ default: expect.stringContaining('Mary Granero') })
    expect(metadata.description).toBeTruthy()
    expect(metadata.alternates?.canonical).toBe('/')
    expect(metadata.openGraph).toMatchObject({ type: 'website', locale: 'es_ES' })
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('no permite indexar mientras ALLOW_INDEXING no sea "true"', () => {
    vi.stubEnv('ALLOW_INDEXING', 'false')
    expect(buildRootMetadata().robots).toMatchObject({ index: false, follow: false })
  })

  it('permite indexar cuando ALLOW_INDEXING es "true" y hay URL pública', () => {
    vi.stubEnv('ALLOW_INDEXING', 'true')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://marygranero.example')
    expect(buildRootMetadata().robots).toEqual({ index: true, follow: true })
  })

  it('no permite indexar si falta NEXT_PUBLIC_SITE_URL, para no publicar canonicals a localhost', () => {
    vi.stubEnv('ALLOW_INDEXING', 'true')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    expect(buildRootMetadata().robots).toMatchObject({ index: false, follow: false })
  })
})

describe('buildPageMetadata', () => {
  it('añade canonical propio y conserva tipo y sitio en Open Graph', () => {
    const metadata = buildPageMetadata({
      title: 'Aviso legal',
      description: 'Descripción',
      path: '/aviso-legal',
    })
    expect(metadata.title).toBe('Aviso legal')
    expect(metadata.alternates?.canonical).toBe('/aviso-legal')
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: 'Mary Granero',
      url: '/aviso-legal',
      title: 'Aviso legal | Mary Granero',
    })
  })
})
