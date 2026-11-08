import type { Locale } from "@/i18n/config";
import { es } from "./es";
import { en } from "./en";

export type Dictionary = typeof es;

// Server-only by use: pages pass client components just the texts they need.
const dictionaries: Record<Locale, Dictionary> = { es, en };
export const getDictionary = (lang: Locale): Dictionary => dictionaries[lang];
