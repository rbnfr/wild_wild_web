import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/i18n/config";
import { alternates, href } from "@/i18n/routes";
import { safeJsonLd, structuredData } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return { alternates: alternates("home", lang) };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const email = site.contactEmail;
  return (
    <>
      <div id="inicio" />
      <Hero t={t} />
      <About t={t} />
      <Services t={t} />
      <Outreach t={t} />
      <Collaborations t={t} />
      <section
        className="section contact-section"
        id="contacto"
        aria-labelledby="contact-title"
      >
        <div className="container contact-grid">
          <div className="contact-copy">
            <h2 id="contact-title">{t.contact.title}</h2>
            <p className="lead">{t.contact.description}</p>
            <p className="contact-privacy">
              {t.contact.privacyNote}{" "}
              <a href={href(lang, "privacy")}>{t.contact.privacyLink}</a>.
            </p>
            <a className="text-link contact-email" href={`mailto:${email}`}>
              <MailIcon />
              {email}
            </a>
          </div>
          <ContactForm
            t={t.contact.form}
            email={email}
            privacyHref={href(lang, "privacy")}
          />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData(lang)) }}
      />
    </>
  );
}
