import {
  siFacebook,
  siInstagram,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";
import { site, type SocialId } from "@/content/site";

// Brand marks from Simple Icons (CC0), inlined at build time: no requests, no tracking.
const iconPaths: Record<SocialId, string> = {
  instagram: siInstagram.path,
  tiktok: siTiktok.path,
  youtube: siYoutube.path,
  facebook: siFacebook.path,
  x: siX.path,
};

export function SocialGlyph({ id }: { id: SocialId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path d={iconPaths[id]} fill="currentColor" />
    </svg>
  );
}

export function SocialIcons({
  label,
  newTab,
  className = "",
}: {
  label: string;
  newTab: string;
  className?: string;
}) {
  return (
    <ul className={`social-icons ${className}`} aria-label={label}>
      {site.socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            rel="noopener noreferrer"
            target="_blank"
            aria-label={`${social.name} ${newTab}`}
            title={social.name}
          >
            <SocialGlyph id={social.id} />
          </a>
        </li>
      ))}
    </ul>
  );
}
