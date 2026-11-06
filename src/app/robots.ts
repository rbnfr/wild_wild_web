export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  const { readyToIndex, contentSignal, trainingCrawlers } = site.seo;
  return {
    rules:
      readyToIndex && url
        ? [
            {
              userAgent: "*",
              allow: "/",
              other: { "Content-Signal": contentSignal },
            },
            { userAgent: [...trainingCrawlers], disallow: "/" },
          ]
        : { userAgent: "*", disallow: "/" },
    ...(url ? { sitemap: new URL("sitemap.xml", url).href } : {}),
  };
}
