import { ContactForm } from "@/components/contact-form";
import { MailIcon } from "@/components/icon";
import type { Dictionary } from "@/content/dictionaries";
import { sectionIds } from "@/content/sections";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

export function Contact({ lang, t }: { lang: Locale; t: Dictionary }) {
  const email = site.contactEmail;
  const privacyHref = href(lang, "privacy");
  return (
    <section
      className="section contact-section"
      id={sectionIds.contact}
      aria-labelledby="contact-title"
    >
      <div className="container contact-grid">
        <div className="contact-copy">
          <h2 id="contact-title">{t.contact.title}</h2>
          <p className="lead">{t.contact.description}</p>
          <a className="text-link contact-email" href={`mailto:${email}`}>
            <MailIcon />
            {email}
          </a>
          <p className="contact-privacy">
            {t.contact.privacyNote}{" "}
            <a href={privacyHref}>{t.contact.privacyLink}</a>.
          </p>
        </div>
        <ContactForm
          t={t.contact.form}
          email={email}
          privacyHref={privacyHref}
        />
      </div>
    </section>
  );
}
