import { site } from "@/content/site";
import { localeDetails, locales } from "@/i18n/config";
import { href } from "@/i18n/routes";

// Shown only for the instant before the redirect, or to crawlers and readers
// without JavaScript: a plain choice between the available languages.
export default function LanguageSelect() {
  return (
    <main>
      <h1>{site.name}</h1>
      <ul>
        {locales.map((lang) => (
          <li key={lang}>
            <a href={href(lang)} hrefLang={lang} lang={lang}>
              <img
                src={localeDetails[lang].flag}
                alt=""
                width={36}
                height={24}
              />
              {localeDetails[lang].name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
