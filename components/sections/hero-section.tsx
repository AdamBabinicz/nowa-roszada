"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  BookText,
  Brain,
  Landmark,
  Quote,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { Language, Messages } from "@/lib/translations";
import { CLUB_CONTACT } from "@/lib/data/club";

interface HeroSectionProps {
  messages: Messages;
  currentLanguage?: Language;
}

// Zlokalizowane kotwice dla każdego z 4 języków
const SECTION_ANCHORS: Record<
  Language,
  { schools: string; tournaments: string }
> = {
  PL: { schools: "#szkoly", tournaments: "#turnieje" },
  EN: { schools: "#schools", tournaments: "#tournaments" },
  DE: { schools: "#schulen", tournaments: "#turniere" },
  HU: { schools: "#iskolak", tournaments: "#versenyek" },
};

export function HeroSection({
  messages: t,
  currentLanguage,
}: HeroSectionProps) {
  const activeLang: Language = currentLanguage || "PL";
  const anchors = SECTION_ANCHORS[activeLang] || SECTION_ANCHORS.PL;

  // Manifest i dane autora
  const authorName: string = t.manifesto?.authorName || "Marek Niedźwiecki";
  const authorInitials: string = authorName
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  const authorRole: string = t.manifesto?.authorRole || "";
  const kicker: string = t.manifesto?.kicker || "";
  const quote: string = t.manifesto?.quote || "";
  const quoteAccent: string = t.manifesto?.quoteAccent || "";
  const sideText: string = t.manifesto?.sideText || "";

  const memorialLinkText: string =
    t.manifesto?.memorialLink || t.anniversary?.cta || "";
  const lichessLinkText: string = t.manifesto?.lichessLink || "Lichess";

  const psychologyBlogUrl: string =
    CLUB_CONTACT.psychologyBlogUrl ||
    "https://psychologiaiszachy.blogspot.com/";
  const churchChessUrl: string =
    CLUB_CONTACT.churchChessUrl ||
    "https://smpd.pl/kosciol-na-zachodzie-a-szachy/";
  const chessCultureUrl: string =
    ((CLUB_CONTACT as Record<string, unknown>).chessCultureUrl as string) ||
    "https://www.facebook.com/KKSzachowej";

  const psychologyBlogLabel: string =
    t.manifesto?.psychologyBlogLink || "Psychologia i Szachy";
  const churchChessLabel: string =
    t.manifesto?.churchChessLink || "Kościół na Zachodzie a szachy";
  const chessCultureLabel: string =
    ((t.manifesto as Record<string, unknown>)?.chessCultureLink as string) ||
    "Kapituła Kultury Szachowej";

  // Przyciski CTA
  const findSectionLabel: string = t.hero?.actions?.findSection || "";
  const tournamentsLabel: string = t.hero?.actions?.tournaments || "";

  // Statystyki z pliku językowego
  const statsList = t.hero?.stats || [];

  // Portret i opisy wizualne
  const visualAlt: string = t.hero?.visualAlt || authorName;
  const stampNumber: string = t.hero?.stampNumber || "20";
  const stampText: string = t.hero?.stampText || "";
  const prezidentCaption: string = t.hero?.prezidentCaption || "";
  const captionTitle: string = t.hero?.captionTitle || "";
  const captionIndex: string = t.hero?.captionIndex || "01 / 04";
  const leadText: string = t.hero?.lead || "";

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-background to-background pt-5 pb-6 transition-colors sm:pt-8 sm:pb-8 lg:pt-10 lg:pb-10 dark:from-emerald-950/25 dark:via-background dark:to-background"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        aria-hidden="true"
      >
        <div className="h-full w-full bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Lewa kolumna: Teksty i Zlokalizowane Przyciski CTA */}
          <div className="flex flex-col lg:col-span-7">
            {t.hero?.eyebrow && (
              <div className="mb-3 inline-flex items-center gap-2 self-start rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold tracking-wide text-amber-800 dark:border-amber-400/30 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.hero.eyebrow}</span>
              </div>
            )}

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.hero?.title}{" "}
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-amber-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-amber-400">
                {t.hero?.titleAccent}
              </span>
            </h1>

            <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {leadText}
            </p>

            {/* Przyciski CTA */}
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4">
              {findSectionLabel && (
                <a
                  href={anchors.schools}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition-all hover:bg-emerald-800 hover:shadow-xl sm:py-3.5 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  <span>{findSectionLabel}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}

              {tournamentsLabel && (
                <a
                  href={anchors.tournaments}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-xs transition-colors hover:bg-accent sm:py-3.5"
                >
                  <span>{tournamentsLabel}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>

            {statsList.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 sm:mt-8 sm:gap-6 sm:pt-5">
                {statsList.map((stat, idx) => (
                  <div key={stat.label || idx} className="flex flex-col">
                    <span className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prawa kolumna: Portret Prezesa (Zoptymalizowany pod LCP) */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card to-card/60 p-2 shadow-2xl backdrop-blur-sm sm:max-w-sm sm:p-2.5 lg:max-w-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted">
                <Image
                  src="/hero/niedz.avif"
                  alt={visualAlt}
                  width={400}
                  height={500}
                  priority
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 420px"
                  className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-102"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 right-3 flex flex-col items-center justify-center rounded-2xl border border-amber-400/40 bg-black/60 px-2.5 py-1 text-center text-amber-300 shadow-xl backdrop-blur-md sm:px-3 sm:py-1.5">
                  <span className="text-lg font-black leading-none sm:text-xl">
                    {stampNumber}
                  </span>
                  <span className="text-[9px] font-bold tracking-wider uppercase sm:text-[10px]">
                    {stampText}
                  </span>
                </div>

                <div className="absolute right-3.5 bottom-3.5 left-3.5 text-white sm:right-4 sm:bottom-4 sm:left-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 sm:gap-2">
                    <Trophy
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{authorName}</span>
                  </div>
                  {prezidentCaption && (
                    <p className="mt-0.5 text-xs font-medium text-white/90">
                      {prezidentCaption}
                    </p>
                  )}
                </div>
              </div>

              {(captionTitle || captionIndex) && (
                <div className="mt-2 flex items-center justify-between px-2 text-xs text-muted-foreground sm:mt-2.5">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {captionTitle}
                  </span>
                  <span>{captionIndex}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dolna Karta: Manifest Ideowy */}
        <div className="mt-6 rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-4 text-white shadow-xl sm:mt-8 sm:p-6 lg:mt-10 lg:p-8 dark:border-emerald-800/30">
          <div className="grid gap-5 md:grid-cols-12 md:gap-7">
            <div className="md:col-span-6">
              {kicker && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-amber-400 uppercase">
                  <Quote className="h-4 w-4" aria-hidden="true" />
                  <span>{kicker}</span>
                </div>
              )}

              <blockquote className="mt-2 text-lg font-black tracking-tight sm:mt-2.5 sm:text-2xl lg:text-3xl">
                „{quote} <span className="text-amber-300">{quoteAccent}”</span>
              </blockquote>

              <div className="mt-3.5 flex items-center gap-3 border-t border-white/10 pt-3.5 sm:mt-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 font-bold text-amber-300 ring-2 ring-amber-400/40 sm:h-10 sm:w-10"
                  aria-hidden="true"
                >
                  {authorInitials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {authorName}
                  </div>
                  {authorRole && (
                    <div className="text-xs text-emerald-200/80">
                      {authorRole}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 pt-3.5 md:col-span-6 md:border-t-0 md:border-l md:pt-0 md:pl-7">
              <p className="text-sm leading-relaxed text-emerald-100/90">
                {sideText}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-2.5">
                {/* 1. Memoriał */}
                {CLUB_CONTACT.memorialUrl && memorialLinkText && (
                  <a
                    href={CLUB_CONTACT.memorialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-white/10 p-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen
                        className="h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{memorialLinkText}</span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}

                {/* 2. Blog Psychologia i Szachy */}
                {psychologyBlogUrl && psychologyBlogLabel && (
                  <a
                    href={psychologyBlogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-white/10 p-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <Brain
                        className="h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">
                        {psychologyBlogLabel}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}

                {/* 3. Kościół na Zachodzie a szachy */}
                {churchChessUrl && churchChessLabel && (
                  <a
                    href={churchChessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-white/10 p-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <BookText
                        className="h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{churchChessLabel}</span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}

                {/* 4. Lichess */}
                {CLUB_CONTACT.lichessUrl && lichessLinkText && (
                  <a
                    href={CLUB_CONTACT.lichessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-white/10 p-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <Users
                        className="h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{lichessLinkText}</span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}

                {/* 5. Kapituła Kultury Szachowej */}
                {chessCultureUrl && chessCultureLabel && (
                  <a
                    href={chessCultureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-white/10 p-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <span className="flex items-center gap-2">
                      <Landmark
                        className="h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{chessCultureLabel}</span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
