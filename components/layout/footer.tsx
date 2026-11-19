"use client";

import Link from "next/link";
import { ArrowUpRight, Globe2, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Language, Messages } from "@/lib/translations";
import { CLUB_CONTACT } from "@/lib/data/club";
import { ClubLogo } from "@/components/ui/club-logo";
import { VisitorCounter } from "@/components/ui/visitor-counter";

interface FooterProps {
  messages: Messages;
  currentLanguage?: Language;
  onOpenCookieSettings: () => void;
}

// Stała roku założenia klubu UKS Roszada Radom
const FOUNDING_YEAR = 2006;

// Przyjazne, w pełni zlokalizowane slugi URL dla każdego z 4 języków
const TERMS_URLS: Record<Language, string> = {
  PL: "/regulamin",
  EN: "/terms",
  DE: "/agb",
  HU: "/szabalyzat",
};

const PRIVACY_URLS: Record<Language, string> = {
  PL: "/polityka-prywatnosci",
  EN: "/privacy-policy",
  DE: "/datenschutz",
  HU: "/adatvedelem",
};

/**
 * Uniwersalna funkcja dynamicznie formatująca napisy rocznicowe:
 * 1. Zmienia rok 2026 na aktualny rok kalendarzowy (np. 2027, 2028...).
 * 2. Zmienia frazę "20 lat" / "20 LAT" na aktualną liczbę lat z poprawną gramatycznie
 *    odmianą w języku polskim (21 lat, 22 lata itd.) oraz w EN, DE i HU.
 */
function formatDynamicAnniversaryText(
  text: string,
  currentYear: number,
  years: number,
  lang: Language,
): string {
  if (!text) return "";

  // 1. Samoczynna aktualizacja roku końcowego (np. 2026 -> 2027)
  let result = text.replace(/2026/g, String(currentYear));

  // 2. Obsługa ewentualnego szablonu {years}
  if (result.includes("{years}")) {
    result = result.replace("{years}", String(years));
  }

  // 3. Wyznaczenie poprawnej gramatycznie jednostki czasu w zależności od języka
  let yearsUnitLower = "lat";
  let yearsUnitUpper = "LAT";

  if (lang === "PL") {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      yearsUnitLower = "lat";
      yearsUnitUpper = "LAT";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      yearsUnitLower = "lata";
      yearsUnitUpper = "LATA";
    } else {
      yearsUnitLower = "lat";
      yearsUnitUpper = "LAT";
    }
  } else if (lang === "EN") {
    const unit = years === 1 ? "year" : "years";
    yearsUnitLower = unit;
    yearsUnitUpper = unit.toUpperCase();
  } else if (lang === "DE") {
    yearsUnitLower = "Jahre";
    yearsUnitUpper = "JAHRE";
  } else if (lang === "HU") {
    yearsUnitLower = "év";
    yearsUnitUpper = "ÉV";
  }

  // 4. Zamiana fraz pisanych wielkimi lub małymi literami (np. "20 LAT" lub "20 lat")
  result = result.replace(
    /20\s*(LAT|LATA|YEARS|YEAR|JAHRE|ÉV)\b/g,
    `${years} ${yearsUnitUpper}`,
  );

  result = result.replace(
    /20\s*(lat|lata|years|year|jahre|év)\b/gi,
    (match) => {
      const isUpper = match.toUpperCase() === match;
      return `${years} ${isUpper ? yearsUnitUpper : yearsUnitLower}`;
    },
  );

  return result;
}

