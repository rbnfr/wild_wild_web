import { site } from "@/content/site";
export const legalPages = {
  "aviso-legal": {
    title: "Aviso legal",
    description:
      "Identificación del titular y condiciones de uso del sitio de Mary Granero.",
    sections: [
      {
        title: "Titular del sitio",
        paragraphs: [
          site.legal.owner,
          site.legal.taxId,
          site.legal.address,
          site.legal.rightsEmail,
        ],
      },
      {
        title: "Objeto y uso",
        paragraphs: [
          "Este sitio presenta información profesional y permite enviar solicitudes de contacto. El contenido editorial provisional está identificado como pendiente y debe completarse antes de la publicación.",
          "TODO: aprobar las condiciones de uso, el alcance de los servicios y las responsabilidades que correspondan a la actividad real.",
        ],
      },
      {
        title: "Propiedad intelectual",
        paragraphs: [
          "La licencia del código se detalla en LICENSE. El nombre, las fotografías, las portadas y otros contenidos de terceros conservan sus derechos respectivos; la licencia del código no concede derechos sobre ellos.",
          "TODO: confirmar la titularidad y las autorizaciones del material publicado.",
        ],
      },
      {
        title: "Enlaces externos",
        paragraphs: [
          "Los perfiles y enlaces editoriales se añadirán únicamente tras su verificación. Los sitios de terceros tienen sus propias condiciones y políticas.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    description:
      "Información sobre el uso de los datos enviados mediante el formulario de contacto.",
    sections: [
      {
        title: "Responsable del tratamiento",
        paragraphs: [
          site.legal.owner,
          site.legal.address,
          site.legal.rightsEmail,
        ],
      },
      {
        title: "Datos y finalidad",
        paragraphs: [
          "El formulario recoge nombre, email, motivo, mensaje y, si los facilitas, empresa y teléfono. Se utilizan para gestionar la solicitud y responder. No se incorporan a una lista de marketing.",
          "Para prevenir abuso se procesan datos técnicos de la solicitud y, cuando esté configurado, la dirección IP. No incluyas datos sensibles o información innecesaria de otras personas en el mensaje.",
        ],
      },
      {
        title: "Legitimación y conservación",
        paragraphs: [
          site.legal.legalBasis,
          "La casilla de lectura de esta política es obligatoria y no está premarcada. No autoriza comunicaciones comerciales.",
          site.legal.retention,
        ],
      },
      {
        title: "Proveedores y destinatarios",
        paragraphs: [
          "La implementación utiliza Resend para remitir emails y Cloudflare Turnstile para verificar el formulario. Los datos también serán tratados por el proveedor de alojamiento y correo que se configure.",
          "TODO: identificar los proveedores finalmente contratados, los acuerdos de tratamiento, la ubicación del tratamiento y, cuando corresponda, las garantías de transferencias internacionales.",
        ],
      },
      {
        title: "Derechos",
        paragraphs: [
          "Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad cuando sean aplicables. Si el tratamiento se basa en consentimiento, puedes retirarlo. Puedes reclamar ante la Agencia Española de Protección de Datos.",
          site.legal.rightsEmail,
          "TODO: completar el procedimiento de atención de derechos y verificar el texto con un profesional antes de habilitar el formulario público.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookies y servicios externos",
    description:
      "Información sobre cookies, almacenamiento y servicios externos de este sitio.",
    sections: [
      {
        title: "Configuración de esta versión",
        paragraphs: [
          "La web no incorpora analítica, publicidad ni embeds de redes sociales. El código propio no establece cookies de seguimiento ni almacena el formulario en el navegador.",
        ],
      },
      {
        title: "Verificación de seguridad",
        paragraphs: [
          "Cuando se configura el formulario público, se carga Cloudflare Turnstile para prevenir envíos automatizados. Este servicio realiza verificaciones técnicas del navegador. La implementación no solicita pre-clearance ni utiliza su cookie cf_clearance.",
          "TODO: comprobar el comportamiento real del alojamiento y de los servicios contratados, y completar la información legal pertinente.",
        ],
      },
      {
        title: "Si se incorporan otros servicios",
        paragraphs: [
          "Antes de añadir analítica con cookies, publicidad o contenido externo que requiera consentimiento, deberá incorporarse una gestión de consentimiento que bloquee estos servicios hasta que el visitante los acepte.",
        ],
      },
    ],
  },
} as const;
