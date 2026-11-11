import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { site } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale, localeDetails, locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { theme } from "@/content/theme";
import { siteUrl } from "@/lib/seo";
import { sans } from "../fonts";
import "@/styles/index.css";

// HTML is generated at build time; the export step hashes its inline scripts for CSP.
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const viewport: Viewport = {
  themeColor: theme.background,
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { seo } = getDictionary(lang);
  const url = siteUrl();
  return {
    ...(url ? { metadataBase: url } : {}),
    title: { default: seo.title, template: `%s | ${site.name}` },
    description: seo.description,
    robots: {
      index: site.seo.readyToIndex && !!url,
      follow: site.seo.readyToIndex && !!url,
    },
    openGraph: {
      type: "website",
      locale: localeDetails[lang].ogLocale,
      alternateLocale: locales
        .filter((code) => code !== lang)
        .map((code) => localeDetails[code].ogLocale),
      siteName: site.name,
      url: href(lang),
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <html lang={lang} className={sans.variable}>
      <body>
        <a className="skip-link" href="#main">
          {t.common.skipLink}
        </a>
        <Header lang={lang} t={t.header} languageLabel={t.common.language} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer lang={lang} t={t} />
        <Analytics />
      </body>
    </html>
  );
}
