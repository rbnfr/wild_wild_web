import { describe, expect, it } from 'vitest'

import { getClientIp, UNKNOWN_IP } from './client-ip'

const headers = (forwarded?: string) =>
  new Headers(forwarded === undefined ? {} : { 'x-forwarded-for': forwarded })

describe('getClientIp', () => {
  it('con un proxy de confianza usa la última IP de la cadena', () => {
    expect(getClientIp(headers('6.6.6.6, 203.0.113.9'), 1)).toBe('203.0.113.9')
  })

  it('ignora lo que el cliente falsifique a la izquierda', () => {
    expect(getClientIp(headers('1.1.1.1, 2.2.2.2, 203.0.113.9'), 1)).toBe('203.0.113.9')
  })

  it('con varios proxies cuenta desde la derecha', () => {
    expect(getClientIp(headers('1.1.1.1, 203.0.113.9, 10.0.0.1'), 2)).toBe('203.0.113.9')
  })

  it('si hay menos entradas que proxies usa la primera', () => {
    expect(getClientIp(headers('203.0.113.9'), 3)).toBe('203.0.113.9')
  })

  it('sin proxies de confianza no se fía de ninguna cabecera', () => {
    expect(getClientIp(headers('203.0.113.9'), 0)).toBe(UNKNOWN_IP)
  })

  it('devuelve desconocida si falta la cabecera o no es una IP', () => {
    expect(getClientIp(headers(), 1)).toBe(UNKNOWN_IP)
    expect(getClientIp(headers('no-es-una-ip'), 1)).toBe(UNKNOWN_IP)
    expect(getClientIp(headers(''), 1)).toBe(UNKNOWN_IP)
  })

  it('admite IPv6 y la normaliza a minúsculas', () => {
    expect(getClientIp(headers('2001:DB8::1'), 1)).toBe('2001:db8::1')
  })
})
