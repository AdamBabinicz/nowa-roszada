"use client";

import {
  ExternalLink,
  HeartHandshake,
  ShieldCheck,
  Trophy,
  Building2,
} from "lucide-react";
import type { Messages } from "@/lib/translations";

interface PartnerBannerProps {
  messages: Messages;
}

// 1. Autentyczny wektorowy logotyp Grupy KNM
function GrupaKnmLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 147.332"
      className={className}
      aria-label="Logo Grupa KNM"
      fill="currentColor"
    >
      <g>
        <path d="M357.266,147.332V86.676L305.6,138.207,209.7,40.987V26.02h42.734l53.041,52.845L357.266,26.02H400V147.332Zm-147.6,0L158.922,93.383v53.949l-44.31-45.784V49.459L137.921,26.02h-7.354L81.582,75.278l70.057,72.054H91.771L42.735,96.6v50.734H0V26.02H42.735V53.283L70.7,26.02h88.222v.394l51.537,56.748-.76-34.5,42.7,44.1v54.571ZM57.8,18.6a9.328,9.328,0,0,1-2.565-7V.482H61.4v10.9a5.845,5.845,0,0,0,.927,3.659,3.708,3.708,0,0,0,5.522,0,5.849,5.849,0,0,0,.927-3.659V.482H74.82V11.6a9.329,9.329,0,0,1-2.565,7,10.013,10.013,0,0,1-7.226,2.486A10.013,10.013,0,0,1,57.8,18.6ZM5.465,19.739A10.033,10.033,0,0,1,1.452,16,10.377,10.377,0,0,1,0,10.542,10.382,10.382,0,0,1,1.452,5.084,9.972,9.972,0,0,1,5.507,1.347,12.865,12.865,0,0,1,11.445,0a13.744,13.744,0,0,1,5.369,1,10.058,10.058,0,0,1,3.6,2.547L16.567,6.936a6.4,6.4,0,0,0-4.761-2.127A5.453,5.453,0,0,0,7.74,6.363a5.741,5.741,0,0,0-1.518,4.179,5.8,5.8,0,0,0,1.5,4.144,5.272,5.272,0,0,0,4,1.591,7.187,7.187,0,0,0,2.767-.547.469.469,0,0,0,.289-.433V13.344l3.323-2.9H20v8.187a14.046,14.046,0,0,1-3.99,1.783,17.4,17.4,0,0,1-4.689.671A12.6,12.6,0,0,1,5.465,19.739Zm78.056.865V.482h9.67a12.038,12.038,0,0,1,4.894.922A7.072,7.072,0,0,1,101.222,4a7.126,7.126,0,0,1,1.1,3.956,7.13,7.13,0,0,1-1.1,3.956,7.07,7.07,0,0,1-3.138,2.595,11.788,11.788,0,0,1-4.561.915l-3.143-4.53h2.358a3.62,3.62,0,0,0,2.481-.767A2.779,2.779,0,0,0,96.1,7.956a2.78,2.78,0,0,0-.878-2.171,3.62,3.62,0,0,0-2.48-.765h-3.37a.469.469,0,0,0-.47.469V20.6Zm-41.44,0-6.719-9.712h2.35a3.616,3.616,0,0,0,2.479-.766,2.775,2.775,0,0,0,.878-2.17,2.777,2.777,0,0,0-.878-2.171,3.617,3.617,0,0,0-2.479-.765H34.34a.468.468,0,0,0-.469.469V20.6H28.492V.482h9.67a12.035,12.035,0,0,1,4.894.922A7.071,7.071,0,0,1,46.193,4a7.126,7.126,0,0,1,1.1,3.956,7.027,7.027,0,0,1-.954,3.7,6.791,6.791,0,0,1-2.764,2.5.471.471,0,0,0-.238.3.466.466,0,0,0,.061.376L47.173,20.6Zm82.572,0-5.3-13.78a.469.469,0,0,0-.875,0l-5.3,13.781H107l8.8-20.123h6.366l8.239,18.85V20.6Z" />
      </g>
    </svg>
  );
}

// 2. Wektorowy logotyp Virgo Poligrafia (transparentny, adaptacyjny)
function VirgoLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 380 130"
      className={className}
      aria-label="Logo Virgo Poligrafia"
      fill="currentColor"
    >
      {/* Główny masywny napis VIRGO */}
      <text
        x="0"
        y="72"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="78"
        letterSpacing="-1.5px"
        fill="currentColor"
      >
        VIRGO
      </text>

      {/* Podpis POLIGRAFIA z szerokim kerningiem */}
      <text
        x="3"
        y="114"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="600"
        fontSize="28"
        letterSpacing="8px"
        fill="currentColor"
      >
        POLIGRAFIA
      </text>

      {/* Sygnowana pomarańczowa kropka Virgo */}
      <circle cx="348" cy="24" r="18" fill="#f97316" />

      {/* Pionowy adres .net.pl */}
      <g transform="translate(358, 48) rotate(90)">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="21"
          letterSpacing="2px"
          fill="currentColor"
        >
          .net.pl
        </text>
      </g>
    </svg>
  );
}

