import localFont from "next/font/local";

// Shared by every root layout (each language and the language detector).
export const sans = localFont({
  src: "../assets/fonts/figtree.woff2",
  variable: "--font-sans",
  weight: "300 900",
  display: "swap",
});
