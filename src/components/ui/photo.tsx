import Image from 'next/image'

import type { ImageSlot } from '@/content/types'
import { cn } from '@/lib/cn'

type PhotoProps = {
  image: ImageSlot
  /** Atributo `sizes` real del diseño, para que el navegador pida el tamaño justo. */
  sizes: string
  /** Solo para la imagen principal visible al cargar (mejora el LCP). */
  preload?: boolean
  className?: string
}

/**
 * Fotografía con proporción fija (sin saltos de layout). Mientras no haya `src`,
 * muestra un marcador visible que indica qué foto falta y con qué proporción.
 */
export function Photo({ image, sizes, preload = false, className }: PhotoProps) {
  const aspectRatio = `${image.width} / ${image.height}`

  if (image.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        preload={preload}
        style={{ aspectRatio }}
        className={cn('h-auto w-full bg-arena object-cover', className)}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={image.placeholderLabel}
      style={{ aspectRatio }}
      className={cn('relative w-full bg-arena p-3', className)}
    >
      <div
        aria-hidden="true"
        className="flex h-full flex-col justify-end border border-dashed border-musgo/60 p-4"
      >
        <p className="font-display text-ui leading-snug font-semibold text-abeto">Foto pendiente</p>
        <p className="mt-1 max-w-[32ch] font-display text-sm leading-snug text-musgo">
          {image.placeholderLabel}
        </p>
      </div>
    </div>
  )
}
