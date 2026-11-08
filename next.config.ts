import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  // Routes live under app/[lang], so unmatched URLs need a 404 of their own.
  experimental: { globalNotFound: true },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/static-image-loader.ts",
    deviceSizes: [320, 480, 640, 704, 854],
    imageSizes: [160, 240, 297],
  },
};
export default config;
