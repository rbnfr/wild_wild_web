import Image from "next/image";
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
        <p className="editorial-note">
          Propuesta de texto pendiente de aprobación por Mary.
        </p>
      </div>
      <figure className="hero-figure">
        <div className="hero-image">
          <Image
            src={site.hero.image}
            alt={site.hero.imageAlt}
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
            preload
          />
          <div className="image-signature" aria-hidden="true">
            Una mirada
            <br />
            más cercana.
          </div>
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
        <figure className="about-figure">
          <div className="about-image">
            <Image
              src={site.about.image}
              alt="Espacio reservado para una fotografía real de convivencia con un animal"
              fill
              sizes="(max-width: 760px) 100vw, 36vw"
            />
          </div>
          <figcaption>{site.about.caption}</figcaption>
        </figure>
        <div className="about-copy">
          <p className="section-label">Sobre Mary</p>
          <h2 id="about-title">{site.about.title}</h2>
          <p className="lead">{site.about.intro}</p>
          {site.about.paragraphs.map((text) => (
            <p className="pending-text" key={text}>
              {text}
            </p>
          ))}
          <a className="text-link" href="#trayectoria">
            Explorar su trayectoria <span aria-hidden="true">↗</span>
          </a>
        </div>
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
        <p className="editorial-note">{site.areas.note}</p>
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
          <p className="editorial-note">
            TODO: completar únicamente con información contrastada.
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
          <div className="book-grid">
            {site.books.map((book) => (
              <article className="book" key={book.title}>
                <Image
                  src={book.cover}
                  width={360}
                  height={480}
                  alt={`Portada de ${book.title}`}
                />
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.subtitle}</p>
                  <p>
                    {book.publisher}, {book.year}
                  </p>
                  <p>{book.description}</p>
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
