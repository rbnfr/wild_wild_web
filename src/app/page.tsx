import { headers } from "next/headers";
import {
  Hero,
  About,
  Areas,
  Trajectory,
  Books,
  SocialContent,
  Collaborations,
} from "@/components/sections";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";
import { safeJsonLd, structuredData } from "@/lib/seo";
export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <>
      <div id="inicio" />
      <Hero />
      <About />
      <Areas />
      <Trajectory />
      <Books />
      <SocialContent />
      <Collaborations />
      <section
        className="section contact-section"
        id="contacto"
        aria-labelledby="contact-title"
      >
        <div className="container contact-grid">
          <div className="contact-copy">
            <p className="section-label">Contacto</p>
            <h2 id="contact-title">{site.contact.title}</h2>
            <p className="lead">{site.contact.description}</p>
            <p className="contact-privacy">
              Los datos se utilizarán para gestionar tu solicitud. Consulta los
              detalles en la <a href="/privacidad">política de privacidad</a>.
            </p>
            {site.contact.email && (
              <a className="text-link" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            )}
          </div>
          <ContactForm nonce={nonce} />
        </div>
      </section>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData()) }}
      />
    </>
  );
}
