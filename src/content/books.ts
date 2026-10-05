import type { Book } from './types'

/**
 * Libros y publicaciones.
 *
 * Para añadir uno, copia un bloque, cambia el `id` y completa solo datos reales.
 * Las entradas con `placeholder: true` no generan datos estructurados (schema.org Book).
 * Elimina la entrada de muestra cuando haya libros reales; si el array queda vacío,
 * la sección se oculta sola.
 */
export const books: Book[] = [
  {
    id: 'muestra-libro',
    title: 'TODO: Título del libro',
    subtitle: 'TODO: Subtítulo',
    year: undefined,
    publisher: 'TODO: Editorial',
    description: 'TODO: Descripción breve del libro (dos o tres frases).',
    isbn: undefined, // TODO: ISBN real, por ejemplo '978-84-0000-000-0'
    cover: {
      // src: '/images/libro-titulo.jpg',
      alt: 'TODO: Portada del libro "Título".',
      width: 800,
      height: 1200,
      placeholderLabel: 'Portada pendiente. Vertical 2:3, mínimo 800 × 1200 px.',
    },
    // Ejemplo: [{ label: 'Comprar en la editorial', href: 'https://…' }]
    purchaseLinks: [],
    placeholder: true,
  },
]
