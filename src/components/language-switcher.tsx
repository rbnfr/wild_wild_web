"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  locales,
  localeDetails,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/i18n/config";
import { translatePath } from "@/i18n/routes";

function Flag({ lang }: { lang: Locale }) {
  return (
    <img
      className="lang-flag"
      src={localeDetails[lang].flag}
      alt=""
      width={24}
      height={16}
    />
  );
}

// <details> keeps the switcher usable without JavaScript; the effect only adds
// closing on Escape and on outside clicks.
export function LanguageSwitcher({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const element = details.current;
    if (!element) return;
    const close = (event: Event) => {
      if (!element.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        element.open = false;
        element.querySelector("summary")?.focus();
      } else if (!element.contains(event.target as Node)) {
        element.open = false;
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("click", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("click", close);
    };
  }, []);
  const remember = (code: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch {
      // Storage may be blocked; the URL already carries the language.
    }
  };
  return (
    <details className="lang-switcher" ref={details}>
      <summary>
        <Flag lang={lang} />
        <span className="visually-hidden">{label}: </span>
        <span className="lang-name">{localeDetails[lang].name}</span>
        <svg
          className="lang-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className="lang-options" aria-label={label}>
        {locales.map((code) => (
          <li key={code}>
            <a
              href={translatePath(pathname, code)}
              hrefLang={code}
              lang={code}
              aria-current={code === lang ? "true" : undefined}
              onClick={() => remember(code)}
            >
              <Flag lang={code} />
              {localeDetails[code].name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
