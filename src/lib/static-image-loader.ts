"use client";
import manifest from "@/content/static-images.json";

export default function staticImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  const images = manifest as Record<string, Record<string, string>>;
  const variants = images[src];
  if (!variants) return src;
  const widths = Object.keys(variants)
    .map(Number)
    .sort((a, b) => a - b);
  const selected =
    widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];
  return variants[String(selected)];
}
