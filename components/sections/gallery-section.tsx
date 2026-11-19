"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Copyright,
  Image as ImageIcon,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Messages } from "@/lib/translations";
import type { GalleryPhoto, GalleryRow } from "@/app/api/gallery/route";
import { CLUB_CONTACT } from "@/lib/data/club";

interface GallerySectionProps {
  messages: Messages;
}

interface GallerySlide {
  url: string;
  caption: string;
}

type GalleryItem = Messages["gallery"]["items"][number] & {
  author?: string;
  license?: string;
  slides?: GallerySlide[];
};

type LangCode = "pl" | "en" | "de" | "hu";

function pickLocalized(
  row: GalleryRow,
  field: "title" | "count" | "caption" | "author" | "license",
  lang: LangCode,
): string {
  const localized = row[`${field}_${lang}` as keyof GalleryRow];
  if (typeof localized === "string" && localized.trim() !== "") {
    return localized;
  }
  const fallback = row[`${field}_pl` as keyof GalleryRow];
  return typeof fallback === "string" ? fallback : "";
}

function pickSlideCaption(
  photo: GalleryPhoto,
  lang: LangCode,
  fallbackCaption: string,
): string {
  const localized = photo[`caption_${lang}` as keyof GalleryPhoto];
  if (typeof localized === "string" && localized.trim() !== "") {
    return localized;
  }
  if (typeof photo.caption_pl === "string" && photo.caption_pl.trim() !== "") {
    return photo.caption_pl;
  }
  return fallbackCaption;
}

function getSliderLabels(lang: LangCode) {
  if (lang === "de") {
    return {
      photosBadge: "Fotos",
      prevPhoto: "Vorheriges Foto",
      nextPhoto: "Nächstes Foto",
      detailsBtn: "Ergebnisse & Info",
    };
  }
  if (lang === "hu") {
    return {
      photosBadge: "fotó",
      prevPhoto: "Előző fotó",
      nextPhoto: "Következő fotó",
      detailsBtn: "Eredmények",
    };
  }
  if (lang === "en") {
    return {
      photosBadge: "photos",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo",
      detailsBtn: "Results & info",
    };
  }
  return {
    photosBadge: "zdjęć",
    prevPhoto: "Poprzednie zdjęcie",
    nextPhoto: "Następne zdjęcie",
    detailsBtn: "Wyniki i szczegóły",
  };
}

