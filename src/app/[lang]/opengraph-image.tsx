export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";

export const generateStaticParams = () => locales.map((lang) => ({ lang }));
export const alt = "Mary Granero";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(hasLocale(lang) ? lang : defaultLocale);
  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #0c3a7a 0%, #1559b5 60%, #1a64c6 100%)",
        color: "#ffffff",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 45 }}>Mary Granero</div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: 950,
        }}
      >
        {t.hero.title}
      </div>
      <div style={{ fontSize: 26, marginTop: 45 }}>{t.seo.ogTagline}</div>
    </div>,
    size,
  );
}
