import { Book } from "@/components/sections/book";
import { ExternalLinks } from "@/components/sections/external-links";
import type { Dictionary } from "@/content/dictionaries";
import { sectionIds } from "@/content/sections";
import { site } from "@/content/site";

export function Outreach({ t }: { t: Dictionary }) {
  const { outreach } = t;
  const { books, socials, press } = site;
  return (
    <section
      className="section outreach-section"
      id={sectionIds.outreach}
      aria-labelledby="outreach-title"
    >
      <div className="container">
        <h2 id="outreach-title" className="section-heading">
          {outreach.title}
        </h2>
        <div className="outreach-book">
          <h3 className="outreach-subtitle">{outreach.booksTitle}</h3>
          {books.map((book) => (
            <Book key={book.id} book={book} t={t} />
          ))}
        </div>
        <div className="outreach-grid">
          <div>
            <h3 className="outreach-subtitle">{outreach.socialsTitle}</h3>
            <ExternalLinks
              newTab={t.common.newTab}
              links={socials.map((social) => ({
                heading: social.name,
                text: t.socials[social.id],
                url: social.url,
                icon: social.id,
              }))}
            />
          </div>
          <div>
            <h3 className="outreach-subtitle">{outreach.pressTitle}</h3>
            <ExternalLinks
              newTab={t.common.newTab}
              links={press.map((item) => ({
                heading: item.outlet,
                text: t.press[item.id],
                url: item.url,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
