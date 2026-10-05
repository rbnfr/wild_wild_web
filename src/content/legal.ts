/**
 * Datos y textos de las páginas legales.
 *
 * IMPORTANTE: son un borrador técnico. Antes de publicar, rellena los datos reales
 * y haz que un profesional del derecho revise el texto (LSSI-CE, RGPD y LOPDGDD).
 * Cuando esté revisado, cambia `status` a 'reviewed' para ocultar el aviso de borrador.
 */

export type LegalSection = {
  id: string
  title: string
  paragraphs?: string[]
  items?: string[]
}

export const legal = {
  status: 'draft' as 'draft' | 'reviewed',
  lastUpdated: 'TODO: fecha de la última actualización',
  controller: {
    name: 'TODO: nombre y apellidos o razón social del titular',
    taxId: 'TODO: NIF o CIF',
    address: 'TODO: domicilio completo',
    email: 'TODO: correo electrónico para asuntos legales y de privacidad',
    registry: undefined as string | undefined, // TODO: datos registrales, si el titular es una sociedad
  },
  /** TODO: plazo real decidido con el asesor. */
  retention:
    'TODO: plazo de conservación (por ejemplo, el tiempo necesario para atender la solicitud y los plazos legales posteriores).',
  /** Proveedores técnicos que intervienen en el formulario. Revisa que coincidan con tu infraestructura real. */
  processors: [
    { name: 'Resend', purpose: 'envío del correo electrónico con el contenido del formulario' },
    { name: 'Cloudflare (Turnstile)', purpose: 'verificación anti-spam del formulario' },
    { name: 'Hostinger', purpose: 'alojamiento web (TODO: confirmar proveedor de hosting)' },
  ],
}

const c = legal.controller

export const legalNoticeSections: LegalSection[] = [
  {
    id: 'titular',
    title: 'Datos del titular',
    paragraphs: [
      'En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los siguientes datos del titular de este sitio web:',
    ],
    items: [
      `Titular: ${c.name}`,
      `NIF/CIF: ${c.taxId}`,
      `Domicilio: ${c.address}`,
      `Correo electrónico: ${c.email}`,
      ...(c.registry ? [`Datos registrales: ${c.registry}`] : []),
    ],
  },
  {
    id: 'objeto',
    title: 'Objeto y condiciones de uso',
    paragraphs: [
      'Este sitio web presenta el trabajo profesional de Mary Granero y permite contactar con ella. El acceso y uso del sitio atribuye la condición de usuario e implica la aceptación de estas condiciones.',
      'El usuario se compromete a hacer un uso adecuado del sitio y de sus contenidos, sin realizar actividades ilícitas ni contrarias a la buena fe, y sin dañar o sobrecargar el sitio ni su funcionamiento.',
    ],
  },
  {
    id: 'propiedad-intelectual',
    title: 'Propiedad intelectual e industrial',
    paragraphs: [
      'Los textos, fotografías, diseños y demás contenidos del sitio pertenecen a su titular o a terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial.',
      'Queda prohibida su reproducción, distribución o comunicación pública, total o parcial, sin autorización expresa, salvo en los supuestos permitidos por la ley.',
    ],
  },
  {
    id: 'responsabilidad',
    title: 'Responsabilidad y enlaces externos',
    paragraphs: [
      'El titular procura que la información del sitio sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida del servicio.',
      'El sitio puede enlazar a páginas de terceros (por ejemplo, redes sociales o tiendas). El titular no controla ni se responsabiliza de sus contenidos ni de sus políticas.',
    ],
  },
  {
    id: 'proteccion-de-datos',
    title: 'Protección de datos',
    paragraphs: [
      'El tratamiento de los datos personales que se faciliten a través del formulario de contacto se describe en la política de privacidad.',
    ],
  },
  {
    id: 'ley-aplicable',
    title: 'Legislación aplicable y jurisdicción',
    paragraphs: [
      'Estas condiciones se rigen por la legislación española. TODO: revisar con un profesional la cláusula de jurisdicción aplicable, especialmente si el usuario es consumidor.',
    ],
  },
]

