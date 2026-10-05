import type { SocialProfile } from './types'

/**
 * Redes sociales de Mary.
 *
 * - Añadir una red: copia un bloque y rellena `url` con el perfil oficial (https).
 * - Quitar una red: borra su bloque.
 * - Sin `url`, la tarjeta aparece como pendiente y no es un enlace.
 * Solo las redes con `url` real se publican como `sameAs` en los datos estructurados.
 */
export const socialProfiles: SocialProfile[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    url: undefined, // TODO: 'https://www.instagram.com/usuario/'
    handle: undefined, // TODO: '@usuario'
    description: 'TODO: Qué se encuentra en este perfil.',
    placeholder: true,
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    url: undefined, // TODO: 'https://www.youtube.com/@canal'
    handle: undefined,
    description: 'TODO: Qué se encuentra en este canal.',
    placeholder: true,
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    url: undefined, // TODO: 'https://www.tiktok.com/@usuario'
    handle: undefined,
    description: 'TODO: Qué se encuentra en este perfil.',
    placeholder: true,
  },
]

export function getPublishedProfiles(): (SocialProfile & { url: string })[] {
  return socialProfiles.filter((profile): profile is SocialProfile & { url: string } =>
    Boolean(profile.url),
  )
}
