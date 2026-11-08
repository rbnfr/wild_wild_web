export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { alternates } from "@/i18n/routes";
import { siteUrl, sitePages } from "@/lib/seo";
import { lastModified } from "@/lib/last-modified";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  const absolute = (path: string) => (url ? new URL(path, url).href : path);
  return url
    ? sitePages.map(({ page, lang, path, sources }) => {
        const date = lastModified(sources);
        const { languages } = alternates(page, lang);
        return {
          url: absolute(path),
          ...(date ? { lastModified: date } : {}),
          alternates: {
            languages: Object.fromEntries(
              Object.entries(languages).map(([code, link]) => [
                code,
                absolute(link),
              ]),
            ),
          },
        };
      })
    : [];
}
