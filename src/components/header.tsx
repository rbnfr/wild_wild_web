"use client";

import { useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/content/dictionaries";
import { sectionHash, sectionIds, type SectionKey } from "@/content/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { useDismiss } from "@/hooks/use-dismiss";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

const navSections = [
  "about",
  "services",
  "outreach",
  "collaborations",
] as const satisfies readonly SectionKey[];
const observedIds = Object.values(sectionIds);

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
  const header = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(observedIds);
  useDismiss(header, (reason) => {
    if (!open) return;
    setOpen(false);
    if (reason === "escape") button.current?.focus();
  });
  const close = () => setOpen(false);
  const link = (key: SectionKey) => ({
    href: href(lang, "home", sectionHash(key)),
    "aria-current":
      active === sectionIds[key] ? ("location" as const) : undefined,
    onClick: close,
  });
  return (
    <header className="site-header" ref={header}>
      <div className="container header-inner">
        <a className="wordmark" href={href(lang)}>
          Mary Granero<span>{t.tagline}</span>
        </a>
        <button
          ref={button}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-label">{open ? t.close : t.menu}</span>
          <span aria-hidden="true">{open ? <CloseIcon /> : <MenuIcon />}</span>
        </button>
        <nav
          id="main-navigation"
          aria-label={t.navLabel}
          className={`main-nav ${open ? "is-open" : ""}`}
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
        {/* Without JavaScript the toggle cannot open the menu: show it. */}
        <noscript>
          <style>
            {".menu-toggle{display:none}.main-nav{display:flex;flex-wrap:wrap}"}
          </style>
        </noscript>
      </div>
    </header>
  );
}
