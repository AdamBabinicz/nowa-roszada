"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Camera,
  MapPin,
  Newspaper,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import type { Language } from "@/lib/translations";
import type { NewsRow } from "@/app/api/news/route";

// Data automatycznego wygaśnięcia okna jubileuszowego (po tym terminie przestanie się pojawiać)
const SPOTLIGHT_EXPIRES_AT = new Date("2026-12-31T23:59:59");
const STORAGE_KEY = "roszada_jubilee_spotlight_v1";
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 dni przerwy po zamknięciu

interface JubileeSpotlightModalProps {
  currentLanguage: Language;
  cookieBannerOpen: boolean;
}

const GALLERY_ANCHORS: Record<Language, string> = {
  PL: "galeria",
  EN: "gallery",
  DE: "galerie",
  HU: "fotok",
};

const NEWS_ANCHORS: Record<Language, string> = {
  PL: "aktualnosci",
  EN: "news",
  DE: "aktuelles",
  HU: "hirek",
};

const COPY: Record<
  Language,
  {
    badge: string;
    datePlace: string;
    fallbackTitle: string;
    fallbackExcerpt: string;
    groupALabel: string;
    groupBLabel: string;
    groupAPodium: string;
    groupBPodium: string;
    galleryBtn: string;
    newsBtn: string;
    closeAria: string;
    footerHint: string;
  }
> = {
  PL: {
    badge: "XX-lecie UKS Roszada Radom • 2006–2026",
    datePlace: "14–15 listopada 2026 • Hoppen House, Radom",
    fallbackTitle:
      "Jubileuszowy Turniej Szachowy na XX-lecie UKS Roszada za nami!",
    fallbackExcerpt:
      "41 zawodników rywalizowało w dwóch grupach turniejowych z okazji 20-lecia naszego klubu. Zobacz wyniki, podium oraz fotorelację z wręczenia pucharów.",
    groupALabel: "Grupa A (kat. IV+)",
    groupBLabel: "Grupa B (kat. V i b/k)",
    groupAPodium: "I Jakub Herka • II Leszek Jagłowski • III Kamil Młynarski",
    groupBPodium: "I Dominik Kącki • II Tymon Wolski • III Kacper Głąbicki",
    galleryBtn: "Zobacz fotorelację (5 zdjęć)",
    newsBtn: "Wyniki i relacja",
    closeAria: "Zamknij okno jubileuszowe",
    footerHint:
      "Komunikat jubileuszowy • nie pojawi się ponownie po zamknięciu",
  },
  EN: {
    badge: "20th Anniversary of UKS Roszada Radom • 2006–2026",
    datePlace: "November 14–15, 2026 • Hoppen House, Radom",
    fallbackTitle: "20th Anniversary Jubilee Chess Tournament of UKS Roszada!",
    fallbackExcerpt:
      "41 players competed across two tournament groups celebrating 20 years of our club. Check out the full results and photo report from the awards ceremony.",
    groupALabel: "Group A (Cat. IV+)",
    groupBLabel: "Group B (Cat. V & unrated)",
    groupAPodium:
      "1st Jakub Herka • 2nd Leszek Jagłowski • 3rd Kamil Młynarski",
    groupBPodium: "1st Dominik Kącki • 2nd Tymon Wolski • 3rd Kacper Głąbicki",
    galleryBtn: "View photo report (5 photos)",
    newsBtn: "Results & report",
    closeAria: "Close anniversary popup",
    footerHint: "Anniversary highlight • hidden for 14 days once dismissed",
  },
  DE: {
    badge: "20 Jahre UKS Roszada Radom • 2006–2026",
    datePlace: "14.–15. November 2026 • Hoppen House, Radom",
    fallbackTitle:
      "Jubiläums-Schachturnier zum 20-jährigen Bestehen von UKS Roszada!",
    fallbackExcerpt:
      "41 Spieler traten in zwei Turniergruppen zum 20-jährigen Vereinsjubiläum an. Entdecken Sie die Ergebnisse und den Fotobericht der Siegerehrung.",
    groupALabel: "Gruppe A (Kat. IV+)",
    groupBLabel: "Gruppe B (Kat. V & ohne Kat.)",
    groupAPodium: "1. Jakub Herka • 2. Leszek Jagłowski • 3. Kamil Młynarski",
    groupBPodium: "1. Dominik Kącki • 2. Tymon Wolski • 3. Kacper Głąbicki",
    galleryBtn: "Fotobericht ansehen (5 Fotos)",
    newsBtn: "Ergebnisse & Bericht",
    closeAria: "Jubiläumsfenster schließen",
    footerHint: "Jubiläumshinweis • erscheint nach dem Schließen 14 Tage nicht",
  },
  HU: {
    badge: "20 éves az UKS Roszada Radom • 2006–2026",
    datePlace: "2026. november 14–15. • Hoppen House, Radom",
    fallbackTitle:
      "Az UKS Roszada 20. jubileumi sakkversenye — eredmények és fotók!",
    fallbackExcerpt:
      "41 sakkozó versenyzett két csoportban klubunk 20. évfordulója alkalmából. Tekintse meg a végeredményt és az ünnepélyes díjátadó képeit.",
    groupALabel: "A csoport (IV+ kat.)",
    groupBLabel: "B csoport (V. kat. és kat. nélkül)",
    groupAPodium:
      "I. Jakub Herka • II. Leszek Jagłowski • III. Kamil Młynarski",
    groupBPodium: "I. Dominik Kącki • II. Tymon Wolski • III. Kacper Głąbicki",
    galleryBtn: "Fotóriport megtekintése (5 kép)",
    newsBtn: "Eredmények és beszámoló",
    closeAria: "Jubileumi ablak bezárása",
    footerHint: "Jubileumi kiemelés • bezárás után 14 napig nem jelenik meg",
  },
};

