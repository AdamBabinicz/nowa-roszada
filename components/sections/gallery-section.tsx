"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Camera,
  Copyright,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Messages } from "@/lib/translations";
import { CLUB_CONTACT } from "@/lib/data/club";

interface GallerySectionProps {
  messages: Messages;
}

type GalleryItem = Messages["gallery"]["items"][number] & {
  author?: string;
  license?: string;
};

// Zlokalizowana mapa autorów i licencji dla PL, EN, DE, HU oparta na zweryfikowanych źródłach
function getLocalizedAttribution(
  photo: GalleryItem,
  lang: "pl" | "en" | "de" | "hu",
) {
  const isPl = lang === "pl";
  const isDe = lang === "de";
  const isHu = lang === "hu";

  // 1. Jeśli autor/licencja są podane bezpośrednio w obiekcie ze słownika
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
              ? "Közlési engedély az UKS Roszada részére"
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

  // 2. Mapa dedykowanych identyfikatorów autentycznych fotoreportaży
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

  // Wykrywanie języka na podstawie nagłówka
  const langCode: "pl" | "en" | "de" | "hu" = t.header.brandSubtitle.includes(
    "JAHRE",
  )
    ? "de"
    : t.header.brandSubtitle.includes("YEARS")
      ? "en"
      : t.header.brandSubtitle.includes("ÉV")
        ? "hu"
        : "pl";

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "ALL") return t.gallery.items;
    return t.gallery.items.filter(
      (item) => item.categoryIndex === selectedCategory,
    );
  }, [selectedCategory, t.gallery.items]);

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

        {/* Siatka Fotografii */}
        <div className="mt-6 grid gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {filteredPhotos.map((photo) => {
            const attribution = getLocalizedAttribution(photo, langCode);

            return (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/40 hover:shadow-xl"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 transition-opacity group-hover:opacity-95" />

                  {/* Lewy górny róg: Zlokalizowany Autor */}
                  <div className="absolute top-3 left-3 flex max-w-[70%] items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white/95 backdrop-blur-xs">
                    <Camera
                      className="h-3 w-3 shrink-0 text-amber-300"
                      aria-hidden="true"
                    />
                    <span className="truncate">{attribution.author}</span>
                  </div>

                  {/* Prawy górny róg: Rok */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-xs">
                    {photo.year}
                  </div>

                  {/* Dolna belka z opisem ze słownika */}
                  <div className="absolute right-3.5 bottom-3.5 left-3.5 text-white sm:right-4 sm:bottom-4 sm:left-4">
                    <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                      {t.gallery.categories[photo.categoryIndex]} ·{" "}
                      {photo.count}
                    </span>
                    <h3 className="mt-1 text-base font-bold leading-snug text-white">
                      {photo.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-white/80">
                      {photo.caption}
                    </p>
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

      {/* Lightbox Modal — z zachowaniem proporcji i praw autorskich */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.lightbox.ariaLabel}
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            aria-label={t.lightbox.closeAria}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto flex max-h-[90vh] w-fit max-w-[95vw] sm:max-w-2xl lg:max-w-3xl flex-col overflow-hidden rounded-2xl bg-card text-foreground shadow-2xl"
          >
            <div className="flex items-center justify-center overflow-hidden bg-black/30">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                loading="lazy"
                decoding="async"
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {t.gallery.categories[activePhoto.categoryIndex]} ·{" "}
                  {activePhoto.year} ({activePhoto.count})
                </span>

                <div className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                  <Copyright className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {getLocalizedAttribution(activePhoto, langCode).author}
                  </span>
                </div>
              </div>

              <h3 className="mt-2 text-base font-bold text-foreground sm:text-lg">
                {activePhoto.title}
              </h3>

              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {activePhoto.caption}
              </p>

              <div className="mt-3.5 border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground/80">
                <span>
                  {licenseLabel}:{" "}
                  {getLocalizedAttribution(activePhoto, langCode).license}.{" "}
                  {rightsReserved}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
