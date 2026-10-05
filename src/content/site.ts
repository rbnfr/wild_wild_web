export type TimelineEntry = {
  date: string;
  title: string;
  description: string;
};
export type Book = {
  title: string;
  subtitle: string;
  year: number;
  publisher: string;
  description: string;
  cover: string;
  isbn?: string;
  links: { label: string; url: string }[];
};
export type Social = { name: string; description: string; url: string };

// TODO: confirmar todo el contenido editorial antes de activar la indexación.
export const site = {
  name: "Mary Granero",
  profession: "Etóloga de animales de compañía",
  contentStatus: "TODO: propuesta editorial pendiente de aprobación",
  seo: {
    title: "Mary Granero | Etología y convivencia con perros y gatos",
    description:
      "Mary Granero, etóloga especializada en animales de compañía. Un espacio para el comportamiento, la convivencia y las propuestas profesionales.",
    readyToIndex: false,
  },
  nav: [
    { label: "Sobre Mary", href: "/#sobre-mary" },
    { label: "Trayectoria", href: "/#trayectoria" },
    { label: "Libros", href: "/#libros" },
    { label: "Contenido", href: "/#contenido" },
  ],
  hero: {
    label: "Etología · Perros y gatos",
    title: "Comprenderles cambia la forma de convivir.",
    description:
      "Soy Mary Granero, etóloga de animales de compañía. Este es un espacio para mirar el comportamiento con curiosidad y acercarnos a los animales con los que compartimos la vida.",
    primary: "Hablemos",
    secondary: "Conoce a Mary",
    image: "/images/portrait-placeholder.svg",
    imageAlt:
      "Espacio reservado para una fotografía real de Mary Granero junto a un animal de compañía",
    caption: "TODO: fotografía de Mary en convivencia con un perro o gato",
  },
  about: {
    title: "Detrás de cada comportamiento, hay algo que comprender.",
    intro:
      "Mary Granero es etóloga especializada en animales de compañía, especialmente perros y gatos.",
    paragraphs: [
      "TODO: añadir una biografía breve aprobada por Mary, con su formación y experiencia verificadas.",
      "TODO: describir su filosofía de trabajo y su enfoque sobre el bienestar, el comportamiento y la convivencia.",
    ],
    image: "/images/detail-placeholder.svg",
    caption: "TODO: fotografía de un momento de convivencia real",
  },
  areas: {
    title: "Distintas formas de acercarnos a su mundo.",
    note: "Estas son posibles áreas de contacto. TODO: confirmar con Mary las actividades y servicios disponibles.",
    items: [
      {
        title: "Comportamiento y convivencia",
        description:
          "Consultas sobre perros, gatos y la vida que compartimos con ellos.",
        tag: "Para familias",
        symbol: "bond",
      },
      {
        title: "Divulgación y formación",
        description:
          "Propuestas de charlas, encuentros y contenidos sobre comportamiento animal.",
        tag: "Para entidades",
        symbol: "talk",
      },
      {
        title: "Proyectos y colaboraciones",
        description:
          "Propuestas de medios, editoriales y marcas con interés en el bienestar animal.",
        tag: "Para profesionales",
        symbol: "book",
      },
    ],
  },
  timeline: [
    {
      date: "TODO: fechas",
      title: "Formación y especialización",
      description: "Añadir titulaciones, centros y fechas verificadas.",
    },
    {
      date: "TODO: fechas",
      title: "Experiencia y proyectos",
      description: "Añadir hitos profesionales y proyectos confirmados.",
    },
    {
      date: "TODO: fechas",
      title: "Divulgación y publicaciones",
      description: "Añadir publicaciones y apariciones con su fuente oficial.",
    },
  ] satisfies TimelineEntry[],
  books: [] as Book[],
  booksSection: {
    title: "Ideas para seguir leyendo.",
    description: "Un lugar para reunir los libros y publicaciones de Mary.",
    pending:
      "TODO: incorporar títulos, portadas, editorial, año y enlaces oficiales verificados.",
  },
  socials: [] as Social[],
  socialSection: {
    title: "La conversación continúa.",
    description:
      "Contenido para seguir explorando el comportamiento y la convivencia con perros y gatos.",
    pending:
      "TODO: añadir los perfiles oficiales de Mary y sus enlaces verificados.",
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
      "Una consulta, un proyecto o una idea. Elige el motivo de contacto y comparte los detalles.",
    email: "", // TODO: correo profesional confirmado; nunca un ejemplo público.
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
