"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CloseIcon, MenuIcon } from "@/components/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds, type SectionKey } from "@/content/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

const navSections = [
  "about",
  "services",
  "outreach",
  "collaborations",
] as const satisfies readonly SectionKey[];
const observedIds = Object.values(sectionIds);
// Keep in step with the 760px breakpoint in styles/header.css.
const WIDE_LAYOUT = "(min-width: 761px)";

// Following a link closes the menu, so the section it leads to is in view.
function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  const menu = event.currentTarget.closest<HTMLElement>("[popover]");
  if (menu?.matches(":popover-open")) menu.hidePopover();
}

/*
 * In narrow headers the navigation is a native popover opened by the menu
 * button: the browser closes it on Escape or on a click outside, returns focus
 * to the button and works without JavaScript. In wide headers CSS shows the
 * same list inline. Script only mirrors the open state in the button label,
 * closes the menu after a link is followed and when the layout widens.
 */
export function Header({
  lang,
  t,
  languageLabel,
}: {
  lang: Locale;
  t: Dictionary["header"];
  languageLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const active = useActiveSection(observedIds);

  useEffect(() => {
    const media = window.matchMedia(WIDE_LAYOUT);
    const close = () => {
      if (media.matches && nav.current?.matches(":popover-open"))
        nav.current.hidePopover();
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  const link = (key: SectionKey) => ({
    href: href(lang, "home", sectionHash(key)),
    "aria-current":
      active === sectionIds[key] ? ("location" as const) : undefined,
    onClick: closeMenu,
  });
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href={href(lang)}>
          Mary Granero<span>{t.tagline}</span>
        </a>
        <button
          type="button"
          className="menu-toggle"
          popoverTarget="main-navigation"
          aria-controls="main-navigation"
        >
          <span className="menu-label">{open ? t.close : t.menu}</span>
          <span aria-hidden="true">{open ? <CloseIcon /> : <MenuIcon />}</span>
        </button>
        {/* Right after its button, so browsers add no implicit aria-details. */}
        <nav
          ref={nav}
          id="main-navigation"
          aria-label={t.navLabel}
          className="main-nav"
          popover="auto"
          onToggle={(event) => setOpen(event.newState === "open")}
        >
          {navSections.map((key) => (
            <a key={key} {...link(key)}>
              {t.nav[key]}
            </a>
          ))}
          <a className="button button-small" {...link("contact")}>
            {t.cta}
          </a>
        </nav>
        <LanguageSwitcher lang={lang} label={languageLabel} />
      </div>
    </header>
  );
}
