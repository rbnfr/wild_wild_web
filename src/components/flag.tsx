import type { Locale } from "@/i18n/config";

// Flags drawn inline: no request, and no automatic image preload competing
// with the hero photograph. Decorative: the language name always goes with it.
// The British flag's offset red diagonals are polygons instead of a clipPath,
// so repeated flags never share an id.
const flags: Record<Locale, { viewBox: string; paths: [string, string][] }> = {
  es: {
    viewBox: "0 0 750 500",
    paths: [
      ["#AA151B", "M0 0h750v500H0z"],
      ["#F1BF00", "M0 125h750v250H0z"],
    ],
  },
  en: {
    viewBox: "0 0 60 30",
    paths: [
      ["#012169", "M0 0h60v30H0z"],
      [
        "#FFF",
        "M0 0h6.71L60 26.65V30h-6.71L0 3.35zM60 0v3.35L6.71 30H0v-3.35L53.29 0z",
      ],
      [
        "#C8102E",
        "M0 0l30 15h-4.47L0 2.24zM60 30 30 15h4.47L60 27.76zM0 30l30-15v2.24L4.47 30zM60 0 30 15v-2.24L55.53 0z",
      ],
      ["#FFF", "M25 0h10v10h25v10H35v10H25V20H0V10h25z"],
      ["#C8102E", "M27 0h6v12h27v6H33v12h-6V18H0v-6h27z"],
    ],
  },
};

export function Flag({
  lang,
  width,
  height,
  className,
}: {
  lang: Locale;
  width: number;
  height: number;
  className?: string;
}) {
  const { viewBox, paths } = flags[lang];
  return (
    <svg
      className={className}
      data-flag={lang}
      viewBox={viewBox}
      width={width}
      height={height}
      // Fills the box like object-fit: cover, whatever the flag's proportions.
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map(([fill, d]) => (
        <path key={d} fill={fill} d={d} />
      ))}
    </svg>
  );
}
