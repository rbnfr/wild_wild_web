import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";

// Umami: no cookies, no local storage, no IP addresses kept, so it needs no
// consent banner. An external file with no inline code, so the CSP only needs
// its origin (added by the export from this very tag), not a hash.
export function Analytics() {
  const { websiteId, script } = site.analytics;
  const url = siteUrl();
  if (!websiteId || !url) return null;
  return (
    <script
      defer
      src={script}
      data-website-id={websiteId}
      // Only the published domain is counted: local previews send nothing.
      data-domains={url.hostname}
      data-do-not-track="true"
    />
  );
}