export function Footer({
  messages: t,
  currentLanguage,
  onOpenCookieSettings,
}: FooterProps) {
  const activeLang: Language = currentLanguage || "PL";

  // Obliczenie bieżącego roku i stażu klubu (od 2006 r.)
  const currentYear = new Date().getFullYear();
  const clubYears = Math.max(1, currentYear - FOUNDING_YEAR);

  // Dynamiczny podtytuł (np. "RADOM · 21 LAT")
  const dynamicBrandSubtitle = formatDynamicAnniversaryText(
    t.footer.brandSubtitle,
    currentYear,
    clubYears,
    activeLang,
  );

  // Dynamiczny napis praw autorskich (np. "© 2006–2027 UKS Roszada Radom · 21 lat...")
  const copyrightText = formatDynamicAnniversaryText(
    t.footer.copyright,
    currentYear,
    clubYears,
    activeLang,
  );

  return (
    <footer className="border-t border-border/60 bg-muted/20 py-8 transition-colors sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-8">
          {/* Herb i Identyfikacja Klubu oraz Pełny Adres Siedziby (Local SEO / NAP) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-3">
              <ClubLogo
                className="h-10 w-10 sm:h-12 sm:w-12"
                ariaHidden={false}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-foreground">
                    {t.footer.brandTitle}
                  </span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase dark:text-amber-300">
                    {FOUNDING_YEAR}–{currentYear}
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400">
                  {dynamicBrandSubtitle}
                </p>
              </div>
            </div>

            {/* Semantyczny znacznik <address> dla robotów Google i audytu Local SEO */}
            <address className="not-italic flex flex-col gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <MapPin
                  className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span>ul. Tadeusza Mazowieckiego 13A, 26-604 Radom</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone
                  className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span>Tel:</span>
                <a
                  href={`tel:${CLUB_CONTACT.phone}`}
                  className="font-semibold text-foreground hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
                >
                  {CLUB_CONTACT.phoneDisplay || CLUB_CONTACT.phone}
                </a>
              </div>
            </address>
          </div>

          {/* Social Media */}
          <a
            href={CLUB_CONTACT.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent sm:px-4"
          >
            <Globe2
              className="h-4 w-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span>{t.footer.socialHandle}</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Siatka Linków Stopki */}
        <div className="mt-6 border-t border-border/40 pt-5 sm:mt-8 sm:pt-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs font-medium text-muted-foreground sm:gap-x-6 sm:gap-y-3">
            <a href="#top" className="transition-colors hover:text-foreground">
              {t.footer.links.home}
            </a>
            <a
              href="#anniversary"
              className="transition-colors hover:text-foreground"
            >
              {t.footer.links.about}
            </a>
            <a
              href="#venues"
              className="transition-colors hover:text-foreground"
            >
              {t.footer.links.venues}
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-foreground"
            >
              {t.footer.links.contact}
            </a>

            {/* Linki Zewnętrzne Prezesa */}
            <a
              href={CLUB_CONTACT.psychologyBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <span>{t.footer.links.psychologyBlog}</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={CLUB_CONTACT.churchChessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <span>{t.footer.links.churchChess}</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>

            {/* Rejestry Szachowe */}
            <a
              href={CLUB_CONTACT.pzszachUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <span>{t.footer.links.pzszach}</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={CLUB_CONTACT.fideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <span>{t.footer.links.fide}</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>

            {/* Prawne: Przyjazne i w 100% zlokalizowane slugi URL w zależności od języka */}
            <Link
              href={PRIVACY_URLS[activeLang] || "/polityka-prywatnosci"}
              className="transition-colors hover:text-foreground"
            >
              {t.footer.links.privacy}
            </Link>
            <Link
              href={TERMS_URLS[activeLang] || "/regulamin"}
              className="transition-colors hover:text-foreground"
            >
              {t.footer.links.terms}
            </Link>

            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              {t.footer.links.admin}
            </Link>

            {/* Przycisk ponownego wywołania cookies */}
            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
            >
              <ShieldCheck
                className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>{t.footer.links.cookieSettings}</span>
            </button>
          </div>
        </div>

        {/* Dolna linia: Prawa autorskie oraz Autonomiczny Licznik Odwiedzin */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-4.5 text-center text-xs text-muted-foreground sm:mt-6 sm:flex-row sm:pt-5 sm:text-left">
          <p>{copyrightText}</p>
          <VisitorCounter label={t.footer.visitorCounter} />
        </div>
      </div>
    </footer>
  );
}
