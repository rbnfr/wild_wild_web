# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos públicos con el mismo peso; ninguno se subordina al otro.

- **Familias y personas que conviven con perros o gatos**, incluidas personas adoptantes. Quieren entender a su animal, resolver problemas de conducta o mejorar su bienestar y la convivencia. Buscan una consulta online o presencial (Región de Murcia; desplazamientos a la Comunidad Valenciana, Andalucía y, con mayor coste, al resto de España).
- **Medios, editoriales, marcas, organizadores de eventos y entidades** (protectoras, residencias, empresas). Evalúan a Mary como divulgadora, autora o experta para entrevistas, charlas, proyectos editoriales, colaboraciones o asesoramiento profesional.

Cada perfil debe identificar rápidamente dónde dirigirse: la navegación, las áreas de trabajo y los motivos del formulario de contacto los separan.

## Product Purpose

Landing page personal de Mary Granero (María Dolores Granero Fernández), bióloga y etóloga canina y felina. Presenta quién es, su formación y trayectoria, su libro y su proyecto de divulgación Wild Behavior, y convierte el interés en contacto: consultas, contrataciones y propuestas de colaboración.

Éxito: que una familia o un profesional entienda en segundos quién es Mary y qué puede hacer por ellos, confíe en su rigor y le escriba.

## Positioning

- **Base científica.** Bióloga y etóloga con formación universitaria (Grado en Biología, UMU; Máster en Intervención Asistida con Animales y Etología Aplicada, UAM) y una publicación científica. Explica el comportamiento desde la evidencia, no desde mitos ni recetas.
- **Perros y gatos.** Trabaja con las dos especies, con un peso especial en gatos: es autora de *Lo que la ciencia sabe de tu gato*.
- **Divulgadora.** Wild Behavior (desde 2021) y el libro le dan voz pública además de la consulta. Práctica, divulgación y publicación se refuerzan mutuamente.

No debe parecer una clínica veterinaria, una protectora, una tienda de mascotas ni una plantilla corporativa genérica.

## Operating Context

- Web estática (Next.js con exportación estática) alojada en Hostinger; no hay Node.js ni servidor en producción. Se publica mediante GitHub Actions hacia la rama `main` o mediante ZIP (ver README).
- El formulario de contacto no envía datos: genera un borrador de correo en el dispositivo del visitante, que lo envía desde su propia aplicación. Sin JavaScript queda el email directo.
- Política CSP con hashes de los scripts generados; cabeceras de seguridad en `.htaccess`.
- Sin embeds de redes sociales, analítica ni tracking. Si se añaden, requieren consentimiento previo.
- El contenido editable vive en `src/content/site.ts`; las fuentes de cada dato están en `docs/content-sources.md`.

## Capabilities and Constraints

- Secciones actuales: hero, Sobre Mary (con formación), áreas de trabajo, trayectoria, libros, redes y contenido, colaboraciones, contacto y páginas legales (privacidad, aviso legal, cookies).
- Áreas de trabajo confirmadas: comportamiento y convivencia (familias), divulgación científica (medios y entidades), bienestar y entornos (profesionales).
- Modalidades confirmadas: consultas online y presenciales en la Región de Murcia; desplazamientos según destino y presupuesto.
- Indexación desactivada (`seo.readyToIndex: false`) hasta completar los datos jurídicos.
- Pendiente y sin decidir: datos jurídicos del responsable (nombre o razón social, NIF, domicilio, correo de derechos, conservación, base jurídica). No se deben inventar.
- Prioridades del proyecto, en orden: funcionamiento, seguridad, accesibilidad, rendimiento, mantenibilidad, SEO, calidad visual y efectos. Ningún efecto justifica perder rendimiento, accesibilidad o claridad.

## Brand Commitments

- Nombre público: **Mary Granero**; nombre completo: María Dolores Granero Fernández. Proyecto de divulgación: **Wild Behavior** (`@wildbehav`).
- Voz: primera persona de Mary y tuteo al visitante. Cercana, tranquila y experta; nunca infantil.
- Sin iconos de huellas repetidos ni ilustraciones caricaturescas. La fotografía real de Mary manda.

## Evidence on Hand

- Retrato de Mary: `public/images/portrait_01.jpg` (854 × 1280).
- Portada del libro: `public/images/portada_libro_01.jpg` (297 × 445). Ficha: Hestia, 2025, 304 páginas, ISBN 9788412967166, enlace a Amazon sin parámetros de seguimiento.
- Publicación científica en *Aquaculture Research* (2019), DOI 10.1111/are.13955.
- Perfiles oficiales: Instagram, TikTok, X (`wildbehav`) y YouTube, verificados desde el Linktree de Wild Behavior.
- CV privados en `.docs/CVs`: fuente de datos, nunca se publican (ni domicilio, fecha de nacimiento, teléfono ni números de certificados).
- **No existen y no se deben fabricar:** testimonios, clientes, cifras de seguidores, apariciones en prensa, tarifas, resultados clínicos ni fotografías de Mary con animales. Si se necesitan, se dejan como hueco identificado.

## Product Principles

1. **Rigor antes que promesa.** Cada afirmación factual tiene fuente documentada; nada se inventa ni se exagera.
2. **Dos puertas, una casa.** Familias y profesionales encuentran su camino sin que uno eclipse al otro.
3. **Comprender para convivir.** El mensaje es entender al animal, no corregirlo ni venderle productos.
4. **Ligera, segura y privada.** Estática, sin tracking ni dependencias innecesarias; el visitante controla sus datos.
5. **Mary en primer plano.** La persona, su voz y su trabajo real pesan más que la decoración.

## Accessibility & Inclusion

- Objetivo: WCAG 2.2 AA, comprobado con `@axe-core/playwright` y `eslint-plugin-jsx-a11y`.
- Todo funciona sin animaciones (`prefers-reduced-motion`), sin hover (dispositivos táctiles) y con el contacto disponible sin JavaScript.
- Objetivos táctiles de al menos 44–48 px y foco visible en todos los elementos interactivos.
