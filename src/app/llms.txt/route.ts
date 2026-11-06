export const dynamic = "force-static";
import { llmsTxt } from "@/lib/llms";
import { siteUrl } from "@/lib/seo";
export function GET() {
  const url = siteUrl();
  return url
    ? new Response(llmsTxt(url), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    : new Response(null, { status: 404 });
}
