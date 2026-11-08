"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

const sections = [
  ["about", "#sobre-mi"],
  ["services", "#servicios"],
  ["outreach", "#divulgacion"],
  ["collaborations", "#colaboraciones"],
] as const;

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
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href={href(lang)}>
          Mary Granero<span>{t.tagline}</span>
        </a>
        <button
          ref={button}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="menu-label">{open ? t.close : t.menu}</span>
          <span aria-hidden="true">{open ? <CloseIcon /> : <MenuIcon />}</span>
        </button>
        <nav
          id="main-navigation"
          aria-label={t.navLabel}
          className={`main-nav ${open ? "is-open" : ""}`}
        >
          {sections.map(([key, hash]) => (
            <a
              key={key}
              href={href(lang, "home", hash)}
              onClick={() => setOpen(false)}
            >
              {t.nav[key]}
            </a>
          ))}
          <a
            className="button button-small"
            href={href(lang, "home", "#contacto")}
            onClick={() => setOpen(false)}
          >
            {t.cta}
          </a>
        </nav>
        <LanguageSwitcher lang={lang} label={languageLabel} />
      </div>
    </header>
  );
}
