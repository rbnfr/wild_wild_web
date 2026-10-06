import { StaticImage as Image } from "@/components/static-image";
import { site } from "@/content/site";
import { Icon } from "@/components/icon";

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
        <div className="hero-actions">
          <a className="button" href="#contacto">
            {site.hero.primary}
          </a>
          <a className="text-link" href="#sobre-mary">
            {site.hero.secondary} <span aria-hidden="true">↗</span>
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
        <figcaption>{site.hero.caption}</figcaption>
      </figure>
      <div className="hero-foot">
        <span>Un espacio para entendernos mejor</span>
        <a href="#sobre-mary" aria-label="Descubrir sobre Mary">
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
      id="sobre-mary"
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <div className="about-copy">
          <p className="section-label">Sobre Mary</p>
          <h2 id="about-title">{site.about.title}</h2>
          <p className="lead">{site.about.intro}</p>
          {site.about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <a className="text-link" href="#trayectoria">
            Explorar su trayectoria <span aria-hidden="true">↗</span>
          </a>
        </div>
        <aside className="training" aria-labelledby="training-title">
          <h3 id="training-title">{site.about.trainingTitle}</h3>
          <ul className="training-list">
            {site.about.training.map((item) => (
              <li key={item.title}>
                <span className="training-year">{item.year}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.institution}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export function Areas() {
  return (
    <section
      className="section areas-section"
      id="areas"
      aria-labelledby="areas-title"
    >
      <div className="container">
        <div className="section-heading">
          <p className="section-label">Áreas de trabajo</p>
          <h2 id="areas-title">{site.areas.title}</h2>
        </div>
        <div className="areas-grid">
          {site.areas.items.map((item) => (
            <article className="area" key={item.title}>
              <Icon kind={item.symbol} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a className="area-link" href="#contacto">
                {item.tag}
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        {site.areas.note && (
          <p className="consultation-details">{site.areas.note}</p>
        )}
      </div>
    </section>
  );
}

export function Trajectory() {
  return (
    <section
      className="section"
      id="trayectoria"
      aria-labelledby="trajectory-title"
    >
      <div className="container trajectory-grid">
        <div>
          <p className="section-label">Trayectoria</p>
          <h2 id="trajectory-title">El camino hasta aquí.</h2>
          <p className="section-intro">
            Formación, proyectos y momentos que dan forma a una mirada
            profesional.
          </p>
        </div>
        <ol className="timeline">
          {site.timeline.map((item) => (
            <li key={item.title}>
              <span className="timeline-date">{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
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
                <Image
                  src={book.cover}
                  width={book.coverWidth}
                  height={book.coverHeight}
                  sizes="(max-width: 600px) 220px, 240px"
                  alt={`Portada de ${book.title}, de ${book.author}`}
                />
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
              <Icon kind="book" />
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
        {site.publications.length > 0 && (
          <div className="research-publications">
            <h3>{site.booksSection.researchTitle}</h3>
            <ul>
              {site.publications.map((publication) => (
                <li key={publication.url}>
                  <p>
                    {publication.journal} · {publication.year} · Coautoría
                  </p>
                  <a
                    className="text-link"
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {publication.title} (nueva pestaña)
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function SocialContent() {
  return (
    <section
      className="section social-section"
      id="contenido"
      aria-labelledby="social-title"
    >
      <div className="container social-grid">
        <div>
          <p className="section-label">Redes y contenido</p>
          <h2 id="social-title">{site.socialSection.title}</h2>
        </div>
        <div>
          <p className="lead">{site.socialSection.description}</p>
          {site.socials.length ? (
            site.socials.map((social) => (
              <a
                className="social-link"
                href={social.url}
                key={social.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <strong>{social.name}</strong>
                <span>{social.description} (nueva pestaña)</span>
              </a>
            ))
          ) : (
            <p className="pending-text">{site.socialSection.pending}</p>
          )}
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
          <p className="section-label">Prensa y colaboraciones</p>
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
