---
name: Mary Granero
description: Etología y convivencia — landing personal de una bióloga y etóloga canina y felina
colors:
  forest: "#244c3e"
  forest-deep: "#16392d"
  ink: "#243b30"
  paper: "#faf7ef"
  field-white: "#fffdf8"
  sage: "#e9ede3"
  sand: "#f0e9db"
  muted: "#5b665c"
  line: "#d4d9ca"
  moss: "#688160"
  lichen: "#6c855d"
  ochre: "#987532"
  error: "#9a3026"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(46px, 5.35vw, 82px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(38px, 3.8vw, 56px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  body-lead:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  draft: "3px"
  field: "4px"
  button: "6px"
  pill: "30px"
spacing:
  container: "1220px"
  gutter-desktop: "48px"
  gutter-tablet: "32px"
  gutter-mobile: "20px"
  section-desktop: "100px"
  section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "13px 27px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.forest-deep}"
  button-small:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "10px 22px"
    height: "46px"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest}"
    rounded: "{rounded.button}"
    padding: "13px 27px"
    height: "52px"
  input:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
    height: "49px"
  tag:
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "7px 13px"
---

# Design System: Mary Granero

## Overview

**Creative North Star: "Cuaderno de campo"**

La web es el cuaderno de una etóloga: observación paciente, rigor científico y calidez natural. Papel marfil, tinta verde oscura y una serif editorial que anota con calma. Nada grita; la jerarquía la marcan la tipografía, el aire y las líneas finas, como en una libreta bien ordenada. La fotografía real de Mary es el único gran gesto visual, enmarcada en un arco que recuerda a una ventana abierta al exterior.

La densidad es baja y editorial: columnas asimétricas, secciones generosas (100 px) y separadores de 1 px en lugar de cajas. El color se usa por planos completos (marfil, salvia, arena, bosque) para marcar el ritmo de la página, no para decorar. El movimiento es discreto y siempre opcional: la página está completa sin él.

Se rechaza explícitamente lo infantil, lo veterinario, lo de tienda o protectora, las huellas repetidas y las ilustraciones caricaturescas.

**Key Characteristics:**
- Papel marfil y tinta verde bosque; un solo acento fuerte.
- Serif editorial (Newsreader) para titulares, sans humanista (DM Sans) para todo lo demás.
- Separadores de línea fina en vez de tarjetas con sombra.
- Planos de color a sangre para alternar secciones.
- Retrato en arco como firma visual.
- Movimiento sutil, solo con puntero preciso y siempre desactivable.

## Colors

Paleta natural y apagada: marfil, salvia y arena como superficies, verde bosque como única voz de acento y un ocre reservado al foco.

### Primary
- **Verde bosque** (forest): botones, enlaces destacados, etiquetas de sección y el plano de colaboraciones. Es la voz de la marca.
- **Bosque profundo** (forest-deep): solo estado hover del botón principal.

### Secondary
- **Musgo** (moss) y **Liquen** (lichen): pequeños detalles orgánicos, como la hoja del hero y los puntos de la línea temporal. Nunca para texto ni superficies grandes.

### Tertiary
- **Ocre** (ochre): anillo de foco (`outline` de 3 px) y borde de los avisos legales. Contraste 3,98:1 sobre marfil, suficiente para indicadores no textuales.

### Neutral
- **Papel marfil** (paper): fondo general, cabecera y texto sobre bosque.
- **Blanco de campo** (field-white): fondo de los campos de formulario, un punto más claro que el papel.
- **Salvia** (sage): plano de la sección «Sobre Mary».
- **Arena** (sand): plano de la sección de libros y fondo de avisos legales.
- **Tinta** (ink): texto principal (11,25:1 sobre marfil).
- **Gris liquen** (muted): texto secundario, fechas y notas (5,6:1 sobre marfil; 4,97:1 sobre arena).
- **Línea** (line): separadores de 1 px, bordes de cabecera y pie.
- **Error** (error): mensajes y bordes de campos inválidos.

### Named Rules
**La regla de la tinta única.** El verde bosque es el único color de acento con peso. Los verdes musgo y liquen son detalles puntuales; el ocre solo indica foco.

**La regla de los planos.** Las secciones se distinguen cambiando el color de fondo a sangre (marfil → salvia → marfil → arena → bosque), nunca con tarjetas flotantes.

## Typography

**Display Font:** Newsreader (con Georgia, serif)
**Body Font:** DM Sans (con sans-serif)

Ambas se sirven en local (`src/assets/fonts`, licencia OFL) con `next/font/local` y `display: swap`.

**Character:** Una serif de periódico, con interletraje negativo y peso 400, aporta voz de autora. Una sans geométrica y amable mantiene la lectura ligera y cercana.

### Hierarchy
- **Display** (400, clamp 46–82 px, 1,08, −0,035em): solo el titular del hero, ancho máximo 640 px.
- **Headline** (400, clamp 38–56 px; 40 px en móvil): títulos H2 de sección.
- **Title** (500, 22 px, 1,35): H3 en sans. Excepción: los títulos de bloques editoriales (formación, libro, borrador de correo) usan Newsreader a 28–36 px.
- **Body** (400, 16 px, 1,65): texto general; párrafos destacados a 19 px (`lead`).
- **Label** (500, 14 px): etiquetas de sección en verde bosque, sin mayúsculas forzadas.
- **Nota** (12–13 px, muted): fechas, pies de foto, ayudas de formulario.

### Named Rules
**La regla de la voz editorial.** La serif solo se usa para titulares y para el wordmark; nunca para texto corrido, botones ni formularios.

**La regla sin mayúsculas.** Las etiquetas y botones van en caja normal, sin versalitas ni espaciado ancho: el tono es conversación, no rótulo.

## Layout

- Contenedor centrado de hasta 1220 px con márgenes laterales de 48 px (32 px por debajo de 1100 px, 20 px por debajo de 760 px y 16 px por debajo de 375 px).
- Retículas de dos columnas asimétricas (1,2/0,8, 1/1,2, 0,85/1) con huecos grandes (100–110 px; 55–60 px en tablet) que pasan a una columna por debajo de 760 px.
- Áreas de trabajo en tres columnas separadas por líneas verticales; en móvil se apilan con el icono flotando a la izquierda.
- Ritmo vertical: secciones de 100 px (64 px en móvil); cabecera fija de 104 px (82 px en móvil) con `scroll-padding-top` ajustado.
- Puntos de ruptura: 1700, 1100, 760, 600 y 375 px.

**La regla del aire.** Antes de añadir un elemento, se quita otro. El espacio vacío es parte del cuaderno.

## Elevation & Depth

El sistema es plano por defecto: la profundidad la dan los cambios de plano de color y las líneas de 1 px. Las sombras solo aparecen como respuesta a un estado o para dar cuerpo a un objeto real.

### Shadow Vocabulary
- **Cabecera elevada** (`0 12px 32px -26px rgb(36 59 48 / 0.6)` + desenfoque de fondo de 10 px): aparece con el scroll mediante `animation-timeline`.
- **Botón en hover** (`0 12px 24px -16px rgb(22 57 45 / 0.8)`): solo con puntero preciso.
- **Sombra suave** (`--shadow-soft: 0 18px 40px -24px rgb(36 59 48 / 0.45)`): base de la portada del libro.
- **Foco de campo** (`0 0 0 4px rgb(36 76 62 / 0.12)`): halo verde al enfocar un campo.

### Named Rules
**La regla del objeto real.** Solo la portada del libro recibe tratamiento 3D (rotación, cantos de páginas, brillo), porque es un objeto físico. Ningún otro elemento simula volumen.

## Shapes

- Esquinas apenas suavizadas: 6 px en botones, 4 px en campos y 3 px en botones secundarios del borrador.
- Etiquetas de colaboración en píldora (30 px), solo sobre fondo bosque.
- **Retrato en arco** (`47% 47% 7px 7px`): forma firma del sistema, exclusiva de la fotografía principal.
- Detalle orgánico: la hoja del hero (`10px 0 10px 0`, rotada 30°) y los puntos circulares de la línea temporal.

## Components

### Buttons
- **Shape:** esquinas suavizadas (6 px), altura mínima de 52 px (46 px en la variante pequeña).
- **Primary:** fondo verde bosque y texto marfil, 15 px y peso 500.
- **Hover / Focus:** pasa a bosque profundo, sube 2 px y gana sombra (solo con puntero preciso); al pulsar se reduce al 98 %. El foco usa el anillo ocre global.
- **Light:** invertido (marfil sobre bosque) para el plano de colaboraciones.
- **Text link:** subrayado fino con flecha ↗ que se desplaza en diagonal en hover. Es la acción secundaria por defecto.

### Chips
- **Style:** contorno de 1 px en verde grisáceo, texto marfil de 12 px y forma de píldora. Son informativos, no interactivos.

### Cards / Containers
- No hay tarjetas con fondo ni sombra. Los bloques se separan con líneas finas (`line`) y planos de color.
- **Libro:** portada a la izquierda (240 px) con tratamiento 3D y ficha editorial a la derecha.

### Inputs / Fields
- **Style:** fondo blanco de campo, borde de 1 px, 4 px de radio y altura mínima de 49 px. Etiqueta de 13 px y peso 500 encima del campo.
- **Focus:** el borde pasa a verde bosque con halo de 4 px.
- **Error:** borde de 2 px en color error y mensaje de 13 px debajo.

### Navigation
- Wordmark en Newsreader (30 px) con el lema «Etología y convivencia» en sans a 11 px.
- Enlaces de 14 px con un subrayado que se dibuja en hover; el CTA «Hablemos» es un botón pequeño.
- En móvil, botón de texto «Menú»/«Cerrar», panel desplegable a ancho completo, cierre con Escape y devolución del foco.

### Línea temporal (signature)
- Línea vertical en verde grisáceo con puntos circulares de liquen. En hover el punto crece y la fecha pasa a verde bosque.

### Lista de redes (signature)
- Filas separadas por líneas, nombre y descripción, y una flecha ↗ alineada a la derecha. En hover la fila se desplaza 10 px y la línea se oscurece.

## Do's and Don'ts

### Do:
- **Do** usar marfil como fondo por defecto y verde bosque como único acento con peso.
- **Do** separar contenidos con líneas de 1 px y planos de color, no con tarjetas.
- **Do** reservar Newsreader para titulares y el wordmark.
- **Do** dejar cada elemento completo en su estado final sin animación; el movimiento solo se añade con `prefers-reduced-motion: no-preference`, y el hover solo con `(hover: hover) and (pointer: fine)`.
- **Do** mantener objetivos táctiles de 44–48 px y el anillo de foco ocre de 3 px.
- **Do** dar protagonismo a la fotografía real de Mary.

### Don't:
- **Don't** usar huellas, ilustraciones caricaturescas ni imágenes de banco.
- **Don't** introducir un segundo color de acento ni degradados decorativos.
- **Don't** animar el retrato del hero al cargar: es el elemento LCP.
- **Don't** añadir sombras o efectos 3D a elementos que no sean objetos físicos (la portada del libro).
- **Don't** usar mayúsculas forzadas ni espaciado ancho en etiquetas y botones.
