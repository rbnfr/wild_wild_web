"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@/components/icon";
import {
  locales,
  localeDetails,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/i18n/config";
import { useDismiss } from "@/hooks/use-dismiss";
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

// <details> keeps the switcher usable without JavaScript; the hook only adds
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
  useDismiss(details, (reason) => {
    const element = details.current;
    if (!element?.open) return;
    element.open = false;
    if (reason === "escape") element.querySelector("summary")?.focus();
  });
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
        <span className="lang-chevron" aria-hidden="true">
          <ChevronDownIcon />
        </span>
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
