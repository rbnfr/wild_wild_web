# Plan y sistema de diseño

## Arquitectura

Repositorio inicial sin aplicación: se crea Next.js App Router, React, TypeScript estricto, Tailwind y CSS con tokens. Las secciones son Server Components; navegación y formulario son las únicas islas interactivas. Datos en `src/content/site.ts`, textos jurídicos en `src/content/legal.ts`. Sin CMS ni estado global.

Contacto mediante route handler: Zod compartido, cuerpo acotado, origen validado, honeypot, limitación por proceso, Turnstile verificado en servidor y Resend por API. El modo local simula únicamente el transporte y comunica que no envía correo; producción lo ignora.

## Dirección visual

Una composición de cuaderno de campo editorial, con una gran ventana vertical para la fotografía. El vínculo humano-animal queda en el centro; sin iconos de huellas, estadísticas inventadas ni insignias de autoridad ficticias.

Paleta: marfil `#faf7ef` para una lectura reposada; bosque `#244c3e` para texto de marca y acciones; tinta `#243b30`; salvia `#e9ede3` para el bloque biográfico; arena `#f0e9db` para publicaciones; gris botánico `#5b665c` para texto secundario. Se evita añadir terracota para no multiplicar acentos.

Newsreader regular en títulos y wordmark: voz editorial, legible y humana. DM Sans en navegación, párrafos y formulario: claridad práctica. Ambas fuentes se sirven localmente mediante `next/font/local`; las licencias se conservan junto a los archivos.

Título fluido 46–82 px, encabezados 38–56 px, cuerpo 16–19 px y pequeños textos 12–14 px. Columnas alineadas a la izquierda, medidas de lectura moderadas. Contenedor máximo 1220 px. Espacios de sección 64 px móvil / 100 px escritorio. Radios de controles 4–6 px; el retrato usa un arco grande para dar identidad al primer pantallazo. No hay sombras de tarjetas repetidas; solo la portada provisional se apoya con un pequeño desplazamiento de papel.

```text
Escritorio
nombre                       navegación          contacto
titular editorial            ventana de fotografía
descripción / acciones       pie identificando el TODO
---------------------------------------------------------
fotografía secundaria        biografía y enfoque
áreas de contacto en tres columnas, separadas por divisores
trayectoria                  hitos estructurados
publicaciones                contenido / redes
propuesta profesional        llamada a contactar
introducción al contacto     formulario
pie y textos legales

Móvil
nombre                       menú desplegable
titular / descripción / acciones
ventana de fotografía
secciones en una columna
formulario, pie
```

Comparación de alternativas: una cuadrícula homogénea de tarjetas resulta poco personal; una portada tipográfica sin espacio visual desaprovecha la prioridad fotográfica. Se elige el retrato editorial con ritmo alternado de fondos. Los placeholders vegetales se identifican expresamente; no representan una fotografía ni a Mary.

## Interacción y accesibilidad

Menú móvil desplegable en el flujo del documento, sin trampa de foco; Escape cierra y devuelve el foco. Enlaces de ancla y skip link. Formulario con etiquetas, errores asociados, estado anunciado y consentimiento no premarcado. Sin movimiento automático; las transiciones pequeñas y desplazamiento suave respetan movimiento reducido. Botones de al menos 46–52 px.

## Pendientes de contenido

Solo se utilizan nombre, profesión y especialidad proporcionados. La propuesta de copy está identificada como pendiente de aprobación. Trayectoria, datos jurídicos e imágenes tienen TODO visibles. Libros y redes son listas vacías. Sin datos ficticios en JSON-LD, sin enlaces comerciales, sin indexación hasta completar y revisar el contenido.
