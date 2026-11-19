"use client";

import {
  ArrowUpRight,
  Headphones,
  Mic,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Volume2,
  Radio,
} from "lucide-react";
import type { Messages } from "@/lib/translations";

interface PartnerSectionProps {
  messages: Messages;
}

const CHESS_TACTICS_URL = "https://chesstactics-audio.netlify.app/";

export function PartnerSection({ messages: t }: PartnerSectionProps) {
  const p = t.partner;

  if (!p) return null;

  return (
    <section
      id="partner-project"
      className="relative overflow-hidden bg-gradient-to-b from-background via-emerald-950/5 to-background py-10 transition-colors sm:py-14 lg:py-16 dark:from-background dark:via-emerald-950/20 dark:to-background"
      aria-labelledby="partner-project-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-2xl sm:p-10 lg:p-12">
          {/* Efekty świetlne tła */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Lewa kolumna: Treść, Badge i Link */}
            <div className="lg:col-span-7">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-900/60 px-3 py-1 text-xs font-bold tracking-wider text-emerald-300 uppercase">
                  <Sparkles
                    className="h-3.5 w-3.5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{p.featureProject}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-amber-400"
                    aria-hidden="true"
                  />
                  <span>{p.radomBadge}</span>
                </span>
              </div>

              {/* Nagłówek */}
              <h2
                id="partner-project-heading"
                className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                {p.title}{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  {p.titleAccent}
                </span>
              </h2>

              {/* Opis */}
              <p className="mt-3.5 text-sm leading-relaxed text-slate-200 sm:text-base">
                {p.lead}
              </p>

              {/* Cechy aplikacji */}
              <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  <Headphones
                    className="h-3.5 w-3.5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{p.featureBlindfold}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  <Volume2
                    className="h-3.5 w-3.5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{p.featureAudio}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  <Smartphone
                    className="h-3.5 w-3.5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{p.appNote}</span>
                </span>
              </div>

              {/* Przycisk CTA */}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={CHESS_TACTICS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/60 transition-all duration-200 hover:scale-[1.02] hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-900/80"
                >
                  <span>{p.cta}</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
                <span className="text-xs font-medium text-emerald-200/80">
                  {p.appSubtitle}
                </span>
              </div>
            </div>

            {/* Prawa kolumna: Wizualna karta interfejsu (100% kluczy ze słownika, zero sztywnych tekstów) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5 shadow-inner backdrop-blur-xs sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                      {p.featureAudio}
                    </span>
                  </div>
                  <span className="rounded-md border border-emerald-500/40 bg-emerald-950/70 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                    {p.radomBadge}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3.5 text-slate-200">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
                      <Volume2
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{p.featureBlindfold}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {p.lead}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-emerald-800/40 bg-emerald-950/40 p-3 text-emerald-200">
                    <div className="flex items-center gap-2">
                      <Radio
                        className="h-4 w-4 text-emerald-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-xs">
                        {p.appSubtitle}
                      </span>
                    </div>
                    <Mic
                      className="h-4 w-4 text-teal-300 shrink-0"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="rounded-lg border border-emerald-700/50 bg-emerald-900/30 p-2.5 text-center font-bold text-emerald-300 text-xs">
                    {p.appNote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
