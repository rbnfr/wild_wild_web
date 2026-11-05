import { StaticImage as Image } from "@/components/static-image";
import { site } from "@/content/site";
import { BookIcon } from "@/components/icon";
import { RichText } from "@/components/rich-text";
import { SocialIcons } from "@/components/social-icons";

type ExternalLink = { heading: string; text: string; url: string };

// Shared list of external links (social profiles, press, book coverage).
function ExternalLinks({ links }: { links: ExternalLink[] }) {
  return links.map((link) => (
    <a
      className="social-link"
      href={link.url}
      key={link.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <strong>{link.heading}</strong>
      <span>{link.text} (nueva pestaña)</span>
      <span aria-hidden="true" className="social-arrow">
        ↗
      </span>
    </a>
  ));
}

export function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-label">
          <span aria-hidden="true" className="leaf-dot" />
          {site.hero.label}
        </p>
        <h1 id="hero-title">{site.hero.title}</h1>
        <p className="hero-description">{site.hero.description}</p>
        <SocialIcons label="Mis redes sociales" className="hero-socials" />
        <div className="hero-actions">
          <a className="button" href="#contacto">
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
          {site.about.paragraphs.map((text, index) => (
            <p className={index === 0 ? "lead" : undefined} key={text}>
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
  const { socialSection, socials } = site;
  return (
    <section
      className="section social-section"
      id="divulgacion"
      aria-labelledby="social-title"
    >
      <div className="container social-grid">
        <div>
          <p className="section-label">Divulgación</p>
          <h2 id="social-title">{socialSection.title}</h2>
          <p className="section-intro">{socialSection.scenio}</p>
        </div>
        <div>
          <p className="lead">{socialSection.description}</p>
          {socials.length ? (
            <ExternalLinks
              links={socials.map((social) => ({
                heading: social.name,
                text: social.description,
                url: social.url,
              }))}
            />
          ) : (
            <p className="pending-text">{socialSection.pending}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function Books() {
  return (
    <section
      className="section books-section"
      id="libros"
      aria-labelledby="books-title"
    >
      <div className="container">
        <div className="section-heading">
          <p className="section-label">Libros y publicaciones</p>
          <h2 id="books-title">{site.booksSection.title}</h2>
          <p>{site.booksSection.description}</p>
        </div>
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
                  <h3>{book.title}</h3>
                  <p className="book-subtitle">{book.subtitle}</p>
                  <p className="book-author">{book.author}</p>
                  <p>
                    {book.publisher}, {book.year}
                  </p>
                  <p>{book.description}</p>
                  {book.pages && <p>{book.pages} páginas · Edición impresa</p>}
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
                  {book.coverage.length > 0 && (
                    <div className="book-coverage">
                      <h4>El libro en los medios</h4>
                      <ExternalLinks
                        links={book.coverage.map((item) => ({
                          heading: item.outlet,
                          text: item.title,
                          url: item.url,
                        }))}
                      />
                    </div>
                  )}
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
              <h3>Un espacio para sus publicaciones</h3>
              <p>{site.booksSection.pending}</p>
              <p className="editorial-note">
                Los libros se mostrarán aquí cuando se incorporen sus datos
                reales.
              </p>
            </div>
          </div>
        )}
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

export function Press() {
  return (
    <section
      className="section press-section"
      id="prensa"
      aria-labelledby="press-title"
    >
      <div className="container social-grid">
        <div>
          <p className="section-label">Prensa</p>
          <h2 id="press-title">{site.press.title}</h2>
        </div>
        <div>
          <ExternalLinks
            links={site.press.items.map((item) => ({
              heading: item.outlet,
              text: item.title,
              url: item.url,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
