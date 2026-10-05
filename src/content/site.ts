import type {
  Audience,
  CollaborationType,
  ImageSlot,
  NavItem,
  SectionIntro,
  WorkArea,
} from './types'

/**
 * Contenido editable de la web de Mary Granero.
 *
 * - Cambia aquí los textos; no hace falta tocar los componentes.
 * - Los textos que empiezan por "TODO:" necesitan datos reales de Mary.
 * - Libros, trayectoria, redes y datos legales viven en books.ts, timeline.ts,
 *   social.ts y legal.ts.
 */

export const identity = {
  name: 'Mary Granero',
  /** Profesión y especialidad (dato confirmado en el encargo). */
  role: 'Etóloga',
  specialty: 'perros y gatos',
  /** Idioma principal del sitio. */
  locale: 'es-ES',
} as const

export const seo = {
  titleDefault: 'Mary Granero | Etóloga de perros y gatos',
  titleTemplate: '%s | Mary Granero',
  description:
    'Mary Granero es etóloga especializada en perros y gatos. Conoce su trabajo y contacta con ella para consultas, charlas, medios, editoriales y colaboraciones.',
  ogImageAlt: 'Mary Granero, etóloga de perros y gatos',
} as const

/** Los enlaces de cabecera siguen la estructura sugerida. El pie añade más destinos. */
export const headerNav: NavItem[] = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Sobre Mary', href: '/#sobre-mary' },
  { label: 'Trayectoria', href: '/#trayectoria' },
  { label: 'Libros', href: '/#libros' },
  { label: 'Redes y contenido', href: '/#redes' },
  { label: 'Contacto', href: '/#contacto' },
]

export const footerNav: NavItem[] = [
  { label: 'Sobre Mary', href: '/#sobre-mary' },
  { label: 'Ámbitos', href: '/#ambitos' },
  { label: 'Trayectoria', href: '/#trayectoria' },
  { label: 'Libros', href: '/#libros' },
  { label: 'Redes y contenido', href: '/#redes' },
  { label: 'Prensa y colaboraciones', href: '/#colaboraciones' },
  { label: 'Contacto', href: '/#contacto' },
]

export const headerCta: NavItem = { label: 'Contactar', href: '/#contacto' }

export const hero = {
  // TODO(copy): propuesta de valor provisional. Sustituir por el texto definitivo de Mary.
  valueProposition:
    'Entender cómo piensan, sienten y se comunican los perros y los gatos es el primer paso para convivir mejor con ellos.',
  primaryCta: { label: 'Escribir a Mary', href: '/#contacto' } satisfies NavItem,
  secondaryCta: { label: 'Conocer a Mary', href: '/#sobre-mary' } satisfies NavItem,
  audiencesTitle: '¿Cuál es tu caso?',
  audiences: [
    { label: 'Convives con un perro o un gato', reason: 'consulta' },
    { label: 'Trabajas en un medio o una editorial', reason: 'prensa-medios' },
    { label: 'Organizas un evento o una formación', reason: 'charla-evento' },
    { label: 'Representas a una marca o una entidad', reason: 'colaboracion-comercial' },
  ] satisfies Audience[],
  image: {
    // src: '/images/mary-hero.jpg',
    alt: 'TODO: describe la foto principal (quién aparece y qué hace).',
    width: 1600,
    height: 2000,
    placeholderLabel:
      'Foto principal pendiente. Retrato vertical de Mary con un perro o un gato, 4:5, mínimo 1600 × 2000 px.',
  } satisfies ImageSlot,
}

export const sections = {
  about: { id: 'sobre-mary', title: 'Sobre Mary', intro: '' },
  workAreas: {
    id: 'ambitos',
    title: 'Ámbitos de contacto',
    // TODO(Mary): confirmar qué servicios y colaboraciones ofrece realmente.
    intro:
      'Estos son los ámbitos en los que puedes escribirle. TODO: confirmar con Mary cuáles ofrece.',
  },
  timeline: {
    id: 'trayectoria',
    title: 'Trayectoria',
    intro: 'Formación, proyectos, publicaciones y colaboraciones, en orden cronológico.',
  },
  books: {
    id: 'libros',
    title: 'Libros y publicaciones',
    intro: 'Lecturas para entender y acompañar mejor a perros y gatos.',
  },
  social: {
    id: 'redes',
    title: 'Redes y contenido',
    intro: 'Dónde seguir su trabajo del día a día.',
  },
  press: {
    id: 'colaboraciones',
    title: 'Prensa y colaboraciones',
    intro:
      'Si preparas una entrevista, un reportaje, un libro, un evento o una campaña, cuéntale tu propuesta.',
  },
  contact: {
    id: 'contacto',
    title: 'Contacto',
    intro:
      'Cuéntale qué necesitas y a quién representas. Elige el motivo que mejor encaje y tu mensaje llegará bien orientado.',
  },
} satisfies Record<string, SectionIntro>

