import { ArrowDownIcon } from "@/components/icon";
import { RichText } from "@/components/rich-text";
import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds } from "@/content/sections";

export function About({ t }: { t: Dictionary }) {
  return (
    <section
      className="section about-section"
      id={sectionIds.about}
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <h2 id="about-title">{t.about.title}</h2>
        <div className="about-copy">
          {t.about.paragraphs.map((text) => (
            <p key={text}>
              <RichText text={text} />
            </p>
          ))}
          <a className="text-link" href={sectionHash("services")}>
            {t.about.cta}
            <span aria-hidden="true">
              <ArrowDownIcon size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
