export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl, sitePages } from "@/lib/seo";
import { lastModified } from "@/lib/last-modified";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  return url
    ? sitePages.map(({ path, sources }) => {
        const date = lastModified(sources);
        return {
          url: new URL(path, url).href,
          ...(date ? { lastModified: date } : {}),
        };
      })
    : [];
}
