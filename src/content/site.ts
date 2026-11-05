export type Book = {
  title: string;
  author: string;
  subtitle: string;
  year: number;
  datePublished?: string;
  pages?: number;
  publisher: string;
  description: string;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  isbn?: string;
  links: { label: string; url: string }[];
};
export type SocialId = "instagram" | "tiktok" | "youtube" | "x";
export type Social = {
  id: SocialId;
  name: string;
  description: string;
  url: string;
};
export type MediaLink = { outlet: string; title: string; url: string };
export type Service = {
  title: string;
  description: string;
  topics: string[];
  tag: string;
};

// Sources and unresolved details are documented in docs/content-sources.md.
export const site = {
  name: "Mary Granero",
  fullName: "María Dolores Granero Fernández",
  profession: "Bióloga y etóloga canina y felina",
  contentStatus:
    "Perfil actualizado con los CV y la ficha editorial. Contacto, modalidades y colaboraciones confirmados por el usuario. Versión estática con borrador de correo. Pendientes: datos jurídicos.",
  seo: {
    title: "Mary Granero | Bióloga y etóloga canina y felina",
    description:
      "Mary Granero, bióloga, etóloga canina y felina y divulgadora de Wild Behavior. Autora de Lo que la ciencia sabe de tu gato.",
    readyToIndex: false,
  },
  nav: [
    { label: "Sobre mí", href: "/#sobre-mi" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Divulgación", href: "/#divulgacion" },
  ],
  hero: {
    label: "Etología · Divulgación · Mascotas",
    title: "Comprenderles cambia la forma de convivir.",
    description:
      "Ayudo a familias multiespecie a convivir en armonía. Conocer a nuestros peludos con evidencia científica nos ayuda a ofrecerles lo que necesitan para mejorar su bienestar y nuestra convivencia.",
    primary: "¿Hablamos?",
    image: "/images/portrait_01.jpg",
    imageAlt: "Retrato de Mary Granero, bióloga y etóloga canina y felina",
  },
  about: {
    title: "Detrás de cada comportamiento, hay algo que comprender.",
    paragraphs: [
      "Mi pasión por la ciencia me llevó a graduarme en biología en la Universidad de Murcia. Allí descubrí mi verdadera vocación: el **comportamiento animal**, lo que me llevó a cursar un Máster en Etología Aplicada e Intervención Asistida con Animales.",
      "Fue durante el máster cuando me di cuenta de que yo no quería trabajar con animales, sino para ellos. Por eso me especialicé en bienestar animal y durante las prácticas del máster ayudé a implementar planes de enriquecimiento ambiental en un centro de recuperación de especies para mejorar su calidad de vida.",
      "Mi primera oportunidad laboral fue en una residencia canina mejorando el bienestar de los perros del centro y tratando problemas de conducta a domicilio. A raíz de esta experiencia entré en contacto con el mundo de las mascotas y me formé como Auxiliar Técnico Veterinario y empecé a colaborar con una protectora tratando problemas de conducta de perros y gatos para conseguir facilitar sus adopciones y mejorar su calidad de vida.",
      "En paralelo comencé a divulgar sobre comportamiento animal en general y más tarde sobre perros y gatos como respuesta a la falta de información basada en evidencia que encontramos por redes. Esto me dio la oportunidad de publicar un libro sobre etología felina titulado «Lo que la ciencia sabe de tu gato».",
      "Actualmente sigo ayudando a familias multiespecie a mejorar su convivencia y trato de realizar una divulgación rigurosa en redes para competir con la desinformación.",
    ],
  },
  services: {
    title: "Servicios de etología.",
    note: "Consultas online y presenciales en la Región de Murcia. Para casos especiales, puedo desplazarme a la Comunidad Valenciana y Andalucía; también al resto de España, con un coste de desplazamiento mayor. Consulta disponibilidad y presupuesto según el destino.",
    items: [
      {
        title: "Etología canina",
        description:
          "Asesoramiento sobre problemas de comportamiento, bienestar y convivencia.",
        topics: [
          "Miedos e inseguridad",
          "Problemas de convivencia",
          "Conductas relacionadas con la separación",
          "Reactividad",
          "Enriquecimiento ambiental",
          "Adaptación y cambios en el entorno",
        ],
        tag: "Consultar por mi perro",
      },
      {
        title: "Etología felina",
        description:
          "Asesoramiento sobre problemas de comportamiento, bienestar y convivencia.",
        topics: [
          "Eliminación inadecuada",
          "Conflictos entre gatos",
          "Estrés y cambios ambientales",
          "Enriquecimiento ambiental",
          "Adaptación al hogar",
          "Problemas relacionados con el bienestar y la convivencia",
        ],
        tag: "Consultar por mi gato",
      },
      {
        title: "Asesoramiento a protectoras",
        description:
          "Experiencia en enriquecimiento ambiental, protocolos de manejo y asesoramiento para protectoras y residencias caninas.",
        topics: [],
        tag: "Para protectoras",
      },
    ] satisfies Service[],
  },
  books: [
    {
      title: "Lo que la ciencia sabe de tu gato",
      author: "Mary Granero Fernández",
      subtitle: "Comprende su comportamiento para poder darle lo que necesita",
      year: 2025,
      datePublished: "2025-06-10",
      pages: 304,
      publisher: "Hestia",
      description:
        "Una guía para entender a los gatos desde la evidencia científica. Mary reúne conocimientos sobre comunicación, comportamiento y necesidades felinas para revisar mitos habituales y ayudar a mejorar su bienestar y la convivencia en casa.",
      cover: "/images/portada_libro_01.jpg",
      coverWidth: 297,
      coverHeight: 445,
      isbn: "9788412967166",
      links: [
        {
          label: "Consigue tu ejemplar",
          url: "https://link.amazon/B0c9jJuJR",
        },
      ],
    },
  ] satisfies Book[],
  socials: [
    {
      id: "instagram",
      name: "Instagram",
      description: "Comportamiento y bienestar animal con Wild Behavior",
      url: "https://www.instagram.com/wildbehav/",
    },
    {
      id: "tiktok",
      name: "TikTok",
      description: "Divulgación sobre perros, gatos y otros animales",
      url: "https://www.tiktok.com/@wildbehav",
    },
    {
      id: "youtube",
      name: "YouTube",
      description: "Vídeos para explorar la etología",
      url: "https://www.youtube.com/channel/UCKotSK8QsfIXb7gikmephFQ",
    },
    {
      id: "x",
      name: "X",
      description: "Etología y conversación sobre comportamiento animal",
      url: "https://x.com/wildbehav",
    },
  ] satisfies Social[],
  outreach: {
    title: "Divulgación.",
    socialsTitle: "Redes",
    socialsPending:
      "Los nuevos perfiles se incorporarán cuando estén confirmados.",
    booksTitle: "Libro",
    booksPending:
      "Las nuevas publicaciones se incorporarán aquí cuando estén disponibles.",
    pressTitle: "Prensa",
  },
  press: [
    {
      outlet: "Muy Interesante",
      title: "Lectura exclusiva de un capítulo del libro",
      url: "https://muyinteresante.okdiario.com/curiosidades/lectura-exclusiva-por-que-tenemos-gatos-libro-mary-granero-domesticacion-humana.html",
    },
    {
      outlet: "20 minutos",
      title: "Noticia sobre la publicación del libro",
      url: "https://www.20minutos.es/noticia/5725035/0/mary-granero-publica-que-ciencia-sabe-tu-gato-una-guia-para-entender-nuestros-companeros-felinos/",
    },
    {
      outlet: "La Vanguardia",
      title: "«Los gatos casi nunca maúllan entre ellos»",
      url: "https://www.lavanguardia.com/clic/20261007/11652376/mary-granero-etologa-gatos-nunca-maullan-aprendido-nosotros-piensan-tontos-consiguen-comida-gvm.html",
    },
    {
      outlet: "National Geographic",
      title: "«Ozempic para gatos»",
      url: "https://www.nationalgeographic.com.es/ciencia/meow-1-esta-probando-si-funciona-ozempic-para-gatos-pero-es-esto-bueno_27022",
    },
    {
      outlet: "La Vanguardia",
      title: "«Los gatos no tienen herramientas de reconciliación»",
      url: "https://www.lavanguardia.com/cribeo/fauna/20250819/10985971/mary-granero-experta-comportamiento-animal-gatos-rencor-reconciliacion-presentacion-situaciones-problemas-mmn.html",
    },
    {
      outlet: "Tvnoticias",
      title:
        "«La relación entre humanos y gatos no comenzó con adiestramiento ni cría selectiva»",
      url: "https://www.instagram.com/p/DL17wkog2WN/",
    },
  ] satisfies MediaLink[],
  collaborations: {
    title: "Las buenas ideas empiezan con una conversación.",
    description:
      "Si representas a un medio, una editorial, una marca o una entidad y tienes una propuesta, este es tu punto de encuentro.",
    tags: [
      "Prensa y podcasts",
      "Charlas y eventos",
      "Proyectos editoriales",
      "Colaboraciones",
    ],
    cta: "Presentar una propuesta",
  },
  contact: {
    title: "Cuéntame qué tienes en mente.",
    description:
      "Para una consulta online o presencial (en la Región de Murcia), un proyecto, una charla o cualquier idea que se te ocurra, contacta conmigo y hablamos.",
    email: "wildbehaviorofficial@gmail.com",
    reasons: [
      { value: "consulta", label: "Consulta" },
      { value: "contratacion", label: "Contratación" },
      { value: "evento", label: "Charla o evento" },
      { value: "prensa", label: "Prensa o medios" },
      { value: "editorial", label: "Proyecto editorial" },
      { value: "colaboracion", label: "Colaboración comercial" },
      { value: "otro", label: "Otro" },
    ],
  },
  // Owner data required by the LSSI (art. 10). Fill in before publishing.
  legal: {
    owner: "María Dolores Granero Fernández",
    taxId: "",
    address: "",
    email: "wildbehaviorofficial@gmail.com",
  },
} as const;
