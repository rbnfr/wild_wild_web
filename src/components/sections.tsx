import { StaticImage as Image } from "@/components/static-image";
import { site, type SocialId } from "@/content/site";
import { BookIcon } from "@/components/icon";
import { RichText } from "@/components/rich-text";
import { SocialGlyph, SocialIcons } from "@/components/social-icons";

type ExternalLink = {
  heading: string;
  text: string;
  url: string;
  icon?: SocialId;
};

// Shared list of external links (social profiles and press).
function ExternalLinks({ links }: { links: ExternalLink[] }) {
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
        {link.icon ? (
          <span className="visually-hidden"> (nueva pestaña)</span>
        ) : (
          " (nueva pestaña)"
        )}
      </span>
      <span aria-hidden="true" className="social-arrow">
        ↗
      </span>
    </a>
  ));
}

export function Hero() {
  return (
    <section className="hero-band" aria-labelledby="hero-title">
      <div className="hero container">
        <div className="hero-copy">
          <p className="hero-label">
            <span aria-hidden="true" className="leaf-dot" />
            {site.hero.label}
          </p>
          <h1 id="hero-title">{site.hero.title}</h1>
          <p className="hero-description">{site.hero.description}</p>
          <SocialIcons label="Mis redes sociales" className="hero-socials" />
          <div className="hero-actions">
            <a className="button button-outline" href="#contacto">
              {site.hero.primary}
            </a>
          </div>
        </div>
        <figure className="hero-figure">
          <div className="hero-image">
            <Image
              src={site.hero.image}
              alt={site.hero.imageAlt}
              fill
              sizes="(max-width: 400px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), 48vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </figure>
        <div className="hero-foot">
          <span>Un espacio para entendernos mejor</span>
          <a href="#sobre-mi" aria-label="Descubrir sobre mí">
            ↓
          </a>
          <span>Personas, perros y gatos</span>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section
      className="section about-section"
      id="sobre-mi"
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <div>
          <p className="section-label">Sobre mí</p>
          <h2 id="about-title">{site.about.title}</h2>
        </div>
        <div className="about-copy">
          {site.about.paragraphs.map((text) => (
            <p key={text}>
              <RichText text={text} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section
      className="section services-section"
      id="servicios"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading">
          <p className="section-label">Servicios</p>
          <h2 id="services-title">{site.services.title}</h2>
        </div>
        <div className="services-grid">
          {site.services.items.map((item) => (
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
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        <p className="consultation-details">{site.services.note}</p>
      </div>
    </section>
  );
}

export function Outreach() {
  const { outreach, socials, press } = site;
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
          {site.books.length ? (
            <div
              className={`book-grid ${site.books.length === 1 ? "single-book" : ""}`}
            >
              {site.books.map((book) => (
                <article className="book" key={book.title}>
                  <div className="book-cover">
                    <div className="book-cover-inner">
                      <Image
                        src={book.cover}
                        width={book.coverWidth}
                        height={book.coverHeight}
                        sizes="(max-width: 600px) 220px, 240px"
                        alt={`Portada de ${book.title}, de ${book.author}`}
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
                    <p>{book.description}</p>
                    {book.pages && (
                      <p>{book.pages} páginas · Edición impresa</p>
                    )}
                    {book.isbn && <p>ISBN: {book.isbn}</p>}
                    {book.links.map((link) => (
                      <a
                        className="text-link"
                        href={link.url}
                        key={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {link.label} (nueva pestaña)
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="books-pending">
              <div
                className="cover-placeholder"
                aria-label="Espacio reservado para una portada real"
              >
                <BookIcon />
                <span>
                  Portada
                  <br />
                  pendiente
                </span>
              </div>
              <div>
                <h4>Un espacio para sus publicaciones</h4>
                <p>{site.outreach.booksPending}</p>
                <p className="editorial-note">
                  Los libros se mostrarán aquí cuando se incorporen sus datos
                  reales.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="outreach-grid">
          <div>
            <h3 className="outreach-subtitle">{outreach.socialsTitle}</h3>
            {socials.length ? (
              <ExternalLinks
                links={socials.map((social) => ({
                  heading: social.name,
                  text: social.description,
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
              links={press.map((item) => ({
                heading: item.outlet,
                text: item.title,
                url: item.url,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Collaborations() {
  return (
    <section
      className="collaborations-section"
      aria-labelledby="collaboration-title"
    >
      <div className="container collaboration-grid">
        <div>
          <p className="section-label">Colaboraciones</p>
          <h2 id="collaboration-title">{site.collaborations.title}</h2>
        </div>
        <div>
          <p>{site.collaborations.description}</p>
          <ul className="collaboration-tags">
            {site.collaborations.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="button button-light" href="#contacto">
            {site.collaborations.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
