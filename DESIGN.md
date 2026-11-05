---
name: Mary Granero
description: Etología y convivencia — landing personal de una bióloga y etóloga canina y felina
colors:
  brand: "#1559b5"
  brand-deep: "#0c3a7a"
  brand-light: "#1a64c6"
  sky: "#8fc2ff"
  bg: "#ffffff"
  tint: "#ebf3fd"
  tint-strong: "#d7e7f9"
  selection: "#cfe1fb"
  line: "#cfdeef"
  ink: "#0f2744"
  muted: "#4a5e78"
  on-brand: "#ffffff"
  on-brand-muted: "#e6effc"
  field-border: "#7c93b3"
  error: "#b3261e"
typography:
  display:
    fontFamily: "Figtree, sans-serif"
    fontSize: "clamp(44px, 4.9vw, 72px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Figtree, sans-serif"
    fontSize: "clamp(34px, 3.4vw, 50px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  body-large:
    fontFamily: "Figtree, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.5
  small:
    fontFamily: "Figtree, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Figtree, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  field: "12px"
  card: "20px"
  portrait: "32px"
  pill: "999px"
spacing:
  container: "1220px"
  gutter-desktop: "48px"
  gutter-tablet: "32px"
  gutter-mobile: "20px"
  section-desktop: "100px"
  section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    padding: "13px 27px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
  button-outline:
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    padding: "13px 27px"
    height: "52px"
  button-light:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.brand-deep}"
    rounded: "{rounded.pill}"
    padding: "13px 27px"
    height: "52px"
  service-card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "34px 32px 26px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
    height: "49px"
  tag:
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
---

# Design System: Mary Granero

## Overview

**Creative North Star: "Ciencia a cielo abierto"**

La web transmite la claridad de la ciencia explicada con cercanía: mucho blanco, un azul real que da confianza y titulares en una sans redondeada y firme. El azul no decora, ocupa regiones enteras: la portada y la banda de colaboraciones son planos de azul a sangre con un degradado diagonal suave, y el resto respira sobre blanco y azul muy claro.

La densidad es moderada. Las secciones alternan blanco, azul claro y azul intenso para marcar el ritmo, y los servicios se presentan en tarjetas blancas que flotan sobre el azul claro. La fotografía real de Mary, con esquinas redondeadas y una sombra profunda, es el ancla de la portada. El movimiento es discreto, siempre opcional, y la página está completa sin él.

Se rechaza lo infantil, lo veterinario, lo de tienda o protectora, las huellas repetidas y las ilustraciones caricaturescas.

**Key Characteristics:**
- Blanco y azul real; el azul ocupa planos completos, no detalles sueltos.
- Una sola familia tipográfica (Figtree, variable) para todo.
- Botones en píldora y esquinas generosas.
- Tarjetas solo donde la referencia las pide: los servicios.
- Iconos de línea con un mismo trazo (flechas, menú, correo) y marcas oficiales de redes.
- Movimiento sutil, solo con puntero preciso y siempre desactivable.

## Colors

Un único tono, el azul, en una escala que va del marino al cielo, sobre blanco.

### Primary
- **Azul real** (brand): botones, enlaces destacados, viñetas, iconos y subtítulos de bloque.
- **Azul marino** (brand-deep): titulares, hover de botones, anillo de foco sobre fondo claro e inicio del degradado.
- **Azul claro** (brand-light): final del degradado de las bandas.

### Secondary
- **Cielo** (sky): solo la hoja del lema del inicio.

### Neutral
- **Blanco** (bg): fondo principal y tarjetas.
- **Azul niebla** (tint): plano de servicios y halo de iconos en hover.
- **Azul pálido** (tint-strong): pie de página.
- **Selección** (selection): fondo del texto seleccionado.
- **Línea** (line): separadores de 1 px.
- **Tinta** (ink): texto principal.
- **Pizarra** (muted): texto secundario y notas.
- **Sobre azul** (on-brand y on-brand-muted): texto principal y secundario dentro de las bandas azules.
- **Borde de campo** (field-border): contorno de los campos de formulario (3,14:1 sobre blanco).
- **Error** (error): mensajes y bordes de error.

### Named Rules
**La regla del azul a sangre.** El azul se usa por regiones completas (portada, colaboraciones) o como acento funcional; nunca como degradado decorativo dentro de tarjetas ni en el texto.

**La regla del contraste dentro de la banda.** Los colores claros sobre azul solo se aplican dentro de `.hero-band` y `.collaborations-section`, con un fondo sólido de respaldo, para que el texto nunca quede claro sobre blanco.

## Typography

**Display Font:** Figtree (con sans-serif)
**Body Font:** Figtree (con sans-serif)

Una sola fuente variable (pesos 300–900) servida en local con `next/font/local`, licencia OFL.

**Character:** Geométrica, redondeada y amable; en negrita aporta firmeza sin dureza, en regular se lee ligera.

