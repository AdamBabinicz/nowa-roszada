"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Pin,
  Tag,
  User,
  X,
} from "lucide-react";
import type { Language, Messages } from "@/lib/translations";
import type { NewsRow } from "@/app/api/news/route";

interface NewsSectionProps {
  currentLanguage: Language;
  messages: Messages;
}

// Błyskawiczny bufor początkowy — strona ładuje się natychmiast (0 ms bez kółka ładowania)
const INITIAL_NEWS_CACHE: NewsRow[] = [
  {
    id: 1,
    slug: "rok-jubileuszowy-20-lecia-uks-roszada-monografia",
    date: "2026-09-22",
    category: "Jubileusz",
    author: "Zarząd UKS Roszada",
    is_pinned: true,
    title_pl:
      "Obchodzimy Rok Jubileuszowy 20-lecia UKS Roszada — Zgłoszenia do Monografii Klubu",
    title_en:
      "Celebrating the 20th Anniversary Year of UKS Roszada — Call for Club Monograph Biographies",
    title_de:
      "Wir feiern das 20-jährige Jubiläumsjahr von UKS Roszada — Aufruf für die Vereinschronik",
    title_hu:
      "Az UKS Roszada 20. jubileumi évét ünnepeljük — Életrajzok gyűjtése a klub monográfiájához",
    excerpt_pl:
      "Ważną częścią obchodów 20-lecia będzie wydawnictwo jubileuszowe. Prosimy zawodników, sędziów i działaczy o przesyłanie krótkich biogramów.",
    excerpt_en:
      "An important part of our 20th jubilee will be the commemorative monograph. We invite players, arbiters, and organizers to submit short biographies.",
    excerpt_de:
      "Ein wichtiger Teil unseres 20-jährigen Jubiläums ist die Festschrift. Wir bitten Spieler, Schiedsrichter und Funktionäre um kurze Biografien.",
    excerpt_hu:
      "A 20 éves jubileum kiemelt része az ünnepi kiadvány. Kérjük a játékosokat, bírókat és vezetőket, hogy küldjék el rövid életrajzukat.",
    content_pl: `Drodzy szachiści, obchodzimy rok jubileuszowy 20-lecia naszego klubu. Ważną częścią obchodów będzie wydawnictwo jubileuszowe, w którym przedstawimy historię działalności naszego klubu. Będzie również rozdział poświęcony radomskim szachistom spoza Roszady.

Poniżej przedstawiamy listę członków klubu, a także radomskich zawodników, sędziów, trenerów i działaczy szachowych działających w tym samym czasie w Radomiu. Prosimy wszystkich, którzy zechcą z nami współpracować o wysłanie do nas swoich krótkich biografii na nasz adres mailowy lub smsem. Jeśli kogoś nie ma na liście, to bardzo przepraszamy. Niezwłocznie dopiszemy!

📞 Tel: 502 215 278
📧 E-mail: malgorzatack@wp.pl

Członkowie i wychowankowie UKS Roszada:
Andrzej Bator, Robert Bator, Zbigniew Bator, Piotr Ciechoński, Mariusz Ćwiek, Ryszard Ćwiek, Robert Fiszer, Wojciech Jakubiak, Varduhi Karapetyjan, Konrad Kądziela, Krzysztof Kądziela, Andrzej Koziarski, Andrzej Lipiński, Tomasz Litwin, Tomasz Masłowski, Angelika Mąkosa-Leśniewska, Kamil Młynarski, Arkadiusz Paterek, Joanna Paterek-Michalska, Michał Paterek, Paweł Piętocha, Marcin Pomagalski, Weronika Posuniak, Marcin Sarna, Andrzej Szymański, Konrad Skorża, Jacek Sieczkowski, Arkadiusz Skawiński, Paweł Stępień, Andrzej Szewczak, Waldemar Ziętek, Marek Zych.

Środowisko szachowe Radomia i współpracownicy:
Adam Borowski, Renata Bielecka (LO 6), Klaudia Borkowska (organizator Koła Szachowego UKS Roszada przy PSP Nr 25), Maria Braksator, Adam Gierczak (prowadzi stronę Roszady), Jerzy Gorgoń, Paweł Gorgoń, Figura, Andrzej Gut, Jagielski, Marcin Kociszewski (Nihil Novi Chess Club), Marzena Kucharska (organizator Koła Szachowego UKS Roszada przy PSP Nr 6), Zdzisław Kulesza, Jacek Kutkiewicz, Małgorzata Półbratek (organizatorka turniejów szachowych), Leszek Syta, Arkadiusz Kądziela, Andrzej Zygarski, Bogusław Paterek, Lucjan Matejek, Leszek Syta, Agnieszka Wielosik (organizator Koła Szachowego UKS Roszada przy PSP Nr 29), Marek Wróbel.

Zdjęcie dla zwrócenia uwagi! (autor projektu: Martyna Piasta)`,
    images: [
      { url: "/upload/jubileusz.avif", alt_pl: "Jubileusz 20 lat UKS Roszada" },
    ],
  },
  {
    id: 2,
    slug: "marsz-i-piknik-dla-zwierzat-park-kosciuszki",
    date: "2026-09-16",
    category: "Klub",
    author: "Zarząd UKS Roszada",
    is_pinned: false,
    title_pl:
      "UKS ROSZADA na marszu i pikniku dla bezdomnych zwierząt w Parku Kościuszki",
    title_en:
      "UKS ROSZADA at the Charity March & Picnic for Animals in Kościuszko Park",
    title_de:
      "UKS ROSZADA beim Wohltätigkeitsmarsch und Picknick für Tiere im Kościuszko-Park",
    title_hu:
      "Az UKS ROSZADA a rászoruló állatokért rendezett jótékonysági felvonuláson és pikniken",
    excerpt_pl:
      "Wspieramy szlachetne inicjatywy w Radomiu. Gry plenerowe w szachy podczas pikniku wolontariuszy dla bezdomnych zwierząt.",
    excerpt_en:
      "Supporting noble causes in Radom. Outdoor chess games during the volunteers charity picnic for homeless animals.",
    excerpt_de:
      "Wir unterstützen wohltätige Zwecke in Radom: Freiluftschach beim Picknick für heimatlose Tiere.",
    excerpt_hu:
      "Nemes kezdeményezéseket támogatunk Radomban: szabadtéri sakkozás a gazdátlan állatokért tartott pikniken.",
    content_pl: `UKS ROSZADA na niedzielnym marszu i pikniku dla zwierząt zorganizowanym przez „Psia Kostka Stowarzyszenie Wolontariuszy dla Bezdomnych Zwierząt” oraz „Łaźnia — Radomski Klub Środowisk Twórczych i Galeria”.

Nasi reprezentanci prowadzili plenerowe partie szachowe w cieniu parkowych drzew, łącząc edukację logiczną z propagowaniem wrażliwości i pomocy dla bezdomnych czworonogów. ♟️🐶🐾

Fot. Daria Potkańska, Anna Pawlikowska`,
    images: [
      { url: "/upload/piknik-zwierzat.avif", alt_pl: "Piknik dla zwierząt" },
    ],
  },
  {
    id: 3,
    slug: "prezes-marek-niedzwiecki-ii-szentmiklos-open-wegry-2026",
    date: "2026-09-02",
    category: "Turnieje",
    author: "Zarząd UKS Roszada",
    is_pinned: false,
    title_pl:
      "Prezes Marek Niedźwiecki w międzynarodowym turnieju II Szentmiklos Open 2026 na Węgrzech",
    title_en:
      "President Marek Niedźwiecki at the International II Szentmiklos Open 2026 in Hungary",
    title_de:
      "Präsident Marek Niedźwiecki beim internationalen Turnier II Szentmiklos Open 2026 in Ungarn",
    title_hu:
      "Marek Niedźwiecki elnök úr a II. Szentmiklós Open 2026 nemzetközi sakkversenyen Magyarországon",
    excerpt_pl:
      "Występ w 7-rundowym turnieju szachów klasycznych w Törökszentmiklós wśród 107 zawodników z 14 federacji.",
    excerpt_en:
      "Competing in a 7-round classical chess tournament in Törökszentmiklós among 107 players from 14 national federations.",
    excerpt_de:
      "Teilnahme am 7-Runden-Klassikschachturnier in Törökszentmiklós unter 107 Teilnehmern aus 14 Verbänden.",
    excerpt_hu:
      "Részvétel a 7 fordulós klasszikus sakkversenyen Törökszentmiklóson, 14 ország 107 sakkozója között.",
    content_pl: `W minionym tygodniu nasz Prezes zagrał w 7-rundowym turnieju szachów klasycznych, II Szentmiklos Open 2026, w Törökszentmiklós na Węgrzech.

W zawodach wzięło udział 107 zawodników z 14 federacji m.in. z Węgier, Indii, Chin, Polski, Francji, Słowacji, Chorwacji, Turcji i Czech.
Pula nagród wyniosła 1 300 000 HUF.
Organizator: Sol Oriens sp. z o.o., główny organizator: dr Árpád Szalóki.
W turnieju zagrało 6 mistrzów międzynarodowych oraz 4 mistrzów FIDE.

Polskę reprezentował m.in. mistrz międzynarodowy Jacek Bielczyk, który otrzymał nagrodę dla najlepszego zawodnika seniora.
Organizatorzy zapewnili szachistom i ich rodzinom wspaniałą rekreację w termalnych basenach leczniczych. Turniej wygrał reprezentant Indii Neelash Saha. 🏆♟️

🔗 Wyniki turnieju: https://s1.chess-results.com/tnr1412907.aspx?SNode=S0
Fot. Ewa Bielczyk, Małgorzata Cieślak Kopyt`,
    images: [
      {
        url: "/upload/wegry.avif",
        alt_pl: "Marek Niedźwiecki na turnieju w Szentmiklos",
      },
    ],
  },
  {
    id: 4,
    slug: "szachy-nad-pilica-warsztaty-biejkow",
    date: "2026-08-17",
    category: "Szkolenie",
    author: "Marek Niedźwiecki",
    is_pinned: false,
    title_pl:
      "Szachy zawitały nad Pilicę — Warsztaty i pokaz szachowy w Biejkowie",
    title_en: "Chess by the Pilica River — Presentation & Workshops in Biejków",
    title_de: "Schach an der Pilica — Präsentation und Workshops in Biejków",
    title_hu:
      "Sakk a Pilica partján — Sakkbemutató és foglalkozások Biejkówban",
    excerpt_pl:
      "Wakacyjna popularyzacja królewskiej gry. Prezentacja i partie szachowe dla dzieci i dorosłych z Biejkowa i Karczewa.",
    excerpt_en:
      "Holiday chess promotion: open-air demonstration and lessons for children and adults from Biejków and Karczew.",
    excerpt_de:
      "Ferien-Schachförderung: Freiluftvorführung und Unterricht für Kinder und Erwachsene aus Biejków und Karczew.",
    excerpt_hu:
      "Nyári sakk-népszerűsítés: szabadtéri bemutató és oktatás gyermekeknek és felnőtteknek Biejkówban.",
    content_pl: `W niedzielne popołudnie szachy zawitały do malowniczego Biejkowa nad rzeką Pilicą.

Prezes UKS ROSZADA Marek Niedźwiecki przeprowadził otwartą prezentację szachową na działce w Biejkowie 136A. W zajęciach aktywnie uczestniczyły dzieci oraz dorośli mieszkańcy Biejkowa i Karczewa.

W programie znalazły się partie pokazowe, nauka zasad gry na zegarze szachowym oraz rozwiązywanie łamigłówek taktycznych. Wobec dużego zainteresowania Prezes planuje kolejne letnie warsztaty szachowe nad Pilicą. ♟️🌿`,
    images: [
      { url: "/upload/pilica.avif", alt_pl: "Szachy w Biejkowie nad Pilicą" },
    ],
  },
];

