import { SocialIcons } from "@/components/social-icons";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/i18n/config";
import { href, legalPageIds } from "@/i18n/routes";

export function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <SocialIcons
          label={t.footer.socialsLabel}
          newTab={t.common.newTab}
          className="footer-socials"
        />
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Mary Granero</small>
          <nav aria-label={t.footer.legalLabel}>
            {legalPageIds.map((page) => (
              <a key={page} href={href(lang, page)}>
                {t.footer.links[page]}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
