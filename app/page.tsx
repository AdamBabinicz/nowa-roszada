"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type Language,
  getTranslations,
} from "@/lib/translations";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero-section";
import { NewsSection } from "@/components/sections/news-section";
import { SchoolsSection } from "@/components/sections/schools-section";
import { VenuesSection } from "@/components/sections/venues-section";
import { AnniversarySection } from "@/components/sections/anniversary-section";
import { TournamentsSection } from "@/components/sections/tournaments-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { ParentsSection } from "@/components/sections/parents-section";
import { PartnerSection } from "@/components/sections/partner-section";
import { PartnerBanner } from "@/components/sections/partner-banner";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

// Automatyczny tłumacz kotwic URL (#hash) przy zmianie języka (PL / EN / DE / HU)
const HASH_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Aktualności
  aktualnosci: { PL: "aktualnosci", EN: "news", DE: "aktuelles", HU: "hirek" },
  news: { PL: "aktualnosci", EN: "news", DE: "aktuelles", HU: "hirek" },
  aktuelles: { PL: "aktualnosci", EN: "news", DE: "aktuelles", HU: "hirek" },
  hirek: { PL: "aktualnosci", EN: "news", DE: "aktuelles", HU: "hirek" },

  // Szkoły
  szkoly: { PL: "szkoly", EN: "schools", DE: "schulen", HU: "iskolak" },
  schools: { PL: "szkoly", EN: "schools", DE: "schulen", HU: "iskolak" },
  schulen: { PL: "szkoly", EN: "schools", DE: "schulen", HU: "iskolak" },
  iskolak: { PL: "szkoly", EN: "schools", DE: "schulen", HU: "iskolak" },

  // Treningi / Sale
  treningi: { PL: "treningi", EN: "venues", DE: "trainings", HU: "edzesek" },
  venues: { PL: "treningi", EN: "venues", DE: "trainings", HU: "edzesek" },
  trainings: { PL: "treningi", EN: "venues", DE: "trainings", HU: "edzesek" },
  edzesek: { PL: "treningi", EN: "venues", DE: "trainings", HU: "edzesek" },

  // Jubileusz
  anniversary: {
    PL: "anniversary",
    EN: "anniversary",
    DE: "anniversary",
    HU: "anniversary",
  },
  jubileusz: {
    PL: "anniversary",
    EN: "anniversary",
    DE: "anniversary",
    HU: "anniversary",
  },

  // Turnieje
  turnieje: {
    PL: "turnieje",
    EN: "tournaments",
    DE: "turniere",
    HU: "versenyek",
  },
  tournaments: {
    PL: "turnieje",
    EN: "tournaments",
    DE: "turniere",
    HU: "versenyek",
  },
  turniere: {
    PL: "turnieje",
    EN: "tournaments",
    DE: "turniere",
    HU: "versenyek",
  },
  versenyek: {
    PL: "turnieje",
    EN: "tournaments",
    DE: "turniere",
    HU: "versenyek",
  },

  // Galeria
  galeria: { PL: "galeria", EN: "gallery", DE: "galerie", HU: "fotok" },
  gallery: { PL: "galeria", EN: "gallery", DE: "galerie", HU: "fotok" },
  galerie: { PL: "galeria", EN: "gallery", DE: "galerie", HU: "fotok" },
  fotok: { PL: "galeria", EN: "gallery", DE: "galerie", HU: "fotok" },

  // Nasi Przyjaciele
  przyjaciele: {
    PL: "przyjaciele",
    EN: "friends",
    DE: "freunde",
    HU: "baratok",
  },
  friends: {
    PL: "przyjaciele",
    EN: "friends",
    DE: "freunde",
    HU: "baratok",
  },
  freunde: {
    PL: "przyjaciele",
    EN: "friends",
    DE: "freunde",
    HU: "baratok",
  },
  baratok: {
    PL: "przyjaciele",
    EN: "friends",
    DE: "freunde",
    HU: "baratok",
  },

  // Kontakt
  kontakt: { PL: "kontakt", EN: "contact", DE: "kontakt", HU: "kapcsolat" },
  contact: { PL: "kontakt", EN: "contact", DE: "kontakt", HU: "kapcsolat" },
  kapcsolat: { PL: "kontakt", EN: "contact", DE: "kontakt", HU: "kapcsolat" },
};