export function NewsSection({
  currentLanguage,
  messages: t,
}: NewsSectionProps) {
  const [news, setNews] = useState<NewsRow[]>(INITIAL_NEWS_CACHE);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function silentSync() {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const result = await response.json();
          if (
            active &&
            result &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            setNews(result.data);
          }
        }
      } catch {
        // Cichy fallback na pamięć podręczną
      }
    }

    silentSync();

    return () => {
      active = false;
    };
  }, []);

  const langKey = (currentLanguage?.toLowerCase() || "pl") as
    | "pl"
    | "en"
    | "de"
    | "hu";

  // Wszystkie teksty i etykiety pobierane dynamicznie ze słownika t
  const labels = {
    eyebrow: t?.news?.eyebrow || "",
    title: t?.news?.title || "",
    titleAccent: t?.news?.titleAccent || "",
    subtitle: t?.news?.subtitle || "",
    all: t?.news?.filterAll || "",
    club: t?.news?.filterClub || "",
    tournaments: t?.news?.filterTournaments || "",
    jubilee: t?.news?.filterJubilee || "",
    training: t?.news?.filterTraining || "",
    empty: t?.news?.empty || "",
    pinned: t?.news?.pinned || "",
    photosCount: t?.news?.photosCount || "",
    readMore: t?.news?.readMore || "",
    collapse: t?.news?.collapse || "",
    authorBoard:
      (t?.news as Record<string, string>)?.authorBoard ||
      (t?.news as Record<string, string>)?.authorDefault ||
      "",
    authorDefault: (t?.news as Record<string, string>)?.authorDefault || "",
    lightboxAria: t?.lightbox?.ariaLabel || "",
    lightboxClose: t?.lightbox?.closeAria || "",
  };

  const getCategoryLabel = (category: string) => {
    const lower = category?.toLowerCase();
    if (lower === "klub" || lower === "club") return labels.club;
    if (
      lower === "turnieje" ||
      lower === "tournaments" ||
      lower === "turniere" ||
      lower === "versenyek"
    )
      return labels.tournaments;
    if (lower === "jubileusz" || lower === "jubilee" || lower === "jubiläum")
      return labels.jubilee;
    if (
      lower === "szkolenie" ||
      lower === "training" ||
      lower === "schulung" ||
      lower === "képzés"
    )
      return labels.training;
    return category;
  };

  const categories = [
    { id: "all", label: labels.all },
    { id: "klub", label: labels.club },
    { id: "turnieje", label: labels.tournaments },
    { id: "jubileusz", label: labels.jubilee },
    { id: "szkolenie", label: labels.training },
  ];

  const filteredNews = news.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const isOddCount = filteredNews.length % 2 !== 0 && filteredNews.length > 1;

  // Dynamiczne mapowanie autora: jeśli autor to zarząd, używamy słownika dla wybranego języka
  const resolveAuthorName = (authorName?: string) => {
    if (!authorName) return labels.authorDefault;
    const lower = authorName.toLowerCase();
    if (
      lower.includes("zarząd") ||
      lower.includes("board") ||
      lower.includes("vorstand") ||
      lower.includes("elnökség")
    ) {
      return labels.authorBoard || labels.authorDefault || authorName;
    }
    return authorName;
  };

  return (
    <section
      id="news"
      className="relative scroll-mt-20 border-t border-border/40 bg-muted/20 py-10 sm:py-14 lg:py-16"
    >
      {/* Zlokalizowane niewidoczne kotwice językowe poza przepływem DOM */}
      <span
        id="aktualnosci"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="aktuelles"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="hirek"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      {/* Lightbox powiększania zdjęć */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-label={labels.lightboxAria}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            aria-label={labels.lightboxClose}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxImage}
            alt={labels.lightboxAria}
            width={1200}
            height={900}
            decoding="async"
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="flex flex-col items-center text-center">
          {labels.eyebrow && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold tracking-widest text-emerald-800 uppercase dark:text-emerald-300">
              {labels.eyebrow}
            </span>
          )}
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {labels.title}{" "}
            <span className="text-emerald-700 dark:text-emerald-400">
              {labels.titleAccent}
            </span>
          </h2>
          {labels.subtitle && (
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
              {labels.subtitle}
            </p>
          )}

          {/* Filtry kategorii */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-6 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all sm:px-4 sm:py-2 ${
                  activeCategory === cat.id
                    ? "bg-emerald-700 text-white shadow-sm dark:bg-emerald-600"
                    : "border border-border/70 bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Karty artykułów */}
        <div className="mt-6 sm:mt-8 lg:mt-10">
          {filteredNews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                {labels.empty}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {filteredNews.map((item, index) => {
                const title =
                  item[`title_${langKey}` as keyof NewsRow] ||
                  item.title_pl ||
                  "";
                const excerpt =
                  item[`excerpt_${langKey}` as keyof NewsRow] ||
                  item.excerpt_pl ||
                  "";
                const content =
                  item[`content_${langKey}` as keyof NewsRow] ||
                  item.content_pl ||
                  "";
                const isExpanded = expandedId === item.id;
                const images = Array.isArray(item.images) ? item.images : [];
                const isFeaturedSpan = isOddCount && index === 0;

                return (
                  <article
                    key={item.id}
                    className={`flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-4 shadow-xs transition-all hover:shadow-md sm:p-5 lg:p-6 ${
                      isFeaturedSpan ? "md:col-span-2" : ""
                    } ${
                      item.is_pinned
                        ? "border-amber-500/50 bg-amber-500/5 dark:border-amber-400/30"
                        : "border-border/80"
                    }`}
                  >
                    <div>
                      {/* Pasek metadanych */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                            <Tag className="h-3 w-3" />
                            <span>{getCategoryLabel(item.category)}</span>
                          </span>

                          {item.is_pinned && labels.pinned && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                              <Pin className="h-3 w-3" />
                              <span>{labels.pinned}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs italic text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <time dateTime={item.date}>{item.date}</time>
                        </div>
                      </div>

                      {/* Tytuł artykułu */}
                      <h3 className="mt-3 text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                        {String(title)}
                      </h3>

                      {/* Zajawka */}
                      {excerpt && !isExpanded && (
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {String(excerpt)}
                        </p>
                      )}

                      {/* Pełna treść z akapitami */}
                      {isExpanded && content && (
                        <div className="mt-3 space-y-2 border-t border-border/40 pt-2.5 text-xs leading-relaxed text-foreground sm:text-sm">
                          {String(content)
                            .split("\n")
                            .filter((p) => p.trim() !== "")
                            .map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                        </div>
                      )}

                      {/* Galeria zdjęć (Next.js Image z elastycznymi sizes) */}
                      {images.length > 0 && (
                        <div className="mt-3 sm:mt-4">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {images.map((img, idx) => (
                              <div
                                key={idx}
                                onClick={() => setLightboxImage(img.url)}
                                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-muted"
                              >
                                <Image
                                  src={img.url}
                                  alt={img.alt_pl || String(title)}
                                  width={360}
                                  height={270}
                                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 360px"
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                          {labels.photosCount && (
                            <span className="mt-1.5 inline-block text-[10px] font-semibold text-muted-foreground">
                              📷 {images.length} {labels.photosCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stopka z autorem i przyciskiem rozwijania */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 sm:mt-5 sm:pt-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <User className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                        <span>{resolveAuthorName(item.author)}</span>
                      </span>

                      {content && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline dark:text-emerald-400"
                        >
                          <span>
                            {isExpanded ? labels.collapse : labels.readMore}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
