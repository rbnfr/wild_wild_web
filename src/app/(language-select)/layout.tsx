import type { Metadata } from "next";
import { site } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale } from "@/i18n/config";
import { localeRedirectScript } from "@/i18n/detect";
import { alternates, href } from "@/i18n/routes";
import { siteUrl } from "@/lib/seo";

const { seo } = getDictionary(defaultLocale);
const url = siteUrl();

// "/" only picks a language: x-default of the home page in every hreflang set.
export const metadata: Metadata = {
  ...(url ? { metadataBase: url } : {}),
  title: site.name,
  description: seo.description,
  alternates: { ...alternates("home", defaultLocale), canonical: "/" },
  robots: {
    index: site.seo.readyToIndex && !!url,
    follow: site.seo.readyToIndex && !!url,
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: seo.title,
    description: seo.description,
    url: "/",
    images: `${href(defaultLocale)}opengraph-image`,
  },
};

// No stylesheet or web font: the redirect script runs without waiting for them,
// and these few rules are enough for the no-JavaScript fallback.
const css = `body{margin:0;font-family:system-ui,sans-serif;color:#0f2744}
main{min-height:100vh;display:grid;place-content:center;justify-items:center;gap:8px;padding:16px;text-align:center}
h1{margin:0;font-size:34px;color:#0c3a7a}
ul{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;padding:0;list-style:none}
a{display:flex;align-items:center;gap:12px;min-height:52px;padding:10px 24px;border:1px solid #cfdeef;border-radius:999px;font-weight:600;color:inherit;text-decoration:none}
img{border-radius:4px;box-shadow:0 0 0 1px rgb(15 39 68/.14)}`;

export default function LanguageSelectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeRedirectScript }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${href(defaultLocale)}`} />
        </noscript>
        <style>{css}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