export function JubileeSpotlightModal({
  currentLanguage,
  cookieBannerOpen,
}: JubileeSpotlightModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pinnedNews, setPinnedNews] = useState<NewsRow | null>(null);

  const langKey = currentLanguage.toLowerCase() as "pl" | "en" | "de" | "hu";
  const c = COPY[currentLanguage] || COPY.PL;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pobranie przypiętego wpisu z Neon w tle (żeby tytuł/zajawka/zdjęcie były zawsze aktualne)
  useEffect(() => {
    let active = true;
    fetch("/api/news", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active || !json?.success || !Array.isArray(json.data)) return;
        const rows = json.data as NewsRow[];
        const target =
          rows.find(
            (r) => r.slug === "jubileuszowy-turniej-xx-lecia-uks-roszada-2026",
          ) ?? rows.find((r) => r.is_pinned);
        if (target) {
          setPinnedNews(target);
        }
      })
      .catch(() => {
        // Cichy fallback do COPY
      });
    return () => {
      active = false;
    };
  }, []);

  // Warunkowe otwarcie okna (po zamknięciu cookies, przed datą wygaśnięcia i z cooldownem 14 dni)
  useEffect(() => {
    if (!mounted || cookieBannerOpen) return;

    if (Date.now() > SPOTLIGHT_EXPIRES_AT.getTime()) return;

    try {
      // Jeśli użytkownik wszedł bezpośrednio na konkretną sekcję (#galeria, #aktualnosci), nie przerywamy
      if (window.location.hash) return;

      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - Number(dismissedAt);
        if (Number.isFinite(elapsed) && elapsed < COOLDOWN_MS) {
          return;
        }
      }
    } catch {
      // Ignoruj brak dostępu do localStorage
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [mounted, cookieBannerOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Bezpieczny fallback
    }
  }, []);

  const handleNavigate = useCallback(
    (section: "gallery" | "news") => {
      handleClose();
      const targetId =
        section === "gallery"
          ? GALLERY_ANCHORS[currentLanguage]
          : NEWS_ANCHORS[currentLanguage];

      window.setTimeout(() => {
        const el =
          document.getElementById(targetId) || document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 90);
    },
    [currentLanguage, handleClose],
  );

  // Obsługa klawisza Escape i blokada przewijania tła
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!mounted || !isOpen) return null;

  const dynamicTitle = pinnedNews
    ? String(
        pinnedNews[`title_${langKey}` as keyof NewsRow] ||
          pinnedNews.title_pl ||
          c.fallbackTitle,
      )
    : c.fallbackTitle;

  const dynamicExcerpt = pinnedNews
    ? String(
        pinnedNews[`excerpt_${langKey}` as keyof NewsRow] ||
          pinnedNews.excerpt_pl ||
          c.fallbackExcerpt,
      )
    : c.fallbackExcerpt;

  const coverImage =
    Array.isArray(pinnedNews?.images) && pinnedNews.images[0]?.url
      ? pinnedNews.images[0].url
      : "/gallery/17.avif";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jubilee-spotlight-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-5 dark:bg-black/80"
      onClick={handleClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Przycisk zamknięcia */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={c.closeAria}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Zdjęcie z uroczystości wręczenia pucharów */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-900 sm:aspect-[16/9]">
          <Image
            src={coverImage}
            alt={dynamicTitle}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 680px"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-3 right-12 flex flex-wrap items-center gap-2 sm:bottom-4 sm:left-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/90 px-3 py-1 text-[11px] font-extrabold tracking-wide text-zinc-950 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{c.badge}</span>
            </span>
          </div>
        </div>

        {/* Treść komunikatu */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{c.datePlace}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300">
              <MapPin className="h-3.5 w-3.5" />
              <span>Radom</span>
            </span>
          </div>

          <h2
            id="jubilee-spotlight-title"
            className="mt-2 text-lg font-extrabold leading-snug tracking-tight text-foreground sm:text-xl"
          >
            {dynamicTitle}
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {dynamicExcerpt}
          </p>

          {/* Zwięzłe podsumowanie podium obu grup */}
          <div className="mt-3.5 grid gap-2 rounded-2xl border border-border/70 bg-muted/40 p-3 text-xs sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 font-bold text-foreground">
                <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>{c.groupALabel}</span>
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {c.groupAPodium}
              </p>
            </div>
            <div className="border-t border-border/50 pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
              <p className="flex items-center gap-1.5 font-bold text-foreground">
                <Trophy className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{c.groupBLabel}</span>
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {c.groupBPodium}
              </p>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => handleNavigate("gallery")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 sm:text-sm dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Camera className="h-4 w-4" />
              <span>{c.galleryBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("news")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent sm:text-sm"
            >
              <Newspaper className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>{c.newsBtn}</span>
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            {c.footerHint}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
