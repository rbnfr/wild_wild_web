# Fotografías

Las imágenes de la web se guardan en `public/images/`. Mientras no haya fotos reales, la web muestra
marcadores visibles ("Foto pendiente") que indican qué falta.

## Cómo sustituir una foto

1. Copia el archivo en esta carpeta, con un nombre claro y sin espacios: `mary-hero.jpg`.
2. Abre el archivo de contenido indicado en la tabla y descomenta `src`:

   ```ts
   image: {
     src: '/images/mary-hero.jpg',
     alt: 'Mary Granero sentada en el suelo con un perro mestizo apoyado en su regazo.',
     width: 1600,
     height: 2000,
     placeholderLabel: '…',
   }
   ```

3. Escribe un `alt` que describa lo que se ve (quién aparece y qué hace). Si la foto es
   puramente decorativa, usa `alt: ''`.
4. `width` y `height` deben ser las dimensiones reales del archivo. Evitan saltos de diseño.

## Fotos que necesita la web

| Dónde se usa     | Archivo de contenido   | Proporción   | Tamaño mínimo | Qué buscar                                                                |
| ---------------- | ---------------------- | ------------ | ------------- | ------------------------------------------------------------------------- |
| Portada (hero)   | `src/content/site.ts`  | 4:5 vertical | 1600 × 2000   | Retrato editorial de Mary con un perro o un gato. Fondo limpio y natural. |
| Sobre Mary       | `src/content/site.ts`  | 4:5 vertical | 1200 × 1500   | Escena natural de convivencia, gesto y vínculo.                           |
| Portada de libro | `src/content/books.ts` | 2:3 vertical | 800 × 1200    | La portada real, sin recortes ni reflejos.                                |

## Recomendaciones

- Formato JPG o WebP de buena calidad. La web genera automáticamente AVIF/WebP y los
  tamaños responsivos (no hace falta subir varias versiones).
- Pesos razonables: idealmente menos de 1,5 MB por archivo original.
- Sin texto incrustado en la imagen.
- Evita bancos de imágenes artificiales: la web gana con fotografía real y cercana.
- La imagen que se comparte en redes (Open Graph) se genera sola con el nombre de Mary; para
  usar una foto propia, sustituye `src/app/opengraph-image.tsx` y `src/app/twitter-image.tsx` por archivos `opengraph-image.jpg` y `twitter-image.jpg` (1200 × 630) en esa misma carpeta.
