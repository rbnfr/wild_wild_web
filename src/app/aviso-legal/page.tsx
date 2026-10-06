import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/content/legal";
export const metadata: Metadata = {
  title: legalPages["aviso-legal"].title,
  description: legalPages["aviso-legal"].description,
  alternates: { canonical: "/aviso-legal/" },
};
export default function Page() {
  return <LegalPage page="aviso-legal" />;
}
