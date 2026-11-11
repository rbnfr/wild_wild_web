import { email, ownerLines } from "./owner";

const owner = ownerLines({
  owner: "Titular",
  taxId: "NIF",
  address: "Domicilio",
  email: "Correo electrónico",
  pending: "pendiente de completar",
});

export const legal = {
  legalNotice: {
    title: "Aviso legal",
    description: "Identificación del titular y condiciones de uso del sitio.",
    sections: [
      {
        title: "Titular del sitio",
        paragraphs: [
          "En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:",
          ...owner,
        ],
      },
      {
        title: "Condiciones de uso",
        paragraphs: [
          "El acceso a este sitio es gratuito e implica la aceptación de estas condiciones. La persona usuaria se compromete a hacer un uso adecuado de los contenidos y a no emplearlos con fines ilícitos.",
          "La información publicada tiene carácter divulgativo y no sustituye una valoración profesional individualizada.",
        ],
      },
      {
        title: "Propiedad intelectual",
        paragraphs: [
          "Los textos, fotografías y demás contenidos de este sitio pertenecen a su titular o se usan con autorización. Queda prohibida su reproducción, distribución o comunicación pública sin permiso expreso, salvo los usos permitidos por la ley.",
        ],
      },
      {
        title: "Enlaces externos",
        paragraphs: [
          "Este sitio enlaza a redes sociales, medios de comunicación y tiendas de terceros. La titular no se responsabiliza de sus contenidos ni de sus políticas, que se rigen por sus propias condiciones.",
        ],
      },
      {
        title: "Legislación aplicable",
        paragraphs: ["Estas condiciones se rigen por la legislación española."],
      },
    ],
  },
  privacy: {
    title: "Política de privacidad",
    description:
      "Cómo se tratan los datos que envías por correo electrónico y las estadísticas de visitas.",
    sections: [
      { title: "Responsable del tratamiento", paragraphs: owner },
      {
        title: "Qué datos se tratan y para qué",
        paragraphs: [
          "El formulario de contacto no envía ni guarda datos: prepara un borrador en tu dispositivo. Solo cuando tú envías el correo desde tu aplicación se reciben los datos que incluyas (nombre, email, teléfono, organización y mensaje).",
          "Se usan únicamente para responder a tu consulta o propuesta y, en su caso, prestar el servicio que solicites. No se usan para enviar publicidad.",
        ],
      },
      {
        title: "Estadísticas de visitas",
        paragraphs: [
          "Para saber cuántas personas visitan el sitio y qué páginas consultan se usa Umami, una herramienta de analítica sin cookies. Registra datos agregados: página visitada, sitio de procedencia, país, tipo de dispositivo, navegador y sistema operativo. No guarda tu dirección IP, no instala cookies ni guarda nada en tu dispositivo y no permite identificarte ni seguirte entre sitios.",
          "Si tu navegador tiene activada la opción «No rastrear» (Do Not Track), no se registra tu visita. La base jurídica es el interés legítimo en conocer el uso del sitio para mejorarlo (art. 6.1.f del RGPD).",
        ],
      },
      {
        title: "Base jurídica",
        paragraphs: [
          "La aplicación de medidas precontractuales a petición tuya cuando solicitas un servicio (art. 6.1.b del RGPD) y tu consentimiento al escribir para cualquier otra consulta (art. 6.1.a del RGPD), que puedes retirar en cualquier momento.",
        ],
      },
      {
        title: "Conservación",
        paragraphs: [
          "Los datos se conservan el tiempo necesario para atender tu solicitud y, después, durante los plazos legales en que puedan exigirse responsabilidades.",
        ],
      },
      {
        title: "Destinatarios",
        paragraphs: [
          "No se ceden datos a terceros salvo obligación legal. Los proveedores de alojamiento web (Hostinger), de correo electrónico (Google) y de estadísticas de visitas (Umami) actúan como encargados del tratamiento. Google puede tratar datos fuera del Espacio Económico Europeo con las garantías previstas en el RGPD, como el Marco de Privacidad de Datos UE-EE. UU.",
        ],
      },
      {
        title: "Tus derechos",
        paragraphs: [
          `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a ${email}. Si consideras que no se han atendido correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
        ],
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    description: "Información sobre el uso de cookies en este sitio.",
    sections: [
      {
        title: "Uso de cookies",
        paragraphs: [
          "Este sitio no utiliza cookies propias ni de terceros con fines analíticos, publicitarios o de personalización. Por eso no se muestra un aviso de cookies.",
          "Solo podrían emplearse cookies técnicas estrictamente necesarias para el funcionamiento del alojamiento, que están exentas de consentimiento según el artículo 22.2 de la LSSI-CE.",
        ],
      },
      {
        title: "Estadísticas de visitas sin cookies",
        paragraphs: [
          "Las visitas se cuentan con Umami, que no usa cookies ni almacena nada en tu navegador. Más detalles en la política de privacidad.",
        ],
      },
      {
        title: "Preferencia de idioma",
        paragraphs: [
          "Si cambias el idioma con el selector, tu navegador guarda esa elección (almacenamiento local, clave «lang») para mostrarte el mismo idioma en tu próxima visita. Es una preferencia que tú solicitas, no identifica a nadie, no se envía a ningún servidor y está exenta de consentimiento según el artículo 22.2 de la LSSI-CE. Puedes borrarla desde la configuración de tu navegador.",
        ],
      },
      {
        title: "Enlaces a otros sitios",
        paragraphs: [
          "Al seguir un enlace a redes sociales, medios o tiendas, esos sitios pueden instalar sus propias cookies, reguladas por sus políticas.",
        ],
      },
    ],
  },
};
