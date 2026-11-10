import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Hero,
  About,
  Services,
  Outreach,
  Collaborations,
  Contact,
} from "@/components/sections";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/i18n/config";
import { alternates } from "@/i18n/routes";
import { safeJsonLd, structuredData } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return { alternates: alternates("home", lang) };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <Hero t={t} />
      <About t={t} />
      <Services t={t} />
      <Outreach t={t} />
      <Collaborations t={t} />
      <Contact lang={lang} t={t} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData(lang)) }}
      />
    </>
  );
}
