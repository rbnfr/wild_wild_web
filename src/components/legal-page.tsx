import { legalPages } from "@/content/legal";
export function LegalPage({ page }: { page: keyof typeof legalPages }) {
  const content = legalPages[page];
  return (
    <article className="container legal-page">
      <a className="text-link" href="/">
        Volver al inicio
      </a>
      <h1>{content.title}</h1>
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
