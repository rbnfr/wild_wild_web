import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// Development only: lets phones and tablets on the local network open the dev
// server at http://<this computer's IP>:3000. Without it Next.js refuses their
// hot-reload connection and the page never becomes interactive there.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((address) => address?.family === "IPv4" && !address.internal)
  .map((address) => address!.address);

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  allowedDevOrigins: lanAddresses,
  // Routes live under app/[lang], so unmatched URLs need a 404 of their own.
  experimental: { globalNotFound: true },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/static-image-loader.ts",
    deviceSizes: [320, 480, 640, 854, 1024],
    imageSizes: [160, 240, 297],
  },
};
export default config;
