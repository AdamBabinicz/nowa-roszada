"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import type { Messages } from "@/lib/translations";
import {
  TournamentModal,
  type TournamentItem,
} from "@/components/ui/tournament-modal";

interface TournamentsSectionProps {
  messages: Messages;
}

export function TournamentsSection({ messages: t }: TournamentsSectionProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [activeTournament, setActiveTournament] =
    useState<TournamentItem | null>(null);
  const [dbTournaments, setDbTournaments] = useState<Record<string, any>>({});

  const filterOptions = [
    { label: t.tournaments.filterAll, key: "ALL" },
    { label: t.tournaments.filterMemorials, key: "memorial" },
    { label: t.tournaments.filterLeague, key: "liga" },
    { label: t.tournaments.filterPzszach, key: "klasyfikacyjny" },
  ];

  // Pobieranie aktualnych regulaminów i danych z bazy Neon
  useEffect(() => {
    let isMounted = true;

    async function fetchTournamentsFromDb() {
      try {
        const res = await fetch("/api/tournaments");
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && isMounted) {
          const map: Record<string, any> = {};
          json.data.forEach((item: any) => {
            if (item.slug) {
              map[item.slug] = item;
            }
          });
          setDbTournaments(map);
        }
      } catch (err) {
        console.warn("Nie udało się pobrać danych turniejów z bazy Neon:", err);
      }
    }

    fetchTournamentsFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  // Połączenie danych ze słownika z najnowszymi regulaminami z bazy Neon
  const mergedTournaments = useMemo(() => {
    return t.tournaments.items.map((item) => {
      const fromDb = item.id ? dbTournaments[item.id] : null;
      if (!fromDb) return item;

      return {
        ...item,
        title: fromDb.title || item.title,
        location: fromDb.location || item.location,
        judge: fromDb.judge || item.judge,
        pace: fromDb.pace || item.pace,
        rounds: fromDb.rounds || item.rounds,
        entryFee: fromDb.entry_fee || item.entryFee,
        registrationUrl: fromDb.registration_url || item.registrationUrl,
        regulationsMarkdown:
          fromDb.regulations_markdown || item.regulationsMarkdown,
      };
    });
  }, [t.tournaments.items, dbTournaments]);

  const filteredTournaments = useMemo(() => {
    if (filter === "ALL") return mergedTournaments;
    return mergedTournaments.filter((item) => item.category === filter);
  }, [filter, mergedTournaments]);

  // Obsługa otwarcia modala i aktualizacja URL
  const handleOpenTournament = (tournament: TournamentItem) => {
    setActiveTournament(tournament);

    if (typeof window !== "undefined" && tournament.id) {
      const url = new URL(window.location.href);
      url.searchParams.set("turniej", tournament.id);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleCloseModal = () => {
    setActiveTournament(null);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("turniej");
      window.history.pushState({}, "", url.toString());
    }
  };

  return (
    <section
      id="tournaments"
      className="relative scroll-mt-20 overflow-hidden bg-background py-10 transition-colors sm:scroll-mt-24 sm:py-14 lg:py-16"
    >
      <span
        id="turnieje"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="turniere"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="versenyek"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>{t.tournaments.eyebrow}</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.tournaments.title}{" "}
              <span className="text-emerald-700 dark:text-emerald-400">
                {t.tournaments.titleAccent}
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-2.5 sm:text-base">
              {t.tournaments.subtitle}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>{t.tournaments.viewAll}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-6 -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2.5 sm:mx-0 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:border-b sm:border-border/50 sm:px-0 sm:pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {filterOptions.map((opt) => {
            const isActive = filter === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFilter(opt.key)}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                    : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3 sm:mt-7 sm:space-y-4">
          {filteredTournaments.map((tournament, idx) => (
            <div
              key={`${tournament.title}-${idx}`}
              className={`group flex flex-col justify-between gap-3.5 rounded-2xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:gap-4 sm:p-5 lg:p-6 ${
                tournament.isFeatured
                  ? "border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-card to-card shadow-md dark:border-amber-400/30"
                  : "border-border/70 bg-card/60 backdrop-blur-xs hover:border-emerald-700/40 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-emerald-800 to-emerald-950 text-white shadow-sm sm:h-16 sm:w-16 dark:from-emerald-900 dark:to-zinc-950">
                  <span className="text-lg font-black leading-none sm:text-xl">
                    {tournament.day}
                  </span>
                  <span className="mt-0.5 text-[9px] font-bold tracking-wider text-amber-300 uppercase sm:text-[10px]">
                    {tournament.month}
                  </span>
                  <span className="text-[8px] text-emerald-200/80 sm:text-[9px]">
                    {tournament.year}
                  </span>
                </div>

                {tournament.image && (
                  <div className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-amber-500/30 shadow-xs sm:block">
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {tournament.tag}
                    </span>
                    {tournament.judge && (
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {tournament.judge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 text-base font-bold text-foreground transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400 sm:text-lg">
                    {tournament.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin
                      className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    <span className="truncate">{tournament.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-1 sm:pt-0 sm:shrink-0 sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenTournament(tournament)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-bold text-foreground shadow-xs transition-colors hover:border-emerald-700 hover:bg-emerald-700 hover:text-white sm:w-auto sm:py-2.5 dark:hover:border-emerald-600 dark:hover:bg-emerald-600 cursor-pointer"
                  aria-label={`${tournament.title} - ${t.tournaments.signupCta}`}
                >
                  <span>{t.tournaments.signupCta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TournamentModal
        tournament={activeTournament}
        isOpen={Boolean(activeTournament)}
        onClose={handleCloseModal}
        messages={t}
      />
    </section>
  );
}
