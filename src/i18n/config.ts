// Supported languages. Adding one means adding its dictionary, flag and slugs.
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const hasLocale = (value: unknown): value is Locale =>
  locales.includes(value as Locale);

// Each language is shown by its own name (endonym), whatever the page language.
export const localeDetails: Record<
  Locale,
  { name: string; flag: string; ogLocale: string }
> = {
  es: { name: "Español", flag: "/flags/es.svg", ogLocale: "es_ES" },
  en: { name: "English", flag: "/flags/en.svg", ogLocale: "en_GB" },
};

// Language chosen by hand in the switcher; read again on the next visit to "/".
export const LOCALE_STORAGE_KEY = "lang";
