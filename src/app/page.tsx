import {
  Hero,
  About,
  Services,
  Outreach,
  Collaborations,
} from "@/components/sections";
import { ContactForm } from "@/components/contact-form";
import { MailIcon } from "@/components/icon";
import { site } from "@/content/site";
import { safeJsonLd, structuredData } from "@/lib/seo";
export default function Home() {
  return (
    <>
      <div id="inicio" />
      <Hero />
      <About />
      <Services />
      <Outreach />
      <Collaborations />
      <section
        className="section contact-section"
        id="contacto"
        aria-labelledby="contact-title"
      >
        <div className="container contact-grid">
          <div className="contact-copy">
            <h2 id="contact-title">{site.contact.title}</h2>
            <p className="lead">{site.contact.description}</p>
            <p className="contact-privacy">
              El borrador se prepara en tu dispositivo. Cuando envíes el correo,
              los datos se usarán para gestionar tu solicitud. Consulta los
              detalles en la <a href="/privacidad/">política de privacidad</a>.
            </p>
            {site.contact.email && (
              <a
                className="text-link contact-email"
                href={`mailto:${site.contact.email}`}
              >
                <MailIcon />
                {site.contact.email}
              </a>
            )}
          </div>
          <ContactForm />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData()) }}
      />
    </>
  );
}
