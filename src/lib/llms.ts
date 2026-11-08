import { site } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, localeDetails, locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { sitePages } from "@/lib/seo";

type Entry = { label: string; url: string; note?: string };

const list = (entries: Entry[]) =>
  entries
    .map(
      ({ label, url, note }) =>
        `- [${label}](${url})${note ? `: ${note}` : ""}`,
    )
    .join("\n");

// Plain Markdown summary of the site for language models (https://llmstxt.org/),
// written in the default language and pointing at every translation.
export function llmsTxt(url: URL, lang = defaultLocale): string {
  const t = getDictionary(lang);
  const at = (hash = "") => new URL(href(lang, "home", hash), url).href;
  const { about, services, outreach, collaborations, contact } = t;
  return `${[
    `# ${site.name}`,
    `> ${t.seo.description}`,
    t.hero.description,
    `## ${t.header.nav.about}`,
    ...about.paragraphs,
    `## ${t.header.nav.services}`,
    services.note,
    list(
      services.items.map((service) => ({
        label: service.title,
        url: at("#servicios"),
        note: service.topics.length
          ? `${service.description} ${t.llms.topics}: ${service.topics.join(", ")}.`
          : service.description,
      })),
    ),
    `## ${t.header.nav.outreach}`,
    `### ${outreach.socialsTitle}`,
    list(
      site.socials.map((social) => ({
        label: social.name,
        url: social.url,
        note: t.socials[social.id],
      })),
    ),
    `### ${outreach.booksTitle}`,
    list(
      site.books.map((book) => ({
        label: `${book.title} (${book.publisher}, ${book.year})`,
        url: book.url,
        note: t.books[book.id],
      })),
    ),
    `### ${outreach.pressTitle}`,
    list(
      site.press.map((item) => ({
        label: `${item.outlet}: ${t.press[item.id]}`,
        url: item.url,
      })),
    ),
    `## ${t.header.nav.collaborations}`,
    `${collaborations.description} ${collaborations.tags.join(", ")}.`,
    list([{ label: collaborations.cta, url: at("#colaboraciones") }]),
    `## ${t.llms.contact}`,
    contact.description,
    list([
      { label: t.llms.contactForm, url: at("#contacto") },
      { label: t.llms.email, url: `mailto:${site.contactEmail}` },
    ]),
    "## Optional",
    list([
      ...locales
        .filter((code) => code !== lang)
        .map((code) => ({
          label: `${site.name} (${localeDetails[code].name})`,
          url: new URL(href(code), url).href,
        })),
      ...sitePages
        .filter((page) => page.lang === lang && page.page !== "home")
        .map((page) => ({
          label: page.title,
          url: new URL(page.path, url).href,
        })),
    ]),
  ].join("\n\n")}\n`;
}
