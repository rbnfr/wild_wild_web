import { ArrowUpRightIcon } from "@/components/icon";
import { SocialGlyph } from "@/components/social-icons";
import type { SocialId } from "@/content/site";

export type ExternalLink = {
  heading: string;
  text: string;
  url: string;
  icon?: SocialId;
};

// Shared list of external links (social profiles and press).
export function ExternalLinks({
  links,
  newTab,
}: {
  links: ExternalLink[];
  newTab: string;
}) {
  return (
    <ul className="link-list">
      {links.map((link) => (
        <li key={link.url}>
          <a
            className={`social-link ${link.icon ? "has-icon" : ""}`}
            href={link.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.icon && <SocialGlyph id={link.icon} />}
            <strong>{link.heading}</strong>
            <span>
              {link.text}
              <span className="visually-hidden"> {newTab}</span>
            </span>
            <span aria-hidden="true" className="social-arrow">
              <ArrowUpRightIcon />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