// 3. Wektorowy logotyp Conwex (transparentny, szeryfowy krój z adaptacyjnym błękitem)
function ConwexLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460 120"
      className={className}
      aria-label="Logo Conwex"
    >
      {/* Górny napis: CENTRUM TECHNIKI BIUROWEJ */}
      <text
        x="230"
        y="30"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="3.5px"
        fill="currentColor"
      >
        CENTRUM TECHNIKI BIUROWEJ
      </text>

      {/* Główny napis CONWEX w klasycznym szeryfowym kroju z charakterystycznym błękitem */}
      <text
        x="230"
        y="108"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', Cambria, serif"
        fontWeight="900"
        fontSize="84"
        letterSpacing="4.5px"
        className="fill-blue-600 transition-colors dark:fill-blue-400"
      >
        CONWEX
      </text>
    </svg>
  );
}

export function PartnerBanner({ messages: t }: PartnerBannerProps) {
  const f =
    (t as unknown as { friends?: Record<string, string> }).friends || {};

  const eyebrow = f.eyebrow || "WSPARCIE I DONACJE";
  const badge = f.badge || "MECENAT SZACHOWY";
  const title = f.title || "Nasi";
  const titleAccent = f.titleAccent || "Przyjaciele";
  const lead =
    f.lead ||
    "Dziękujemy podmiotom komercyjnym i darczyńcom, których realne wsparcie finansowe oraz rzeczowe pomaga rozwijać skrzydła radomskim szachistom.";
  const visitWebsite = f.visitWebsite || "Odwiedź stronę";
  const leagueSponsor = f.leagueSponsor || "Sponsor drużyny ligowej";
  const tournamentPrizes = f.tournamentPrizes || "Nagrody turniejowe";

  const partners = [
    {
      id: "knm",
      name: "Grupa KNM",
      badge: leagueSponsor,
      description:
        f.knmDesc ||
        "Sponsor strojów ligowych UKS Roszada w rozgrywkach Otwartej Ligi Mazowieckiej.",
      url: "https://grupaknm.pl",
      hasCustomLogo: true,
      component: (
        <GrupaKnmLogo className="h-8.5 w-auto text-slate-900 transition-colors dark:text-white sm:h-9" />
      ),
    },
    {
      id: "virgo",
      name: "Virgo Poligrafia",
      badge: tournamentPrizes,
      description:
        f.virgoDesc ||
        "Wsparcie poligraficzne i materiały drukowane dla turniejów oraz działalności klubu.",
      url: "https://virgo.net.pl/",
      hasCustomLogo: true,
      component: (
        <VirgoLogo className="h-8.5 w-auto text-slate-900 transition-colors dark:text-white sm:h-9" />
      ),
    },
    {
      id: "conwex",
      name: "Conwex — Centrum Techniki Biurowej",
      badge: tournamentPrizes,
      description:
        f.conwexDesc ||
        "Wsparcie techniczne, urządzenia biurowe i obsługa techniczna UKS Roszada.",
      url: "https://conwex.pl/",
      hasCustomLogo: true,
      component: (
        <ConwexLogo className="h-8.5 w-auto text-slate-900 transition-colors dark:text-white sm:h-9" />
      ),
    },
    {
      id: "mdd-center",
      name: "MDD Center Mirosława Siczek",
      badge: tournamentPrizes,
      description:
        f.mddDesc ||
        "Mecenat i wsparcie rozwoju dzieci i młodzieży w UKS Roszada Radom.",
      url: null,
      hasCustomLogo: false,
      isTextOnly: true,
    },
    {
      id: "private-donor",
      name: f.privateDonorName || "Prywatny Darczyńca",
      badge: tournamentPrizes,
      description:
        f.privateDonorDesc ||
        "Anonimowy fundator nagród finansowych dla najlepszych zawodników Memoriału im. Jana Niedźwieckiego.",
      url: null,
      hasCustomLogo: false,
      isAnonymous: true,
    },
    {
      id: "pranie-dywanow",
      name: "Super Pucuś — Pranie Dywanów",
      badge: tournamentPrizes,
      description:
        f.pranieDesc ||
        "Fundator nagród turniejowych i wsparcie rzeczowo-finansowe zawodów UKS Roszada.",
      url: "https://pranie-dywanow.j.pl/",
      hasCustomLogo: false,
      logoSrc: "/partners/sp.png",
    },
    {
      id: "slodkolandia",
      name: "SŁODKOLANDIA wita:",
      badge: tournamentPrizes,
      description:
        f.slodkolandiaDesc ||
        "Fundator nagród turniejowych oraz słodkich upominków dla najmłodszych szachistów.",
      url: "https://www.slodkolandia.cba.pl/",
      hasCustomLogo: false,
      logoSrc: "/partners/sl.png",
    },
  ];

  return (
    <section
      id="przyjaciele"
      className="relative scroll-mt-20 overflow-hidden bg-background py-10 transition-colors sm:scroll-mt-24 sm:py-14 lg:py-16"
      aria-labelledby="friends-heading"
    >
      {/* 4 zlokalizowane kotwice dla PL (#przyjaciele), EN (#friends), DE (#freunde), HU (#baratok) */}
      <span
        id="friends"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="freunde"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="baratok"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Nagłówek sekcji */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-900 uppercase dark:border-emerald-500/40 dark:bg-emerald-950/80 dark:text-emerald-200">
            <HeartHandshake
              className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span>{eyebrow}</span>
            <span
              className="text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            >
              ·
            </span>
            <span>{badge}</span>
          </div>

          <h2
            id="friends-heading"
            className="mt-2.5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white"
          >
            {title}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              {titleAccent}
            </span>
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:mt-2.5 sm:text-base dark:text-slate-200">
            {lead}
          </p>
        </div>

        {/* Siatka Przyjaciół Klubu */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {partners.map((partner) => {
            const isClickable = Boolean(partner.url);

            const CardContent = (
              <div className="flex h-full flex-col justify-between p-4.5 sm:p-5.5 lg:p-6">
                <div>
                  {/* Pasek statusu / badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300/80 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-950 dark:border-emerald-800/80 dark:bg-emerald-950/90 dark:text-emerald-200">
                      <ShieldCheck
                        className="h-3 w-3 shrink-0 text-emerald-800 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      {partner.badge}
                    </span>

                    {isClickable && (
                      <span className="text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-slate-400">
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  {/* Pole z Logo */}
                  <div className="mt-4 flex h-20 items-center justify-center rounded-xl bg-slate-50 p-3 transition-colors group-hover:bg-slate-100/80 sm:mt-5 dark:bg-slate-800/60 dark:group-hover:bg-slate-800">
                    {partner.hasCustomLogo && partner.component ? (
                      partner.component
                    ) : partner.isAnonymous ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Trophy
                          className="h-9 w-9 stroke-[1.75]"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (partner as any).isTextOnly ? (
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <Building2
                          className="h-8 w-8 stroke-[1.75]"
                          aria-hidden="true"
                        />
                      </div>
                    ) : partner.logoSrc ? (
                      <img
                        src={partner.logoSrc}
                        alt={`Logo ${partner.name}`}
                        className="max-h-14 max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                        {partner.name}
                      </span>
                    )}
                  </div>

                  {/* Nazwa podmiotu */}
                  <h3 className="mt-3.5 text-base font-bold text-slate-950 transition-colors group-hover:text-emerald-700 sm:mt-4 dark:text-white dark:group-hover:text-emerald-400">
                    {partner.name}
                  </h3>

                  {/* Opis wsparcia */}
                  <p className="mt-1.5 text-xs leading-relaxed font-normal text-slate-700 dark:text-slate-300">
                    {partner.description}
                  </p>
                </div>

                {/* Stopka karty z linkiem / podziękowaniem */}
                {isClickable ? (
                  <div className="mt-4 flex items-center gap-1.5 border-t border-slate-200/80 pt-3 text-xs font-bold text-emerald-800 transition-colors group-hover:text-emerald-900 sm:mt-5 sm:pt-3.5 dark:border-slate-800 dark:text-emerald-300 dark:group-hover:text-emerald-200">
                    <span>{visitWebsite}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="mt-4 border-t border-slate-200/80 pt-3 text-[11px] font-semibold text-slate-600 sm:mt-5 sm:pt-3.5 dark:border-slate-800 dark:text-slate-300">
                    {f.permanentGratitude || "Trwała wdzięczność klubu"}
                  </div>
                )}
              </div>
            );

            if (isClickable && partner.url) {
              return (
                <a
                  key={partner.id}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/40"
                >
                  {CardContent}
                </a>
              );
            }

            return (
              <div
                key={partner.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90"
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
