import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  return {
    rules: {
      userAgent: "*",
      ...(site.seo.readyToIndex && url
        ? { allow: "/", disallow: "/api/" }
        : { disallow: "/" }),
    },
    ...(url ? { sitemap: new URL("sitemap.xml", url).href } : {}),
  };
}
