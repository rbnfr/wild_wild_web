// Language-independent data: names, links, identifiers and book details.
// Every translatable text lives in src/content/dictionaries/<lang>.ts.
// Sources and unresolved details are documented in docs/content-sources.md.

export type SocialId = "instagram" | "tiktok" | "youtube" | "facebook" | "x";
export type ServiceId = "canine" | "feline" | "shelters";

export const site = {
  name: "Mary Granero",
  fullName: "María Dolores Granero Fernández",
  seo: {
    readyToIndex: true,
    // robots.txt policy: search engines and AI answers may use the content,
    // model training may not (https://contentsignals.org/).
    contentSignal: "search=yes, ai-input=yes, ai-train=no",
    trainingCrawlers: [
      "GPTBot",
      "ClaudeBot",
      "Google-Extended",
      "Applebot-Extended",
      "CCBot",
      "meta-externalagent",
    ],
  },
  // Cookieless visit statistics with Umami Cloud (https://umami.is).
  // websiteId is public (it ships in the HTML): copy it from
  // Umami → Settings → Websites. While it is empty no script is loaded.
  // Keep `script` on the host that also receives the data: the export adds
  // that origin to the CSP (script-src and connect-src).
  analytics: {
    websiteId: "",
    script: "https://cloud.umami.is/script.js",
  },
  heroImage: "/images/mary_principal.jpg",
  // Photographs shown as a stack of prints in "Sobre mí". All are square.
  aboutPhotos: [
    { id: "with-dog", src: "/images/sobre_mi_01.jpg" },
    { id: "event-group", src: "/images/sobre_mi_02.jpg" },
    { id: "awards-group", src: "/images/sobre_mi_03.jpg" },
    { id: "book-signature", src: "/images/sobre_mi_04.jpg" },
    { id: "wellbeing-conference", src: "/images/sobre_mi_05.jpg" },
    { id: "shelter-walk", src: "/images/sobre_mi_06.jpg" },
    { id: "with-cat", src: "/images/sobre_mi_07.jpg" },
  ],
  // Milliseconds each photograph stays on top before the next one is shown.
  aboutPhotosInterval: 20_000,
  // Illustrative photograph of each service card (3:2).
  serviceImages: {
    canine: "/images/servicio_canina.jpg",
    feline: "/images/servicio_felina.jpg",
    shelters: "/images/servicio_protectoras.jpg",
  } satisfies Record<ServiceId, string>,
  // Presencial en la Región de Murcia; online y con desplazamiento, toda España.
  areaServed: [
    { type: "AdministrativeArea", name: "Región de Murcia" },
    { type: "Country", name: "España" },
  ],
  books: [
    {
      id: "cat-science",
      title: "Lo que la ciencia sabe de tu gato",
      author: "Mary Granero Fernández",
      subtitle: "Comprende su comportamiento para poder darle lo que necesita",
      // The book is published in Spanish only.
      inLanguage: "es",
      year: 2025,
      datePublished: "2025-06-10",
      pages: 304,
      publisher: "Hestia",
      cover: "/images/portada_libro_01.jpg",
      coverWidth: 297,
      coverHeight: 445,
      isbn: "9788412967166",
      url: "https://link.amazon/B0c9jJuJR",
    },
  ],
  socials: [
    {
      id: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/wildbehav/",
    },
    { id: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@wildbehav" },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://www.youtube.com/channel/UCKotSK8QsfIXb7gikmephFQ",
    },
    {
      id: "facebook",
      name: "Facebook",
      url: "https://www.facebook.com/p/Wild-Behavior-100069192936244/",
    },
    { id: "x", name: "X", url: "https://x.com/wildbehav" },
  ] satisfies { id: SocialId; name: string; url: string }[],
  // Press coverage is in Spanish; each title is translated in the dictionaries.
  press: [
    {
      id: "muy-interesante",
      outlet: "Muy Interesante",
      url: "https://muyinteresante.okdiario.com/curiosidades/lectura-exclusiva-por-que-tenemos-gatos-libro-mary-granero-domesticacion-humana.html",
    },
    {
      id: "20-minutos",
      outlet: "20 minutos",
      url: "https://www.20minutos.es/noticia/5725035/0/mary-granero-publica-que-ciencia-sabe-tu-gato-una-guia-para-entender-nuestros-companeros-felinos/",
    },
    {
      id: "vanguardia-maullan",
      outlet: "La Vanguardia",
      url: "https://www.lavanguardia.com/clic/20261007/11652376/mary-granero-etologa-gatos-nunca-maullan-aprendido-nosotros-piensan-tontos-consiguen-comida-gvm.html",
    },
    {
      id: "national-geographic",
      outlet: "National Geographic",
      url: "https://www.nationalgeographic.com.es/ciencia/meow-1-esta-probando-si-funciona-ozempic-para-gatos-pero-es-esto-bueno_27022",
    },
    {
      id: "vanguardia-reconciliacion",
      outlet: "La Vanguardia",
      url: "https://www.lavanguardia.com/cribeo/fauna/20250819/10985971/mary-granero-experta-comportamiento-animal-gatos-rencor-reconciliacion-presentacion-situaciones-problemas-mmn.html",
    },
    {
      id: "tvnoticias",
      outlet: "Tvnoticias",
      url: "https://www.instagram.com/p/DL17wkog2WN/",
    },
  ],
  contactEmail: "wildbehaviorofficial@gmail.com",
  // Owner data required by the LSSI (art. 10). Fill in before publishing.
  legal: {
    owner: "María Dolores Granero Fernández",
    taxId: "",
    address: "",
    email: "wildbehaviorofficial@gmail.com",
  },
} as const;

export type AboutPhotoId = (typeof site.aboutPhotos)[number]["id"];
export type BookId = (typeof site.books)[number]["id"];
export type PressId = (typeof site.press)[number]["id"];
