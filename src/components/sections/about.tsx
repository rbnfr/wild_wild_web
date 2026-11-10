import { ArrowDownIcon } from "@/components/icon";
import { PhotoStack } from "@/components/photo-stack";
import { RichText } from "@/components/rich-text";
import { StaticImage as Image } from "@/components/static-image";
import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds } from "@/content/sections";
import { site } from "@/content/site";

export function About({ t }: { t: Dictionary }) {
  const { photos } = t.about;
  return (
    <section
      className="section about-section"
      id={sectionIds.about}
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <div className="about-intro">
          <h2 id="about-title">{t.about.title}</h2>
          <PhotoStack
            labels={{
              label: photos.label,
              previous: photos.previous,
              next: photos.next,
              pause: photos.pause,
              play: photos.play,
              position: photos.position,
            }}
            intervalMs={site.aboutPhotosInterval}
          >
            {site.aboutPhotos.map((photo) => (
              <Image
                key={photo.id}
                src={photo.src}
                alt={photos.alt[photo.id]}
                fill
                sizes="(max-width: 760px) min(calc(100vw - 60px), 400px), 380px"
                loading="lazy"
                draggable={false}
              />
            ))}
          </PhotoStack>
        </div>
        <div className="about-copy">
          {t.about.paragraphs.map((text) => (
            <p key={text}>
              <RichText text={text} />
            </p>
          ))}
          <a className="text-link" href={sectionHash("services")}>
            {t.about.cta}
            <span aria-hidden="true">
              <ArrowDownIcon size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
