import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

// HTML is generated at build time; the export step hashes its inline scripts for CSP.

const sans = localFont({
  src: "../assets/fonts/dm-sans.woff2",
  variable: "--font-sans",
  display: "swap",
});
const editorial = localFont({
  src: "../assets/fonts/newsreader.woff2",
  variable: "--font-editorial",
  display: "swap",
});
const url = siteUrl();
export const metadata: Metadata = {
  ...(url ? { metadataBase: url, alternates: { canonical: "/" } } : {}),
  title: { default: site.seo.title, template: "%s | Mary Granero" },
  description: site.seo.description,
  robots: {
    index: site.seo.readyToIndex && !!url,
    follow: site.seo.readyToIndex && !!url,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    ...(url ? { url: url.href } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${sans.variable} ${editorial.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Saltar al contenido
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
