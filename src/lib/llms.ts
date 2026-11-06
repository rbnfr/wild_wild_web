import { site } from "@/content/site";
import { sitePages } from "@/lib/seo";

type Entry = { label: string; url: string; note?: string };

const list = (entries: Entry[]) =>
  entries
    .map(
      ({ label, url, note }) =>
        `- [${label}](${url})${note ? `: ${note}` : ""}`,
    )
    .join("\n");

// Plain Markdown summary of the site for language models (https://llmstxt.org/).
export function llmsTxt(url: URL): string {
  const at = (path: string) => new URL(path, url).href;
  const { about, services, outreach, socials, books, press } = site;
  const { collaborations, contact } = site;
  return `${[
    `# ${site.name}`,
    `> ${site.seo.description}`,
    site.hero.description,
    "## Sobre mí",
    ...about.paragraphs,
    "## Servicios",
    services.note,
    list(
      services.items.map((service) => ({
        label: service.title,
        url: at("/#servicios"),
        note: service.topics.length
          ? `${service.description} Temas: ${service.topics.join(", ")}.`
          : service.description,
      })),
    ),
    "## Divulgación",
    `### ${outreach.socialsTitle}`,
    list(
      socials.map((social) => ({
        label: social.name,
        url: social.url,
        note: social.description,
      })),
    ),
    `### ${outreach.booksTitle}`,
    list(
      books.flatMap((book) =>
        book.links.map((link) => ({
          label: `${book.title} (${book.publisher}, ${book.year})`,
          url: link.url,
          note: book.description,
        })),
      ),
    ),
    `### ${outreach.pressTitle}`,
    list(
      press.map((item) => ({
        label: `${item.outlet}: ${item.title}`,
        url: item.url,
      })),
    ),
    "## Colaboraciones",
    `${collaborations.description} ${collaborations.tags.join(", ")}.`,
    list([{ label: "Presentar una propuesta", url: at("/#colaboraciones") }]),
    "## Contacto",
    contact.description,
    list([
      { label: "Formulario de contacto", url: at("/#contacto") },
      { label: "Correo electrónico", url: `mailto:${contact.email}` },
    ]),
    "## Optional",
    list(
      sitePages
        .slice(1)
        .map((page) => ({ label: page.title, url: at(page.path) })),
    ),
  ].join("\n\n")}\n`;
}
