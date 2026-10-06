export type TimelineEntry = {
  date: string;
  title: string;
  description: string;
};
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
export type Social = { name: string; description: string; url: string };
export type Publication = {
  title: string;
  year: number;
  journal: string;
  url: string;
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
    { label: "Sobre Mary", href: "/#sobre-mary" },
    { label: "Trayectoria", href: "/#trayectoria" },
    { label: "Libros", href: "/#libros" },
    { label: "Contenido", href: "/#contenido" },
  ],
  hero: {
    label: "Biología y etología · Perros y gatos",
    title: "Comprenderles cambia la forma de convivir.",
    description:
      "Soy Mary Granero, bióloga y etóloga canina y felina. Combino la educación y el bienestar animal con la divulgación científica para acercarnos a los animales con los que compartimos la vida.",
    primary: "Hablemos",
    secondary: "Conoce a Mary",
    image: "/images/portrait_01.jpg",
    imageAlt: "Retrato de Mary Granero, bióloga y etóloga canina y felina",
    caption: "Mary Granero · Bióloga y etóloga",
  },
  about: {
    title: "Detrás de cada comportamiento, hay algo que comprender.",
    intro:
      "Soy María Dolores Granero Fernández, aunque en divulgación me encontrarás como Mary Granero. Mi especialidad es el comportamiento de perros y gatos.",
    paragraphs: [
      "Me gradué en Biología en la Universidad de Murcia y cursé el Máster en Intervención Asistida con Animales y Etología Aplicada en la Universidad Autónoma de Madrid. Mi recorrido incluye investigación en acuicultura y proyectos de enriquecimiento ambiental con fauna silvestre.",
      "He trabajado en educación canina y felina con particulares, protectoras y una residencia canina, abordando problemas de conducta y asesorando sobre manejo, cuidado y bienestar. Con Wild Behavior acerco la etología y la evidencia científica a las redes sociales; también soy autora de Lo que la ciencia sabe de tu gato.",
    ],
    trainingTitle: "Formación para comprender su mundo",
    training: [
      {
        year: "2018",
        title: "Grado en Biología",
        institution: "Universidad de Murcia",
      },
      {
        year: "2019",
        title:
          "Máster en Intervención Asistida con Animales y Etología Aplicada",
        institution: "Universidad Autónoma de Madrid",
      },
      {
        year: "2023",
        title: "Curso de Asistente y Auxiliar Técnico Veterinario",
        institution: "Centro de Formación Veterinaria Nubika",
      },
    ],
  },
  areas: {
    title: "Distintas formas de acercarnos a su mundo.",
    note: "Consultas online y presenciales en la Región de Murcia. Para casos especiales, puedo desplazarme a la Comunidad Valenciana y Andalucía; también al resto de España, con un coste de desplazamiento mayor. Consulta disponibilidad y presupuesto según el destino.",
    items: [
      {
        title: "Comportamiento y convivencia",
        description:
          "Educación canina y felina, problemas de conducta y asesoramiento sobre cuidado y bienestar para familias y adoptantes.",
        tag: "Para familias",
        symbol: "bond",
      },
      {
        title: "Divulgación científica",
        description:
          "Contenidos sobre etología basados en evidencia científica y experiencia en la coordinación de eventos de divulgación.",
        tag: "Para medios y entidades",
        symbol: "talk",
      },
      {
        title: "Bienestar y entornos",
        description:
          "Experiencia en enriquecimiento ambiental, protocolos de manejo y asesoramiento para protectoras y residencias caninas.",
        tag: "Para profesionales",
        symbol: "book",
      },
    ],
  },
  timeline: [
    {
      date: "2018–2019",
      title: "Investigación y recuperación de fauna",
      description:
        "Trabajo de laboratorio e investigación en el Centro de Acuicultura de San Pedro del Pinatar (2018) y proyectos de enriquecimiento ambiental en el Centro de Recuperación de Animales Silvestres de Madrid (2019).",
    },
    {
      date: "2020–2025",
      title: "Educación y bienestar de animales de compañía",
      description:
        "Educación canina y felina en la protectora El Cobijo entre 2020 y 2025. En la residencia Somos muy perros (2020–2021), trabajo en protocolos de manejo y enriquecimiento ambiental.",
    },
    {
      date: "2021",
      title: "Wild Behavior",
      description:
        "Inicio del proyecto de divulgación sobre comportamiento animal, con especial atención a la etología canina y felina, en Instagram, TikTok, X y YouTube.",
    },
    {
      date: "2024–actualidad",
      title: "Coordinación de eventos en Scenio",
      description:
        "Como Events Manager de Scenio, coordino actividades de divulgación, equipos, logística y presupuesto.",
    },
    {
      date: "2025",
      title: "Lo que la ciencia sabe de tu gato",
      description:
        "Publicación de su libro sobre comportamiento felino en Hestia, una guía para comprender las necesidades de los gatos desde la ciencia.",
    },
  ] satisfies TimelineEntry[],
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
          label: "Ver el libro en Amazon",
          url: "https://www.amazon.es/dp/841296716X",
        },
      ],
    },
  ] satisfies Book[],
  booksSection: {
    title: "Ideas para seguir leyendo.",
    description:
      "Ciencia y divulgación para comprender mejor a los animales con los que convivimos.",
    pending:
      "Las nuevas publicaciones se incorporarán aquí cuando estén disponibles.",
    researchTitle: "También en la investigación",
  },
  publications: [
    {
      title:
        "Successful rearing of common octopus (Octopus vulgaris) fed a formulated feed in an offshore cage",
      year: 2019,
      journal: "Aquaculture Research",
      url: "https://doi.org/10.1111/are.13955",
    },
  ] satisfies Publication[],
  socials: [
    {
      name: "Instagram",
      description: "Comportamiento y bienestar animal con Wild Behavior",
      url: "https://www.instagram.com/wildbehav/",
    },
    {
      name: "TikTok",
      description: "Divulgación sobre perros, gatos y otros animales",
      url: "https://www.tiktok.com/@wildbehav",
    },
    {
      name: "YouTube",
      description: "Vídeos para explorar la etología",
      url: "https://www.youtube.com/channel/UCKotSK8QsfIXb7gikmephFQ",
    },
    {
      name: "X",
      description: "Etología y conversación sobre comportamiento animal",
      url: "https://x.com/wildbehav",
    },
  ] satisfies Social[],
  socialSection: {
    title: "La conversación continúa.",
    description:
      "Wild Behavior es mi proyecto de divulgación sobre comportamiento animal. Comparto contenidos de etología, especialmente canina y felina, basados en evidencia científica.",
    pending: "Los nuevos perfiles se incorporarán cuando estén confirmados.",
  },
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
      "Una consulta online o presencial, un proyecto o una idea. Para desplazamientos fuera de la Región de Murcia, cuéntame dónde necesitas la atención y valoraremos disponibilidad y presupuesto.",
    email: "mdolores.granfer@gmail.com",
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
  legal: {
    owner: "TODO: nombre o razón social del responsable",
    taxId: "TODO: NIF/CIF",
    address: "TODO: domicilio profesional",
    rightsEmail: "TODO: correo para ejercer derechos",
    retention: "TODO: plazo o criterio de conservación aprobado",
    legalBasis: "TODO: confirmar la base jurídica de cada finalidad",
  },
} as const;