### Hierarchy
- **Display** (700, clamp 44–72 px, 1,08, −0,03em): solo el titular del inicio.
- **Headline** (700, clamp 34–50 px): títulos H2 de sección, en azul marino.
- **Title** (650, 22 px): títulos de tarjeta y bloques; el título del libro sube a 34 px.
- **Body** (400, 16 px, 1,65): texto general; 18 px en la entradilla del inicio.
- **Label** (650, 14 px): subtítulos de bloque (Libro, Redes, Prensa) en azul real.
- **Small / Caption** (13 y 12 px): notas, ayudas de formulario y pie. Nunca por debajo de 12 px.

### Named Rules
**La regla sin antetítulos.** Los titulares de sección van solos, sin etiqueta pequeña encima. La única excepción es el lema del inicio, que es contenido confirmado por la autora.

## Layout

- Contenedor centrado de hasta 1220 px con márgenes de 48 px (32 px por debajo de 1100 px, 20 px por debajo de 760 px y 16 px por debajo de 375 px).
- Retículas de dos columnas asimétricas que pasan a una por debajo de 760 px. Servicios en tres tarjetas iguales.
- Ritmo vertical: secciones de 100 px (64 px en móvil); cabecera fija de 104 px (82 px en móvil).
- Medida de lectura: textos largos (legales) con un máximo de 70ch.
- Puntos de ruptura: 1700, 1100, 760, 600 y 375 px.

## Elevation & Depth

Plano por defecto con tres excepciones con sentido: la tarjeta (servicios), el objeto real (la portada del libro en 3D) y el retrato del inicio. El resto se separa con planos de color y líneas finas.

### Shadow Vocabulary
- **Tarjeta** (`0 24px 48px -36px rgb(12 39 80 / 0.45)`): tarjetas de servicio.
- **Retrato** (`0 40px 70px -40px rgb(4 20 48 / 0.7)`): fotografía del inicio sobre la banda azul.
- **Cabecera elevada** (`0 12px 32px -26px rgb(12 39 80 / 0.5)` + desenfoque de 10 px): aparece con el scroll.
- **Botón en hover** (`0 12px 24px -16px rgb(12 58 122 / 0.6)`): solo con puntero preciso.
- **Foco de campo** (`0 0 0 4px rgb(21 89 181 / 0.16)`): halo azul al enfocar un campo.

## Shapes

- Píldora (999 px) en botones, etiquetas y halos de iconos.
- Esquinas de 20 px en tarjetas, 12 px en campos y avisos, y 32 px en el retrato.
- La portada del libro conserva cantos casi rectos (2–5 px) porque es un objeto físico.

## Components

### Buttons
- **Primary:** azul real con texto blanco, píldora y 52 px de alto; en hover pasa a azul marino, sube 2 px y gana sombra.
- **Outline (sobre azul):** contorno blanco de 2 px y texto blanco; en hover se rellena de blanco con texto marino.
- **Light (sobre azul):** blanco con texto marino.
- **Text link:** subrayado fino con flecha de línea que se desplaza en diagonal en hover.

### Chips
- Etiquetas de colaboración: contorno blanco translúcido, texto blanco de 12 px y forma de píldora. Informativas, no interactivas.

### Cards / Containers
- **Servicios:** fondo blanco, 20 px de radio, sombra de tarjeta y enlace inferior en azul con línea superior.
- No se anidan tarjetas ni se usan para el resto de secciones.

### Inputs / Fields
- Fondo blanco, borde de 1 px (field-border), 12 px de radio y 49 px de alto; foco con borde azul y halo.

### Navigation
- Wordmark en Figtree 750 y azul marino, con el lema «Etología y convivencia».
- Enlaces de 14 px con subrayado que se dibuja en hover y CTA «Hablemos» en píldora.
- En móvil, botón «Menú»/«Cerrar» con iconos de línea, panel desplegable y cierre con Escape.

### Lista de enlaces externos (signature)
- Filas separadas por líneas con nombre, descripción y flecha de línea; las redes llevan su marca oficial a la izquierda. En hover la fila se desplaza y la línea se oscurece.

### Iconos de redes (signature)
- Marcas oficiales (Simple Icons, CC0) en círculos de 48 px: blancas en el inicio y marinas en el pie; en hover, halo y leve subida.

## Do's and Don'ts

### Do:
- **Do** dedicar regiones completas al azul (inicio, colaboraciones) y dejar respirar el resto en blanco y azul claro.
- **Do** usar Figtree en todos los textos, con titulares en 700 y azul marino.
- **Do** mantener los iconos en una sola familia de línea (trazo 1,75) más las marcas oficiales de redes.
- **Do** dejar cada elemento completo sin animación y limitar el hover a `(hover: hover) and (pointer: fine)`.
- **Do** mantener objetivos táctiles de 44–48 px, texto de 12 px como mínimo y contraste AA.

### Don't:
- **Don't** poner antetítulos sobre los titulares de sección.
- **Don't** usar caracteres Unicode ni emojis como iconos.
- **Don't** introducir un segundo color de acento ni degradados dentro de tarjetas o en el texto.
- **Don't** animar el retrato del inicio al cargar: es el elemento LCP.
- **Don't** usar huellas, ilustraciones caricaturescas ni imágenes de banco.