export const about = {
  // TODO(Mary): biografía breve. No inventar datos: usar solo información confirmada por Mary.
  bio: [
    'TODO: Biografía breve de Mary, primer párrafo (quién es y a qué se dedica).',
    'TODO: Biografía breve de Mary, segundo párrafo (formación y recorrido, solo con datos confirmados).',
  ],
  // TODO(Mary): filosofía de trabajo, con sus propias palabras.
  philosophy: 'TODO: Filosofía de trabajo de Mary, en una o dos frases con su propia voz.',
  ethologyTitle: 'Etología, en pocas palabras',
  // Definición general de la disciplina; no atribuye ninguna afirmación personal a Mary.
  ethologyText:
    'La etología es la rama de la biología que estudia el comportamiento de los animales: cómo actúan, por qué lo hacen y qué comunican. Aplicada a perros y gatos, ayuda a interpretar su lenguaje corporal y sus necesidades para mejorar la convivencia en casa.',
  image: {
    // src: '/images/mary-sobre-mi.jpg',
    alt: 'TODO: describe la foto secundaria (quién aparece y qué hace).',
    width: 1200,
    height: 1500,
    placeholderLabel:
      'Foto secundaria pendiente. Escena natural de Mary con un animal, 4:5, mínimo 1200 × 1500 px.',
  } satisfies ImageSlot,
}

export const workAreas: WorkArea[] = [
  {
    id: 'divulgacion',
    title: 'Divulgación',
    summary: 'Contenidos que acercan el comportamiento de perros y gatos al público general.',
    reason: 'otro',
  },
  {
    id: 'educacion-comportamiento',
    title: 'Educación sobre comportamiento',
    summary: 'Preguntas sobre cómo entender y acompañar el día a día de tu perro o tu gato.',
    reason: 'consulta',
  },
  {
    id: 'charlas-formacion',
    title: 'Charlas y formación',
    summary: 'Sesiones para familias, centros, asociaciones y equipos que trabajan con animales.',
    reason: 'charla-evento',
  },
  {
    id: 'asesoramiento-profesional',
    title: 'Asesoramiento profesional',
    summary: 'Criterio experto para proyectos, productos y servicios relacionados con animales.',
    reason: 'contratacion',
  },
]

export const press = {
  types: [
    {
      id: 'medios',
      title: 'Medios',
      summary: 'Prensa, radio, televisión y podcasts: entrevistas, reportajes y colaboraciones.',
      reason: 'prensa-medios',
    },
    {
      id: 'editoriales',
      title: 'Editoriales',
      summary: 'Proyectos editoriales, colecciones y contenidos sobre comportamiento animal.',
      reason: 'editorial',
    },
    {
      id: 'eventos',
      title: 'Eventos',
      summary: 'Congresos, ferias, jornadas y encuentros que quieran contar con su voz.',
      reason: 'charla-evento',
    },
    {
      id: 'marcas',
      title: 'Marcas y entidades',
      summary: 'Colaboraciones y asesoramiento para empresas y organizaciones del sector.',
      reason: 'colaboracion-comercial',
    },
  ] satisfies CollaborationType[],
  cta: { label: 'Enviar una propuesta profesional' },
}

/**
 * Datos públicos de contacto. Déjalos vacíos si no se quieren mostrar:
 * el formulario funciona igualmente (el destino real es CONTACT_TO_EMAIL).
 */
export const contactInfo: { email?: string; phone?: string; location?: string } = {
  // TODO(Mary): email: 'contacto@dominio.com',
  // TODO(Mary): phone: '+34 600 000 000',
  // TODO(Mary): location: 'Ciudad, País',
}

export const footer = {
  tagline: 'Etóloga de perros y gatos.',
}
