import type { Metadata } from "next";
import { site } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { sans } from "./fonts";
import "@/styles/index.css";

// Unknown URLs have no language of their own, so the 404 speaks both.
export const metadata: Metadata = {
  title: `${getDictionary(defaultLocale).notFound.eyebrow} | ${site.name}`,
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={sans.variable}>
      <body>
        <main className="container legal-page not-found">
          {locales.map((lang) => {
            const { notFound, common } = getDictionary(lang);
            const Heading = lang === defaultLocale ? "h1" : "h2";
            return (
              <section key={lang} lang={lang}>
                <p>{notFound.eyebrow}</p>
                <Heading>{notFound.title}</Heading>
                <p>{notFound.text}</p>
                <a className="button" href={href(lang)}>
                  {common.backHome}
                </a>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
