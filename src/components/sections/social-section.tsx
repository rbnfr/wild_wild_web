import { ExternalLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { socialProfiles } from '@/content/social'
import { sections } from '@/content/site'

export function SocialSection() {
  const { id, title, intro } = sections.social
  if (socialProfiles.length === 0) return null

  return (
    <Section id={id} title={title} intro={intro}>
      <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {socialProfiles.map((profile) => (
          <li
            key={profile.platform}
            className={
              profile.url
                ? 'relative border-t-2 border-abeto pt-5'
                : 'border-t-2 border-dashed border-musgo/60 pt-5'
            }
          >
            <h3 className="text-h3 font-bold text-abeto">
              {profile.url ? (
                <ExternalLink
                  href={profile.url}
                  className="decoration-ambar decoration-2 underline-offset-[6px] after:absolute after:inset-0 hover:underline"
                >
                  {profile.label}
                </ExternalLink>
              ) : (
                profile.label
              )}
            </h3>
            {profile.handle ? (
              <p className="mt-1 font-display font-medium text-musgo">{profile.handle}</p>
            ) : null}
            <p className="mt-3 max-w-[34ch] text-musgo">{profile.description}</p>
            {profile.url ? null : (
              <p className="mt-3 font-display text-ui font-semibold text-abeto">
                Perfil pendiente: añade la dirección en src/content/social.ts
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
