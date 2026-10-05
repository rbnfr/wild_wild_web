import Link from "next/link";
import { legalPages } from "@/content/legal";
export function LegalPage({ page }: { page: keyof typeof legalPages }) {
  const content = legalPages[page];
  return (
    <article className="container legal-page">
      <Link className="text-link" href="/">
        Volver al inicio
      </Link>
      <h1>{content.title}</h1>
      <p className="legal-notice">
        <strong>Borrador pendiente de completar.</strong> Este texto contiene
        TODO y debe revisarse con los datos jurídicos reales antes de publicar
        la web o recibir solicitudes de personas reales.
      </p>
      {content.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((text, index) => (
            <p key={`${section.title}-${index}`}>{text}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
