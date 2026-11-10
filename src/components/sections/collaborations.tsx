import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds } from "@/content/sections";

export function Collaborations({ t }: { t: Dictionary }) {
  return (
    <section
      id={sectionIds.collaborations}
      className="section collaborations-section"
      aria-labelledby="collaboration-title"
    >
      <div className="container collaboration-grid">
        <h2 id="collaboration-title">{t.collaborations.title}</h2>
        <div>
          <p>{t.collaborations.description}</p>
          <ul className="collaboration-tags">
            {t.collaborations.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="button button-light" href={sectionHash("contact")}>
            {t.collaborations.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
