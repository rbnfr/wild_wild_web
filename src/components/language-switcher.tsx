"use client";

import { usePathname } from "next/navigation";
import { Flag } from "@/components/flag";
import { ChevronDownIcon } from "@/components/icon";
import {
  locales,
  localeDetails,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/i18n/config";
import { translatePath } from "@/i18n/routes";

const OPTIONS_ID = "language-options";

function remember(code: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code);
  } catch {
    // Storage may be blocked; the URL already carries the language.
  }
}

// A button and a native popover: the browser handles opening, Escape, clicks
// outside and focus, with or without JavaScript. Script only remembers the
// chosen language for the next visit to "/".
export function LanguageSwitcher({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();
  return (
    <div className="lang-switcher">
      <button
        type="button"
        className="lang-trigger"
        popoverTarget={OPTIONS_ID}
        aria-controls={OPTIONS_ID}
      >
        <Flag lang={lang} width={24} height={16} className="lang-flag" />
        <span className="visually-hidden">{label}: </span>
        <span className="lang-name">{localeDetails[lang].name}</span>
        <span className="lang-chevron" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </button>
      {/* Right after its button, so browsers add no implicit aria-details. */}
      <ul
        id={OPTIONS_ID}
        className="lang-options"
        aria-label={label}
        popover="auto"
      >
        {locales.map((code) => (
          <li key={code}>
            <a
              href={translatePath(pathname, code)}
              hrefLang={code}
              lang={code}
              aria-current={code === lang ? "true" : undefined}
              onClick={() => remember(code)}
            >
              <Flag lang={code} width={24} height={16} className="lang-flag" />
              {localeDetails[code].name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