export default function Page() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);

  // Pobranie bieżącego słownika dla wybranego języka (PL / EN / DE / HU)
  const t = getTranslations(language);

  // Odczyt języka z URL (?lang=en) lub z localStorage oraz obsługa zewnętrznych kotwic
  useEffect(() => {
    let currentLang = DEFAULT_LANGUAGE;

    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang")?.toUpperCase() as Language | null;

      if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
        currentLang = urlLang;
        setLanguage(urlLang);
      } else {
        const savedLang = localStorage.getItem(
          "roszada_lang",
        ) as Language | null;
        if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
          currentLang = savedLang;
          setLanguage(savedLang);
        }
      }

      const consent = localStorage.getItem("roszada_consent");
      if (!consent) {
        setCookieSettingsOpen(true);
      }

      // Bezpieczna obsługa zewnętrznych linków z hashem (np. wejście z #news, gdy strona jest po polsku)
      if (window.location.hash) {
        const rawHash = window.location.hash.replace("#", "").toLowerCase();
        const translation = HASH_TRANSLATIONS[rawHash];
        const targetId = translation ? translation[currentLang] : rawHash;

        setTimeout(() => {
          const targetEl =
            document.getElementById(targetId) ||
            document.getElementById(rawHash);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    } catch {
      // Bezpieczny fallback
    }
  }, []);

  // Automatyczne usuwanie sierotek w DOM — w tym dla asynchronicznych wiadomości z bazy Neon
  useEffect(() => {
    const pattern =
      /(^|[\s\u00A0(„"'\-–—])([a-zA-Z]{1}|[dD][oO]|[nN][aA]|[oO][dD]|[pP][oO]|[wW][eE]|[zZ][eE]|[zZ][aA]|[kK][uU])\s+/g;

    const fixNode = (node: Node) => {
      const parent = node.parentElement;
      if (
        parent &&
        !parent.closest("script, style, code, pre, textarea, input, svg") &&
        node.nodeValue
      ) {
        const updated = node.nodeValue
          .replace(pattern, "$1$2\u00A0")
          .replace(pattern, "$1$2\u00A0");
        if (updated !== node.nodeValue) {
          node.nodeValue = updated;
        }
      }
    };

    const fixAll = (root: Node = document.body) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
      );
      let node: Node | null;
      while ((node = walker.nextNode())) {
        fixNode(node);
      }
    };

    // 1. Sprawdzenie istniejącego drzewa
    fixAll();

    // 2. Dynamiczne wyłapywanie nowych elementów (np. po załadowaniu danych z bazy Neon)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.TEXT_NODE) {
            fixNode(addedNode);
          } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
            fixAll(addedNode);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem("roszada_lang", newLang);
      const url = new URL(window.location.href);

      // 1. Aktualizacja parametru zapytania ?lang
      if (newLang === "PL") {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", newLang.toLowerCase());
      }

      // 2. Automatyczne przetłumaczenie obecnej kotwicy w pasku URL
      if (url.hash) {
        const rawHash = url.hash.replace("#", "").toLowerCase();
        const translation = HASH_TRANSLATIONS[rawHash];
        if (translation && translation[newLang]) {
          url.hash = translation[newLang];
        }
      }

      window.history.replaceState(null, "", url.toString());
    } catch {}
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors selection:bg-emerald-700 selection:text-white">
      <Header
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        messages={t}
      />
      <HeroSection currentLanguage={language} messages={t} />
      <NewsSection currentLanguage={language} messages={t} />
      <SchoolsSection messages={t} />
      <VenuesSection messages={t} />
      <AnniversarySection messages={t} />
      <TournamentsSection messages={t} />
      <GallerySection messages={t} />
      <ParentsSection messages={t} />
      <PartnerSection messages={t} />
      <PartnerBanner messages={t} />
      <ContactSection messages={t} />
      <Footer
        messages={t}
        currentLanguage={language}
        onOpenCookieSettings={() => setCookieSettingsOpen(true)}
      />
      <CookieBanner
        messages={t}
        isOpen={cookieSettingsOpen}
        onClose={() => setCookieSettingsOpen(false)}
      />
      <ScrollToTop ariaLabel={t.scrollTopAria} />
    </main>
  );
}
