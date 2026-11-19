"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookMarked,
  Camera,
  ChevronDown,
  ChevronUp,
  Medal,
  Send,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { Messages } from "@/lib/translations";

interface AnniversarySectionProps {
  messages: Messages;
}

export function AnniversarySection({ messages: t }: AnniversarySectionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 1. Parsowanie listy członków klubu ze słownika
  const membersList = useMemo(() => {
    const raw =
      t.anniversary.hallOfFameMembers || t.anniversary.hallOfFameNames || "";
    return raw
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
  }, [t.anniversary.hallOfFameMembers, t.anniversary.hallOfFameNames]);

  // 2. Parsowanie listy działaczy, sędziów i trenerów ze słownika
  const personalitiesList = useMemo(() => {
    const raw = t.anniversary.hallOfFamePersonalities || "";
    return raw
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
  }, [t.anniversary.hallOfFamePersonalities]);

  const totalCount = membersList.length + personalitiesList.length;

  return (
    <section
      id="anniversary"
      className="relative overflow-hidden bg-gradient-to-b from-card/50 via-background to-background py-10 transition-colors sm:py-14 lg:py-16"
    >
      {/* 4 zlokalizowane kotwice (PL: #jubileusz, EN: #jubilee, DE: #jubilaeum, HU: #jubileum) */}
      <span
        id="jubileusz"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="jubilee"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="jubilaeum"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="jubileum"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      {/* Geometria szachowa i złote akcenty */}
      <div
        className="pointer-events-none absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl dark:bg-amber-400/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Nagłówek Jubileuszowy */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold tracking-wider text-amber-900 uppercase dark:border-amber-400/30 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.anniversary.eyebrow}</span>
          </div>

          <h2 className="mt-2.5 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.anniversary.title}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-amber-500">
              {t.anniversary.titleAccent}
            </span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-2xl text-sm text-muted-foreground sm:mt-3 sm:text-base">
            {t.anniversary.lead}
          </p>

          {/* Szybki skrót do Galerii Jubileuszowej */}
          <div className="mt-4 flex justify-center sm:mt-5">
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-card/90 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-xs transition-all hover:bg-amber-500/10 hover:shadow-sm dark:border-amber-400/40 dark:text-amber-300 dark:hover:bg-amber-400/10"
            >
              <Camera
                className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <span>
                {t.header.nav.gallery} · {t.hero.captionTitle}
              </span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Oś Czasu (Chronologia 2006–2026) */}
        <div className="relative mt-8 sm:mt-10 lg:mt-12">
          {/* Pionowa linia osi czasu */}
          <div
            className="absolute top-4 bottom-4 left-4 w-0.5 bg-gradient-to-b from-emerald-700 via-amber-500 to-emerald-700 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-4 sm:space-y-6 lg:space-y-7">
            {t.anniversary.timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={`${item.year}-${index}`}
                  className={`relative flex flex-col md:flex-row ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Punkt na osi */}
                  <div
                    className="absolute left-4 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-amber-400 to-amber-600 shadow-md sm:h-8 sm:w-8 md:left-1/2"
                    aria-hidden="true"
                  >
                    <Trophy className="h-3 w-3 text-slate-950 sm:h-3.5 sm:w-3.5" />
                  </div>

                  {/* Karta Osi Czasu */}
                  <div className="ml-10 md:ml-0 md:w-1/2 md:px-6 lg:px-8">
                    <div
                      className={`rounded-2xl border p-3.5 transition-all hover:shadow-lg sm:p-4.5 lg:p-5 ${
                        item.isCurrent
                          ? "border-amber-500/60 bg-gradient-to-br from-amber-500/10 via-card to-card shadow-md dark:border-amber-400/40"
                          : "border-border/70 bg-card/80 backdrop-blur-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-black text-amber-700 sm:text-lg lg:text-xl dark:text-amber-400">
                          {item.year}
                        </span>
                        <span className="rounded-full border border-border/80 bg-muted/80 px-2.5 py-0.5 text-[10px] font-bold text-foreground sm:text-[11px]">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm font-bold text-foreground sm:text-base">
                        {item.line1}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.line2}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Autorskie Książki Marka Niedźwieckiego */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 sm:h-10 sm:w-10 dark:bg-amber-400/10 dark:text-amber-300"
              aria-hidden="true"
            >
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground sm:text-lg lg:text-xl">
                {t.anniversary.booksTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t.anniversary.booksSubtitle}
              </p>
            </div>
          </div>

          <div className="mt-4.5 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {t.anniversary.books.map((book) => (
              <div
                key={book.title}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 shadow-xs transition-transform hover:-translate-y-0.5 hover:shadow-md sm:p-4"
              >
                <div>
                  <span className="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {book.tag}
                  </span>
                  <h4 className="mt-2 text-sm font-bold text-foreground">
                    {book.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {book.desc}
                  </p>
                </div>
                <div className="mt-3 border-t border-border/40 pt-2 text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                  {book.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Złota Tablica Twórców Klubu & Apel Monograficzny */}
        <div className="mt-9 rounded-2xl border border-border/80 bg-muted/30 p-4.5 sm:mt-11 sm:p-6 lg:mt-13 lg:p-7">
          <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-amber-800 uppercase dark:text-amber-400">
                <Medal className="h-4 w-4" aria-hidden="true" />
                <span>{t.anniversary.hallOfFameLabel}</span>
              </div>

              {/* Lista nazwisk: zwinięta lub rozwinięta w 2 grupach */}
              {!isExpanded ? (
                <h4 className="mt-2 text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                  {membersList.slice(0, 6).join(", ")}
                  {membersList.length > 6 && ", ..."}
                </h4>
              ) : (
                <div className="mt-3.5 space-y-3.5 sm:space-y-4">
                  {/* Grupa 1: Członkowie klubu */}
                  {membersList.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold tracking-wider text-emerald-800 uppercase dark:text-emerald-400">
                        {t.anniversary.hallOfFameMembersLabel ||
                          "♟️ Lista członków klubu"}
                      </h5>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {membersList.map((name, i) => (
                          <span
                            key={`member-${name}-${i}`}
                            className="shadow-2xs rounded-lg border border-border/70 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-emerald-600/50"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grupa 2: Radomscy zawodnicy, sędziowie, trenerzy i działacze */}
                  {personalitiesList.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold tracking-wider text-amber-800 uppercase dark:text-amber-400">
                        {t.anniversary.hallOfFamePersonalitiesLabel ||
                          "🏆 Radomscy zawodnicy, sędziowie, trenerzy i działacze"}
                      </h5>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {personalitiesList.map((name, i) => (
                          <span
                            key={`pers-${name}-${i}`}
                            className="shadow-2xs rounded-lg border border-border/70 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-amber-500/50"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Przycisk rozwiń / zwiń */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="shadow-2xs inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition-all hover:bg-amber-500/20 active:scale-95 dark:border-amber-400/30 dark:text-amber-300 dark:hover:bg-amber-400/20"
                  aria-expanded={isExpanded}
                >
                  <span>
                    {isExpanded
                      ? t.news.collapse
                      : `${t.tournaments.viewAll} (${totalCount})`}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              <p className="mt-2.5 text-xs text-muted-foreground">
                {t.anniversary.hallOfFameNote}
              </p>
            </div>

            {/* Apel o wspomnienia do Monografii XX-lecia */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 sm:p-4 lg:max-w-md">
              <div className="flex items-start gap-3">
                <Send
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-800 dark:text-amber-300"
                  aria-hidden="true"
                />
                <div className="text-xs">
                  <strong className="text-foreground">
                    {t.anniversary.monograph.title}
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    {t.anniversary.monograph.text}
                  </p>
                  <a
                    href="#contact"
                    className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    <span>{t.anniversary.monograph.cta}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