// Zlokalizowana mapa autorów i licencji dla PL, EN, DE, HU (z bazą Neon oraz fallbackiem ze słowników)
function getLocalizedAttribution(photo: GalleryItem, lang: LangCode) {
  const isPl = lang === "pl";
  const isDe = lang === "de";
  const isHu = lang === "hu";

  // 1. Jeśli autor/licencja pochodzą bezpośrednio z bazy Neon lub obiektu ze słownika
  if (photo.author) {
    return {
      author: photo.author,
      license:
        photo.license ||
        (isPl
          ? "Zezwolenie na publikację dla UKS Roszada"
          : isDe
            ? "Veröffentlichungsgenehmigung für UKS Roszada"
            : isHu
              ? "Közlési engély az UKS Roszada részére"
              : "Authorized publication for UKS Roszada"),
    };
  }

  const photoPrefix = isPl
    ? "Fot."
    : isDe
      ? "Foto:"
      : isHu
        ? "Fotó:"
        : "Photo:";

  // 2. Fallback mapy identyfikatorów dla danych statycznych
  switch (photo.id) {
    case "srebrna-odznaka-torwar-2025":
      return {
        author: isPl
          ? `${photoPrefix} Polski Związek Szachowy / UKS Roszada`
          : isDe
            ? `${photoPrefix} Polnischer Schachverband / UKS Roszada`
            : isHu
              ? `${photoPrefix} Lengyel Sakkszövetség / UKS Roszada`
              : `${photoPrefix} Polish Chess Federation / UKS Roszada`,
        license: isPl
          ? "Uroczyste wręczenie Srebrnej Odznaki PZSzach (Torwar, 10.07.2025)"
          : isDe
            ? "Feierliche Verleihung der Silbernen PZSzach-Ehrennadel (Torwar, 2025)"
            : isHu
              ? "A PZSzach Ezüst Érdemérem ünnepélyes átadása (Torwar, 2025)"
              : "Official presentation of the Silver PZSzach Badge (Torwar, 2025)",
      };
    case "turniej-kamienica-deskurow-2026":
      return {
        author: isPl
          ? `${photoPrefix} Kamienica Deskurów / UM Radom`
          : `${photoPrefix} Kamienica Deskurów / Radom`,
        license: isPl
          ? "IV Turniej św. Kazimierza na XX-lecie klubu"
          : isDe
            ? "IV. St.-Kasimir-Turnier zum 20-jährigen Jubiläum"
            : isHu
              ? "IV. Szent Kázmér Torna a 20 éves jubileumra"
              : "4th St. Casimir Tournament (20th Anniversary)",
      };
    case "ksiazka-sztuka-matowania-2024":
    case "radio-plus-ksiazka-2024":
      return {
        author: isPl
          ? `${photoPrefix} Radio Plus Radom / RKŚTiG Łaźnia`
          : `${photoPrefix} Radio Plus Radom / Łaźnia Gallery`,
        license: isPl
          ? "Promocja książki „Sztuka matowania” (26.09.2024)"
          : isDe
            ? "Buchpräsentation „Die Kunst des Mattsetzens” (2024)"
            : isHu
              ? "„A mattadás művészete” könyvbemutató (2024)"
              : "Book release 'The Art of Checkmating' (Sept 2024)",
      };
    case "druzyna-liga-mazowiecka-2025":
      return {
        author: isPl
          ? `${photoPrefix} TwojRadom.pl / Grupa KNM`
          : `${photoPrefix} TwojRadom.pl / KNM Group`,
        license: isPl
          ? "Otwarta Liga Mazowiecka (Puszcza Mariańska / Winnica)"
          : isDe
            ? "Offene Masowische Schachliga 2025"
            : isHu
              ? "Nyílt Mazóviai Sakkbajnokság 2025"
              : "Open Masovian Chess League 2025",
      };
    case "memorial-jana-niedzwieckiego":
      return {
        author: isPl
          ? `${photoPrefix} TwojRadom.pl / Kronika UKS Roszada`
          : `${photoPrefix} TwojRadom.pl / UKS Roszada Chronicle`,
        license: isPl
          ? "Memoriał Szachowy im. Jana Niedźwieckiego"
          : isDe
            ? "Jan-Niedźwiecki-Gedächtnisturnier"
            : isHu
              ? "Jan Niedźwiecki Sakk Emlékverseny"
              : "Jan Niedźwiecki Chess Memorial",
      };
    case "turnieje-juniorskie-szkoly-2025":
    case "szachy-sala-gimnastyczna-2023":
      return {
        author: isPl
          ? `${photoPrefix} Kronika kół szkolnych (PSP 25 / PSP 6 / PSP 29)`
          : isDe
            ? `${photoPrefix} Chronik der Schulschachgruppen`
            : isHu
              ? `${photoPrefix} Iskolai szakkörök krónikája`
              : `${photoPrefix} School Chess Clubs Chronicle`,
        license: isPl
          ? "Projekt „Edukacja przez szachy w szkole”"
          : isDe
            ? "Bildungsprojekt „Schach in der Schule”"
            : isHu
              ? "„Sakk az iskolában” oktatási program"
              : "Chess in Schools Educational Project",
      };
    case "mikolajkowy-2024":
      return {
        author: `${photoPrefix} © Edyta Madej`,
        license: isPl
          ? "Zezwolenie na publikację dla UKS Roszada Radom"
          : isDe
            ? "Veröffentlichungsgenehmigung für UKS Roszada Radom"
            : isHu
              ? "Közlési engedély az UKS Roszada Radom részére"
              : "Authorized publication for UKS Roszada Radom",
      };
    case "turniej-hala-radom-2024":
    case "hala-sportowa-rodzice-2023":
    default:
      return {
        author: isPl
          ? `${photoPrefix} Archiwum UKS Roszada Radom`
          : isDe
            ? `${photoPrefix} Archiv UKS Roszada Radom`
            : isHu
              ? `${photoPrefix} UKS Roszada Radom Archívum`
              : `${photoPrefix} UKS Roszada Radom Club Archive`,
        license: isPl
          ? "Oficjalna kronika XX-lecia Klubu"
          : isDe
            ? "Offizielle Jubiläumschronik des Vereins"
            : isHu
              ? "A Klub hivatalos jubileumi krónikája"
              : "Official 20th Anniversary club archive",
      };
  }
}

