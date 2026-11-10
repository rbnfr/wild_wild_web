import type {
  AboutPhotoId,
  BookId,
  PressId,
  ServiceId,
  SocialId,
} from "@/content/site";
import type { ContactError, ContactReason } from "@/lib/contact/schema";
import { legal } from "@/content/legal/es";

// Source language. Its shape is the contract every other dictionary must meet.
export const es = {
  seo: {
    title: "Mary Granero | Bióloga y etóloga canina y felina",
    description:
      "Mary Granero, bióloga, etóloga canina y felina y divulgadora de Wild Behavior. Autora de Lo que la ciencia sabe de tu gato.",
    profession: "Bióloga y etóloga canina y felina",
    ogTagline: "Etología · Perros y gatos",
  },
  common: {
    skipLink: "Saltar al contenido",
    newTab: "(nueva pestaña)",
    backHome: "Volver al inicio",
    language: "Idioma",
  },
  header: {
    tagline: "Etología y convivencia",
    navLabel: "Navegación principal",
    menu: "Menú",
    close: "Cerrar",
    cta: "Hablemos",
    nav: {
      about: "Sobre mí",
      services: "Servicios",
      outreach: "Divulgación",
      collaborations: "Colaboraciones",
    },
  },
  footer: {
    socialsLabel: "Redes sociales",
    legalLabel: "Información legal",
    links: {
      legalNotice: "Aviso legal",
      privacy: "Privacidad",
      cookies: "Cookies",
    },
  },
  hero: {
    label: "Etología · Divulgación · Mascotas",
    title: "Comprenderles cambia la forma de convivir.",
    description:
      "Ayudo a familias multiespecie a convivir en armonía. Conocer a nuestros peludos con evidencia científica nos ayuda a ofrecerles lo que necesitan para mejorar su bienestar y nuestra convivencia.",
    primary: "Cuéntame tu caso",
    secondary: "Propón una colaboración",
    imageAlt:
      "Mary Granero agachada junto a un perro negro y fuego en el monte",
    socialsLabel: "Mis redes sociales",
    footStart: "Un espacio para entendernos mejor",
    footEnd: "Personas, perros y gatos",
    scrollLabel: "Descubrir sobre mí",
  },
  about: {
    title: "Detrás de cada comportamiento, hay algo que comprender.",
    cta: "Mira cómo puedo ayudarte",
    photos: {
      label: "Fotografías de mi trabajo",
      previous: "Fotografía anterior",
      next: "Fotografía siguiente",
      pause: "Detener el pase automático",
      play: "Reanudar el pase automático",
      position: "{current} de {total}",
      alt: {
        "with-dog":
          "Mary sonríe junto a un perro de pelo largo castaño y blanco",
        "shelter-walk":
          "Paseo con correa de un perro negro y fuego frente a unos cheniles",
        "event-group":
          "Foto de grupo con una treintena de personas en un evento",
      } satisfies Record<AboutPhotoId, string>,
    },
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
        id: "canine" as ServiceId,
        imageAlt: "Tres perros sentados sobre el césped de un parque",
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
        id: "feline" as ServiceId,
        imageAlt: "Gata tricolor tumbada en el brazo de un sofá",
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
        id: "shelters" as ServiceId,
        imageAlt: "Dos pastores alemanes en un chenil",
        title: "Asesoramiento a protectoras",
        description:
          "Experiencia en enriquecimiento ambiental, protocolos de manejo y asesoramiento para protectoras y residencias caninas.",
        topics: [] as string[],
        tag: "Para protectoras",
      },
    ],
  },
  outreach: {
    title: "Divulgación.",
    socialsTitle: "Redes",
    booksTitle: "Libro",
    pressTitle: "Prensa",
    bookCta: "Consigue tu ejemplar",
    printEdition: (pages: number) => `${pages} páginas · Edición impresa`,
    coverAlt: (title: string, author: string) =>
      `Portada de ${title}, de ${author}`,
  },
  socials: {
    instagram: "Comportamiento y bienestar animal con Wild Behavior",
    tiktok: "Divulgación sobre perros, gatos y otros animales",
    youtube: "Vídeos para explorar la etología",
    facebook: "La comunidad de Wild Behavior",
    x: "Etología y conversación sobre comportamiento animal",
  } satisfies Record<SocialId, string>,
  books: {
    "cat-science":
      "Una guía para entender a los gatos desde la evidencia científica. Mary reúne conocimientos sobre comunicación, comportamiento y necesidades felinas para revisar mitos habituales y ayudar a mejorar su bienestar y la convivencia en casa.",
  } satisfies Record<BookId, string>,
  press: {
    "muy-interesante": "Lectura exclusiva de un capítulo del libro",
    "20-minutos": "Noticia sobre la publicación del libro",
    "vanguardia-maullan": "«Los gatos casi nunca maúllan entre ellos»",
    "national-geographic": "«Ozempic para gatos»",
    "vanguardia-reconciliacion":
      "«Los gatos no tienen herramientas de reconciliación»",
    tvnoticias:
      "«La relación entre humanos y gatos no comenzó con adiestramiento ni cría selectiva»",
  } satisfies Record<PressId, string>,
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
    privacyNote:
      "El borrador se prepara en tu dispositivo. Cuando envíes el correo, los datos se usarán para gestionar tu solicitud. Consulta los detalles en la",
    privacyLink: "política de privacidad",
    form: {
      label: "Formulario de contacto",
      note: "Los campos con * son obligatorios. Prepararemos un correo para que lo envíes desde tu aplicación; también podrás copiarlo.",
      fields: {
        name: "Nombre",
        email: "Email",
        company: "Empresa u organización",
        phone: "Teléfono",
      },
      optional: "(opcional)",
      reason: "Motivo de contacto",
      reasonPlaceholder: "Selecciona un motivo",
      message: "Tu mensaje",
      messageHelp: "Entre 20 y 4.000 caracteres. No incluyas datos sensibles.",
      privacyAccept: "He leído y acepto la",
      privacyLink: "política de privacidad",
      submit: "Preparar correo",
      status: {
        invalid: "Revisa los campos indicados antes de preparar el correo.",
        ready: "Borrador preparado. Todavía no se ha enviado ningún correo.",
        copied:
          "Borrador copiado. Pégalo en tu correo, revísalo y envíalo desde allí.",
        copyFailed:
          "No se ha podido copiar automáticamente. El borrador está seleccionado para que lo copies manualmente.",
      },
      draft: {
        title: "Tu correo está preparado",
        text: "Ábrelo en tu aplicación, revisa el contenido y pulsa enviar allí. Si no tienes una aplicación configurada, copia el borrador en tu correo habitual.",
        open: "Abrir mi aplicación de correo",
        copy: "Copiar borrador",
        label: "Borrador para copiar",
      },
      noscript:
        "Para usar el formulario, activa JavaScript. También puedes escribir directamente a",
      errors: {
        nameShort: "Escribe tu nombre.",
        emailInvalid: "Escribe un email válido.",
        tooLong: "El texto es demasiado largo.",
        controlChars: "No se permiten caracteres de control.",
        reasonRequired: "Selecciona un motivo de contacto.",
        messageShort: "Escribe un mensaje de al menos 20 caracteres.",
        messageChars: "El mensaje contiene caracteres no permitidos.",
        privacyRequired: "Acepta la política de privacidad.",
      } satisfies Record<ContactError, string>,
      mail: {
        to: "Para",
        subjectLabel: "Asunto",
        subject: "Contacto con Mary Granero",
        name: "Nombre",
        email: "Email de contacto",
        company: "Empresa u organización",
        phone: "Teléfono",
        reason: "Motivo",
        reasons: {
          consulta: "Consulta",
          contratacion: "Contratación",
          evento: "Charla o evento",
          prensa: "Prensa o medios",
          editorial: "Proyecto editorial",
          colaboracion: "Colaboración comercial",
          otro: "Otro",
        } satisfies Record<ContactReason, string>,
      },
    },
  },
  notFound: {
    eyebrow: "Página no encontrada",
    title: "Volvamos a encontrarnos.",
    text: "La dirección que has abierto no existe.",
  },
  llms: {
    contact: "Contacto",
    topics: "Temas",
    contactForm: "Formulario de contacto",
    email: "Correo electrónico",
  },
  legal,
};
