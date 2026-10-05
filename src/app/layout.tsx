import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Literata } from 'next/font/google'
import { connection } from 'next/server'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { identity } from '@/content/site'
import { buildRootMetadata } from '@/lib/seo/metadata'

import '@/styles/globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
  variable: '--font-bricolage',
})

const body = Literata({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-literata',
})

export function generateMetadata(): Metadata {
  return buildRootMetadata()
}

export const viewport: Viewport = {
  themeColor: '#edf0ea',
  colorScheme: 'light',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // La CSP usa un nonce por petición, así que todas las páginas se renderizan bajo demanda.
  await connection()

  return (
    <html lang={identity.locale.slice(0, 2)} className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#contenido"
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-full bg-abeto px-5 py-3 font-display text-ui font-semibold text-niebla focus:translate-y-0"
        >
          Saltar al contenido principal
        </a>
        <SiteHeader />
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
