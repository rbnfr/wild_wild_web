import { ArrowUpRightIcon } from "@/components/icon";
import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds } from "@/content/sections";

export function Services({ t }: { t: Dictionary }) {
  return (
    <section
      className="section services-section"
      id={sectionIds.services}
      aria-labelledby="services-title"
    >
      <div className="container">
        <h2 id="services-title" className="section-heading">
          {t.services.title}
        </h2>
        <div className="services-grid">
          {t.services.items.map((item) => (
            <article className="service" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.topics.length > 0 && (
                <ul className="service-topics">
                  {item.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              )}
              <a className="service-link" href={sectionHash("contact")}>
                {item.tag}
                <span aria-hidden="true">
                  <ArrowUpRightIcon />
                </span>
              </a>
            </article>
          ))}
        </div>
        <p className="consultation-details">{t.services.note}</p>
      </div>
    </section>
  );
}
