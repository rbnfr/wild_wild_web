import { StaticImage as Image } from "@/components/static-image";
import { site, type SocialId } from "@/content/site";
import type { Dictionary } from "@/content/dictionaries";
import { ArrowDownIcon, ArrowUpRightIcon, BookIcon } from "@/components/icon";
import { RichText } from "@/components/rich-text";
import { SocialGlyph, SocialIcons } from "@/components/social-icons";

type ExternalLink = {
  heading: string;
  text: string;
  url: string;
  icon?: SocialId;
};

// Shared list of external links (social profiles and press).
function ExternalLinks({
  links,
  newTab,
}: {
  links: ExternalLink[];
  newTab: string;
}) {
  return links.map((link) => (
    <a
      className={`social-link ${link.icon ? "has-icon" : ""}`}
      href={link.url}
      key={link.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {link.icon && <SocialGlyph id={link.icon} />}
      <strong>{link.heading}</strong>
      <span>
        {link.text}
        <span className="visually-hidden"> {newTab}</span>
      </span>
      <span aria-hidden="true" className="social-arrow">
        <ArrowUpRightIcon />
      </span>
    </a>
  ));
}

export function Hero({ t }: { t: Dictionary }) {
  return (
    <section className="hero-band" aria-labelledby="hero-title">
      <div className="hero container">
        <div className="hero-copy">
          <p className="hero-label">
            <span aria-hidden="true" className="leaf-dot" />
            {t.hero.label}
          </p>
          <h1 id="hero-title">{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <SocialIcons
            label={t.hero.socialsLabel}
            newTab={t.common.newTab}
            className="hero-socials"
          />
          <div className="hero-actions">
            <a className="button button-outline" href="#contacto">
              {t.hero.primary}
            </a>
          </div>
        </div>
        <figure className="hero-figure">
          <div className="hero-image">
            <Image
              src={site.heroImage}
              alt={t.hero.imageAlt}
              fill
              sizes="(max-width: 400px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), 48vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </figure>
        <div className="hero-foot">
          <span>{t.hero.footStart}</span>
          <a href="#sobre-mi" aria-label={t.hero.scrollLabel}>
            <ArrowDownIcon />
          </a>
          <span>{t.hero.footEnd}</span>
        </div>
      </div>
    </section>
  );
}

export function About({ t }: { t: Dictionary }) {
  return (
    <section
      className="section about-section"
      id="sobre-mi"
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <div>
          <h2 id="about-title">{t.about.title}</h2>
        </div>
        <div className="about-copy">
          {t.about.paragraphs.map((text) => (
            <p key={text}>
              <RichText text={text} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services({ t }: { t: Dictionary }) {
  return (
    <section
      className="section services-section"
      id="servicios"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading">
          <h2 id="services-title">{t.services.title}</h2>
        </div>
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
              <a className="service-link" href="#contacto">
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

export function Outreach({ t }: { t: Dictionary }) {
  const { outreach } = t;
  const { books, socials, press } = site;
  return (
    <section
      className="section outreach-section"
      id="divulgacion"
      aria-labelledby="outreach-title"
    >
      <div className="container">
        <h2 id="outreach-title" className="section-heading">
          {outreach.title}
        </h2>
        <div className="outreach-book">
          <h3 className="outreach-subtitle">{outreach.booksTitle}</h3>
          {books.length ? (
            <div
              className={`book-grid ${books.length === 1 ? "single-book" : ""}`}
            >
              {books.map((book) => (
                <article className="book" key={book.id}>
                  <div className="book-cover">
                    <div className="book-cover-inner">
                      <Image
                        src={book.cover}
                        width={book.coverWidth}
                        height={book.coverHeight}
                        sizes="(max-width: 600px) 220px, 240px"
                        alt={outreach.coverAlt(book.title, book.author)}
                      />
                    </div>
                  </div>
                  <div>
                    <h4>{book.title}</h4>
                    <p className="book-subtitle">{book.subtitle}</p>
                    <p className="book-author">{book.author}</p>
                    <p>
                      {book.publisher}, {book.year}
                    </p>
                    <p>{t.books[book.id]}</p>
                    <p>{outreach.printEdition(book.pages)}</p>
                    <p>ISBN: {book.isbn}</p>
                    <a
                      className="text-link"
                      href={book.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {outreach.bookCta}
                      <span className="visually-hidden">
                        {" "}
                        {t.common.newTab}
                      </span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="books-pending">
              <div
                className="cover-placeholder"
                aria-label={outreach.coverPendingLabel}
              >
                <BookIcon />
                <span>{outreach.coverPending}</span>
              </div>
              <div>
                <h4>{outreach.booksPendingTitle}</h4>
                <p>{outreach.booksPending}</p>
                <p className="editorial-note">{outreach.booksPendingNote}</p>
              </div>
            </div>
          )}
        </div>
        <div className="outreach-grid">
          <div>
            <h3 className="outreach-subtitle">{outreach.socialsTitle}</h3>
            {socials.length ? (
              <ExternalLinks
                newTab={t.common.newTab}
                links={socials.map((social) => ({
                  heading: social.name,
                  text: t.socials[social.id],
                  url: social.url,
                  icon: social.id,
                }))}
              />
            ) : (
              <p className="pending-text">{outreach.socialsPending}</p>
            )}
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

export function Collaborations({ t }: { t: Dictionary }) {
  return (
    <section
      id="colaboraciones"
      className="collaborations-section"
      aria-labelledby="collaboration-title"
    >
      <div className="container collaboration-grid">
        <div>
          <h2 id="collaboration-title">{t.collaborations.title}</h2>
        </div>
        <div>
          <p>{t.collaborations.description}</p>
          <ul className="collaboration-tags">
            {t.collaborations.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="button button-light" href="#contacto">
            {t.collaborations.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