export function GallerySection({ messages: t }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | "ALL">(
    "ALL",
  );
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [dbRows, setDbRows] = useState<GalleryRow[] | null>(null);

  useEffect(() => {
    let active = true;
    async function loadGalleryFromNeon() {
      try {
        const response = await fetch("/api/gallery");
        if (response.ok) {
          const result = await response.json();
          if (
            active &&
            result &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            setDbRows(result.data);
          }
        }
      } catch {
        // Cichy fallback na dane ze słownika t.gallery.items
      }
    }
    loadGalleryFromNeon();
    return () => {
      active = false;
    };
  }, []);

  // Wykrywanie języka na podstawie nagłówka
  const langCode: LangCode = t.header.brandSubtitle.includes("JAHRE")
    ? "de"
    : t.header.brandSubtitle.includes("YEARS")
      ? "en"
      : t.header.brandSubtitle.includes("ÉV")
        ? "hu"
        : "pl";

  const sliderLabels = getSliderLabels(langCode);

  const items = useMemo<GalleryItem[]>(() => {
    if (!dbRows || dbRows.length === 0) {
      return t.gallery.items;
    }

    return dbRows.map((row) => {
      const eventCaption = pickLocalized(row, "caption", langCode);
      const rawPhotos = Array.isArray(row.photos) ? row.photos : [];
      const slides: GallerySlide[] =
        rawPhotos.length > 0
          ? rawPhotos.map((p) => ({
              url: p.url,
              caption: pickSlideCaption(p, langCode, eventCaption),
            }))
          : [{ url: row.image, caption: eventCaption }];

      return {
        id: row.slug || `gallery-${row.id}`,
        title: pickLocalized(row, "title", langCode),
        year: row.year,
        categoryIndex: row.category_index,
        count: pickLocalized(row, "count", langCode),
        image: row.image,
        caption: eventCaption,
        author: pickLocalized(row, "author", langCode) || undefined,
        license: pickLocalized(row, "license", langCode) || undefined,
        slides,
      };
    });
  }, [dbRows, langCode, t.gallery.items]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "ALL") return items;
    return items.filter((item) => item.categoryIndex === selectedCategory);
  }, [selectedCategory, items]);

  const activeSlides = useMemo<GallerySlide[]>(() => {
    if (!activePhoto) return [];
    if (activePhoto.slides && activePhoto.slides.length > 0) {
      return activePhoto.slides;
    }
    return [{ url: activePhoto.image, caption: activePhoto.caption }];
  }, [activePhoto]);

  const safeSlideIndex = slideIndex < activeSlides.length ? slideIndex : 0;
  const currentSlide = activeSlides[safeSlideIndex];

  const openPhoto = (photo: GalleryItem) => {
    setSlideIndex(0);
    setShowEventDetails(false);
    setActivePhoto(photo);
  };

  const closePhoto = useCallback(() => {
    setActivePhoto(null);
    setSlideIndex(0);
    setShowEventDetails(false);
  }, []);

  const showPrevSlide = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setSlideIndex(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length,
    );
  }, [activeSlides.length]);

  const showNextSlide = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setSlideIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (!activePhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePhoto();
      } else if (e.key === "ArrowLeft") {
        showPrevSlide();
      } else if (e.key === "ArrowRight") {
        showNextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, closePhoto, showPrevSlide, showNextSlide]);

  // Zlokalizowana, rzetelna nota prawna bezpośrednio ze słowników językowych
  const legalNote = t.gallery.legalNote;
  const licenseLabel = t.gallery.licenseLabel;
  const rightsReserved = t.gallery.rightsReserved;

  return (
    <section
      id="gallery"
      className="relative scroll-mt-20 overflow-hidden bg-background py-10 transition-colors sm:scroll-mt-24 sm:py-14 lg:py-16"
    >
      {/* 4 zlokalizowane kotwice dla PL (#galeria), DE (#galerie), HU (#fotok) oraz EN (#gallery) */}
      <span
        id="galeria"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="galerie"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="fotok"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Nagłówek Sekcji */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span>{t.gallery.eyebrow}</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.gallery.title}{" "}
              <span className="text-emerald-700 dark:text-emerald-400">
                {t.gallery.titleAccent}
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-2.5 sm:text-base">
              {t.gallery.subtitle}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href={CLUB_CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>{t.gallery.facebookLink}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Przyciski Kategorii */}
        <div className="mt-6 -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2.5 sm:mx-0 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:border-b sm:border-border/50 sm:px-0 sm:pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === "ALL"
                ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {t.gallery.filterAll}
          </button>
          {t.gallery.categories.map((catName, idx) => (
            <button
              key={catName}
              type="button"
              onClick={() => setSelectedCategory(idx)}
              className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === idx
                  ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                  : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Siatka Fotografii (1 karta = 1 wydarzenie, proporcje 4:3 dla ekspozycji obrazu) */}
        <div className="mt-6 grid gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {filteredPhotos.map((photo) => {
            const attribution = getLocalizedAttribution(photo, langCode);
            const slidesCount = photo.slides?.length || 1;
            return (
              <div
                key={photo.id}
                onClick={() => openPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/40 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/gallery/8.avif";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  {/* Lewy górny róg: Zlokalizowany Autor */}
                  <div className="absolute top-2.5 left-2.5 flex max-w-[58%] items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/95 backdrop-blur-xs">
                    <Camera
                      className="h-3 w-3 shrink-0 text-amber-300"
                      aria-hidden="true"
                    />
                    <span className="truncate">{attribution.author}</span>
                  </div>

                  {/* Prawy górny róg: Licznik zdjęć slajdera + Rok */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {slidesCount > 1 && (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-700/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
                        <ImageIcon className="h-3 w-3" aria-hidden="true" />
                        <span>
                          {slidesCount} {sliderLabels.photosBadge}
                        </span>
                      </div>
                    )}
                    <div className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-xs">
                      {photo.year}
                    </div>
                  </div>

                  {/* Kompaktowa dolna belka z opisem */}
                  <div className="absolute right-3 bottom-3 left-3 text-white sm:right-3.5 sm:bottom-3.5 sm:left-3.5">
                    <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                      {t.gallery.categories[photo.categoryIndex]} ·{" "}
                      {photo.count}
                    </span>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informacja o Prawach Autorskich i Facebooku */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{legalNote}</span>
          </div>
          <a
            href={CLUB_CONTACT.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 font-bold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.gallery.facebookCta}</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Lightbox Modal ze slajderem — obraz na pierwszym planie, pełne wsparcie motywu jasnego i ciemnego */}
      {activePhoto && currentSlide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.lightbox.ariaLabel}
          onClick={closePhoto}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-sm dark:bg-black/88"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[90vh] sm:h-[92vh] w-full max-w-[96vw] lg:max-w-5xl xl:max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl"
          >
            {/* Główna scena fotografii — zajmuje całą wolną wysokość (~80% okna) */}
            <div className="relative flex flex-1 min-h-0 items-center justify-center bg-zinc-100 p-1.5 sm:p-3 dark:bg-zinc-950">
              <img
                src={currentSlide.url}
                alt={currentSlide.caption || activePhoto.title}
                decoding="async"
                className="max-h-full max-w-full w-auto h-auto rounded-lg object-contain select-none shadow-xs"
              />

              {/* Zamknij */}
              <button
                type="button"
                onClick={closePhoto}
                className="absolute top-2.5 right-2.5 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground shadow-md backdrop-blur-xs transition-colors hover:bg-background"
                aria-label={t.lightbox.closeAria}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              {activeSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevSlide}
                    aria-label={sliderLabels.prevPhoto}
                    className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground shadow-md backdrop-blur-xs transition-colors hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
                  >
                    <ChevronLeft
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={showNextSlide}
                    aria-label={sliderLabels.nextPhoto}
                    className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground shadow-md backdrop-blur-xs transition-colors hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
                  >
                    <ChevronRight
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      aria-hidden="true"
                    />
                  </button>

                  <div className="absolute top-2.5 left-2.5 rounded-full border border-border/80 bg-background/85 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-xs backdrop-blur-xs">
                    {safeSlideIndex + 1} / {activeSlides.length}
                  </div>
                </>
              )}
            </div>

            {/* Kompaktowy pasek miniaturek */}
            {activeSlides.length > 1 && (
              <div className="shrink-0 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto border-t border-border/60 bg-muted/40 px-3 py-1.5 sm:py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {activeSlides.map((slide, idx) => (
                  <button
                    key={`${slide.url}-${idx}`}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    className={`relative h-10 w-14 sm:h-12 sm:w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      idx === safeSlideIndex
                        ? "border-emerald-600 ring-2 ring-emerald-500/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={`${activePhoto.title} (${idx + 1})`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Kompaktowy, dopasowany do motywu podpis pod zdjęciem */}
            <div className="shrink-0 border-t border-border/60 bg-card px-3.5 py-2.5 sm:px-5 sm:py-3">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <span>
                      {t.gallery.categories[activePhoto.categoryIndex]} ·{" "}
                      {activePhoto.count}
                    </span>
                    <span className="hidden sm:inline text-border">·</span>
                    <span className="hidden sm:inline-flex items-center gap-1 font-normal text-muted-foreground">
                      <Copyright className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                      {getLocalizedAttribution(activePhoto, langCode).author}
                    </span>
                  </div>
                  <h3 className="truncate text-xs font-bold text-foreground sm:text-sm">
                    {activePhoto.title}
                  </h3>
                </div>

                {activeSlides.length > 1 &&
                  currentSlide.caption !== activePhoto.caption && (
                    <button
                      type="button"
                      onClick={() => setShowEventDetails((prev) => !prev)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      <Info className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span>{sliderLabels.detailsBtn}</span>
                    </button>
                  )}
              </div>

              <p className="mt-1 text-[11px] leading-snug text-foreground/85 sm:text-xs">
                {currentSlide.caption}
              </p>

              {showEventDetails && (
                <p className="mt-1.5 border-t border-border/50 pt-1.5 text-[11px] leading-snug text-muted-foreground">
                  {activePhoto.caption} · {licenseLabel}:{" "}
                  {getLocalizedAttribution(activePhoto, langCode).license}.{" "}
                  {rightsReserved}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
