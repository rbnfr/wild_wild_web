import type { NextConfig } from 'next'

const isProduction = process.env.NODE_ENV === 'production'

// La Content-Security-Policy lleva un nonce por petición, así que se genera en
// src/proxy.ts. Aquí van las cabeceras estáticas.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Refuerzo para navegadores antiguos; la política moderna es CSP frame-ancestors.
  { key: 'X-Frame-Options', value: 'DENY' },
  ...(isProduction
    ? [
        {
          key: 'Strict-Transport-Security',
          // Sin includeSubDomains ni preload a propósito: son difíciles de revertir
          // y podrían afectar a otros subdominios del dominio final.
          value: 'max-age=31536000',
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
