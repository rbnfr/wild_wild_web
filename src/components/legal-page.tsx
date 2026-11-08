import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/i18n/config";
import { href, type LegalPageId } from "@/i18n/routes";

export function LegalPage({
  lang,
  page,
  t,
}: {
  lang: Locale;
  page: LegalPageId;
  t: Dictionary;
}) {
  const content = t.legal[page];
  return (
    <article className="container legal-page">
      <a className="text-link" href={href(lang)}>
        {t.common.backHome}
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
