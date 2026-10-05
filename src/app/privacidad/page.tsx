import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/content/legal";
export const metadata: Metadata = {
  title: legalPages.privacidad.title,
  description: legalPages.privacidad.description,
  alternates: { canonical: "/privacidad" },
};
export default function Page() {
  return <LegalPage page="privacidad" />;
}
