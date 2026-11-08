import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/i18n/config";
import {
  alternates,
  legalPageIds,
  pageFromSlug,
  routes,
  type LegalPageId,
} from "@/i18n/routes";

// One route serves every legal page, each with its translated slug.
export const dynamicParams = false;
export function generateStaticParams({
  params: { lang },
}: {
  params: { lang: string };
}) {
  if (!hasLocale(lang)) return [];
  return legalPageIds.map((page) => ({ slug: routes[page][lang] }));
}

async function resolve(params: PageProps<"/[lang]/[slug]">["params"]) {
  const { lang, slug } = await params;
  const page = hasLocale(lang) ? pageFromSlug(lang, slug) : undefined;
  if (!hasLocale(lang) || !page || page === "home") notFound();
  return { lang, page: page as LegalPageId };
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, page } = await resolve(params);
  const { title, description } = getDictionary(lang).legal[page];
  return { title, description, alternates: alternates(page, lang) };
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, page } = await resolve(params);
  return <LegalPage lang={lang} page={page} t={getDictionary(lang)} />;
}