export const privacySections: LegalSection[] = [
  {
    id: 'responsable',
    title: 'Responsable del tratamiento',
    items: [
      `Responsable: ${c.name}`,
      `NIF/CIF: ${c.taxId}`,
      `Domicilio: ${c.address}`,
      `Correo electrónico: ${c.email}`,
    ],
  },
  {
    id: 'datos',
    title: 'Qué datos tratamos',
    paragraphs: ['A través del formulario de contacto se recogen los datos que tú introduces:'],
    items: [
      'Nombre y correo electrónico (obligatorios).',
      'Organización y teléfono (opcionales).',
      'Motivo de contacto y contenido del mensaje.',
    ],
  },
  {
    id: 'datos-tecnicos',
    title: 'Datos técnicos de seguridad',
    paragraphs: [
      'Para limitar el spam y los abusos, el servidor usa temporalmente tu dirección IP para contar los envíos y el servicio de verificación Cloudflare Turnstile analiza señales técnicas del navegador. La IP no se guarda con el mensaje.',
    ],
  },
  {
    id: 'finalidad',
    title: 'Finalidad',
    paragraphs: [
      'Atender tu consulta o propuesta profesional y responderte. No se utilizan estos datos para enviar publicidad ni se elaboran perfiles.',
    ],
  },
  {
    id: 'legitimacion',
    title: 'Legitimación',
    paragraphs: [
      'La base jurídica es tu consentimiento (art. 6.1.a RGPD), que otorgas al marcar la casilla de aceptación y enviar el formulario. Puedes retirarlo en cualquier momento escribiendo a la dirección indicada arriba, sin que ello afecte a la licitud del tratamiento previo.',
    ],
  },
  {
    id: 'conservacion',
    title: 'Plazo de conservación',
    paragraphs: [legal.retention],
  },
  {
    id: 'destinatarios',
    title: 'Destinatarios y encargados del tratamiento',
    paragraphs: [
      'No se ceden datos a terceros salvo obligación legal. Para prestar el servicio intervienen proveedores que actúan como encargados del tratamiento:',
    ],
    items: legal.processors.map((processor) => `${processor.name}: ${processor.purpose}.`),
  },
  {
    id: 'transferencias',
    title: 'Transferencias internacionales',
    paragraphs: [
      'Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. TODO: confirmar con un profesional las garantías aplicables (decisión de adecuación o cláusulas contractuales tipo) para cada proveedor.',
    ],
  },
  {
    id: 'derechos',
    title: 'Tus derechos',
    paragraphs: [
      'Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo al correo electrónico indicado como responsable e identificándote.',
      'Si consideras que el tratamiento no es adecuado, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).',
    ],
  },
  {
    id: 'menores',
    title: 'Menores de edad',
    paragraphs: [
      'El formulario no está dirigido a menores de 14 años. Si eres menor de esa edad, pide a tu madre, padre o tutor que se ponga en contacto.',
    ],
  },
  {
    id: 'comunicaciones-comerciales',
    title: 'Comunicaciones comerciales',
    paragraphs: [
      'El formulario no envía comunicaciones comerciales. Si en el futuro se ofrece esa posibilidad, será mediante una casilla independiente, opcional y no premarcada.',
    ],
  },
]

export const cookieSections: LegalSection[] = [
  {
    id: 'que-son',
    title: 'Qué son las cookies',
    paragraphs: [
      'Las cookies y tecnologías similares son pequeños archivos o datos que un sitio web guarda en tu dispositivo para recordar información.',
    ],
  },
  {
    id: 'que-usamos',
    title: 'Qué usa este sitio',
    paragraphs: [
      'Este sitio no instala cookies de analítica, publicidad ni seguimiento, y no carga contenidos de terceros que las instalen. Por eso no muestra un banner de cookies.',
      'Al usar el formulario de contacto se carga el servicio de seguridad Cloudflare Turnstile, solo cuando interactúas con el formulario. Su finalidad es técnica y de seguridad (comprobar que el envío lo hace una persona). Puede usar almacenamiento técnico en tu navegador para ese fin. TODO: revisar este apartado con un profesional.',
    ],
  },
  {
    id: 'gestionar',
    title: 'Cómo gestionarlas',
    paragraphs: [
      'Puedes borrar o bloquear los datos almacenados desde la configuración de tu navegador. Si bloqueas el almacenamiento técnico de Turnstile, es posible que el formulario no pueda verificarse.',
    ],
  },
  {
    id: 'cambios',
    title: 'Cambios futuros',
    paragraphs: [
      'Si en el futuro se añade analítica con cookies, publicidad o contenidos incrustados que las instalen, se pedirá tu consentimiento antes de cargarlos y se actualizará esta política.',
    ],
  },
]
