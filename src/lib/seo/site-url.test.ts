import { describe, expect, it } from 'vitest'

import { absoluteUrl, isHttps, isIndexingAllowed, resolveSiteUrl } from './site-url'

describe('resolveSiteUrl', () => {
  it('devuelve el origen sin barra final ni ruta', () => {
    expect(resolveSiteUrl('https://marygranero.example/')).toBe('https://marygranero.example')
    expect(resolveSiteUrl('https://marygranero.example/ruta?x=1')).toBe(
      'https://marygranero.example',
    )
  })

  it('cae a localhost si falta o no es válida', () => {
    expect(resolveSiteUrl(undefined)).toBe('http://localhost:3000')
    expect(resolveSiteUrl('')).toBe('http://localhost:3000')
    expect(resolveSiteUrl('no es una url')).toBe('http://localhost:3000')
  })

  it('rechaza protocolos distintos de http y https', () => {
    expect(resolveSiteUrl('javascript:alert(1)')).toBe('http://localhost:3000')
    expect(resolveSiteUrl('ftp://example.com')).toBe('http://localhost:3000')
  })
})

describe('absoluteUrl', () => {
  it('compone URLs absolutas', () => {
    expect(absoluteUrl('/privacidad', 'https://marygranero.example')).toBe(
      'https://marygranero.example/privacidad',
    )
    expect(absoluteUrl('/', 'https://marygranero.example')).toBe('https://marygranero.example/')
  })
})

describe('isHttps', () => {
  it('detecta HTTPS', () => {
    expect(isHttps('https://a.example')).toBe(true)
    expect(isHttps('http://localhost:3000')).toBe(false)
  })
})

describe('isIndexingAllowed', () => {
  const siteUrl = 'https://marygranero.example'

  it('está apagada por defecto', () => {
    expect(isIndexingAllowed(undefined, siteUrl)).toBe(false)
    expect(isIndexingAllowed('', siteUrl)).toBe(false)
    expect(isIndexingAllowed('false', siteUrl)).toBe(false)
    expect(isIndexingAllowed('1', siteUrl)).toBe(false)
  })

  it('solo se activa con "true" explícito y una URL pública válida', () => {
    expect(isIndexingAllowed('true', siteUrl)).toBe(true)
    expect(isIndexingAllowed(' TRUE ', siteUrl)).toBe(true)
  })

  it('sigue bloqueada si falta la URL pública o no es válida, aunque se pida indexar', () => {
    expect(isIndexingAllowed('true', undefined)).toBe(false)
    expect(isIndexingAllowed('true', '')).toBe(false)
    expect(isIndexingAllowed('true', 'no es una url')).toBe(false)
    expect(isIndexingAllowed('true', 'javascript:alert(1)')).toBe(false)
  })
})
