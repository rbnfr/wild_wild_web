import { ArrowDownIcon } from "@/components/icon";
import { SocialIcons } from "@/components/social-icons";
import { StaticImage as Image } from "@/components/static-image";
import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds } from "@/content/sections";
import { site } from "@/content/site";

export function Hero({ t }: { t: Dictionary }) {
  return (
    <section
      className="hero-band"
      id={sectionIds.home}
      aria-labelledby="hero-title"
    >
      <div className="hero container">
        <div className="hero-copy">
          <p className="hero-label">
            <span aria-hidden="true" className="leaf-dot" />
            {t.hero.label}
          </p>
          <h1 id="hero-title">{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <a className="button button-light" href={sectionHash("contact")}>
              {t.hero.primary}
            </a>
            <a
              className="button button-outline"
              href={sectionHash("collaborations")}
            >
              {t.hero.secondary}
            </a>
          </div>
          <SocialIcons
            label={t.hero.socialsLabel}
            newTab={t.common.newTab}
            className="hero-socials"
          />
        </div>
        <figure className="hero-figure">
          <div className="hero-image">
            <Image
              src={site.heroImage}
              alt={t.hero.imageAlt}
              fill
              sizes="(max-width: 400px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), 48vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </figure>
        <div className="hero-foot">
          <span>{t.hero.footStart}</span>
          <a href={sectionHash("about")} aria-label={t.hero.scrollLabel}>
            <ArrowDownIcon />
          </a>
          <span>{t.hero.footEnd}</span>
        </div>
      </div>
    </section>
  );
}
