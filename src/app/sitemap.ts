export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  return url
    ? ["/", "/aviso-legal/", "/privacidad/", "/cookies/"].map((path) => ({
        url: new URL(path, url).href,
      }))
    : [];
}
