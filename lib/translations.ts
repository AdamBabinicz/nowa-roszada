import { pl } from "./messages/pl";
import { en } from "./messages/en";
import { de } from "./messages/de";
import { hu } from "./messages/hu";

export type Language = "PL" | "EN" | "DE" | "HU";
export type Messages = typeof pl;

export const DEFAULT_LANGUAGE: Language = "PL";

export const SUPPORTED_LANGUAGES: readonly Language[] = [
  "PL",
  "EN",
  "DE",
  "HU",
] as const;

export const LANGUAGE_LABELS: Record<
  Language,
  { label: string; flag: string }
> = {
  PL: { label: "Polski", flag: "🇵🇱" },
  EN: { label: "English", flag: "🇬🇧" },
  DE: { label: "Deutsch", flag: "🇩🇪" },
  HU: { label: "Magyar", flag: "🇭🇺" },
};

/**
 * Sprawdza, czy podany ciąg znaków jest wspieranym kodem języka
 */
export const isSupportedLanguage = (lang: string): lang is Language => {
  return SUPPORTED_LANGUAGES.includes(lang.toUpperCase() as Language);
};

/**
 * Zamienia zwykłe spacje po wiszących spójnikach na twarde spacje niełamliwe (\u00A0)
 */
function fixOrphansInString(text: string): string {
  if (!text || typeof text !== "string") return text;

  // Bezpieczeństwo: nie ruszamy linków, ścieżek do grafik ani adresów e-mail
  if (
    text.startsWith("/") ||
    text.startsWith("http") ||
    text.includes(".avif") ||
    text.includes(".webp") ||
    text.includes(".jpg") ||
    text.includes(".jpeg") ||
    text.includes(".png") ||
    text.includes(".jfif") ||
    text.includes(".svg") ||
    text.includes("@")
  ) {
    return text;
  }

  // Wyszukuje spójniki 1-literowe (a, i, o, u, w, z) oraz najczęstsze przyimki 2-literowe (do, na, od, po, we, ze, za, ku)
  const pattern =
    /(^|[\s\u00A0(„"'\-–—])([a-zA-Z]{1}|[dD][oO]|[nN][aA]|[oO][dD]|[pP][oO]|[wW][eE]|[zZ][eE]|[zZ][aA]|[kK][uU])\s+/g;

  // Podwójne wywołanie zabezpiecza zbitki spójników obok siebie (np. "i w", "a do")
  return text.replace(pattern, "$1$2\u00A0").replace(pattern, "$1$2\u00A0");
}

/**
 * Rekurencyjnie przechodzi po całym obiekcie słownika i eliminuje sierotki
 */
function applyOrphanFix<T>(value: T): T {
  if (typeof value === "string") {
    return fixOrphansInString(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => applyOrphanFix(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = applyOrphanFix(val);
    }
    return result as T;
  }
  return value;
}

export const translations: Record<Language, Messages> = {
  PL: applyOrphanFix(pl),
  EN: applyOrphanFix(en),
  DE: applyOrphanFix(de),
  HU: applyOrphanFix(hu),
};

/**
 * Pomocnik do bezpiecznego pobierania tłumaczeń z domyślnym fallbackiem do PL.
 * Obsługuje wielkość liter (zarówno "PL", jak i "pl").
 */
export const getTranslations = (lang: string | Language): Messages => {
  if (!lang) return translations[DEFAULT_LANGUAGE];
  const normalized = lang.toUpperCase() as Language;
  return translations[normalized] ?? translations[DEFAULT_LANGUAGE];
};
