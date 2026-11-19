import Image, { type ImageProps } from "next/image";
import manifest from "@/content/static-images.json";

export function StaticImage(props: ImageProps) {
  const images = manifest as Record<string, Record<string, string>>;
  const variants =
    typeof props.src === "string" ? images[props.src] : undefined;
  // Sources are not published (src/assets/photos): only their variants are.
  if (!variants)
    throw new Error(
      `No generated variants for ${String(props.src)}: run scripts/prepare-images.mjs`,
    );
  const srcSet = Object.entries(variants)
    .map(([width, path]) => `${path.replace(/\.webp$/, ".avif")} ${width}w`)
    .join(", ");
  return (
    <picture className={props.fill ? "picture-fill" : "picture-cover"}>
      <source type="image/avif" srcSet={srcSet} sizes={props.sizes} />
      <Image {...props} />
    </picture>
  );
}
