"use client";

import {
  ArrowUpRight,
  Globe2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Messages } from "@/lib/translations";
import { CLUB_CONTACT } from "@/lib/data/club";

interface ContactSectionProps {
  messages: Messages;
}

export function ContactSection({ messages: t }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-background to-slate-50 py-10 text-foreground transition-colors sm:scroll-mt-24 sm:py-12 lg:py-14 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-white"
    >
      {/* 4 zlokalizowane kotwice dla PL/DE (#kontakt), HU (#kapcsolat) oraz EN (#contact) */}
      <span
        id="kontakt"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="kapcsolat"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtelny szmaragdowy akcent w tle */}
      <div
        className="pointer-events-none absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Lewa kolumna: Nagłówek i Misja kontaktu */}
          <div className="flex flex-col lg:col-span-7">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-700/20 bg-emerald-700/10 px-3.5 py-1 text-xs font-bold tracking-widest text-emerald-800 uppercase dark:border-emerald-400/30 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.contact.eyebrow}</span>
            </div>

            <h2 className="mt-2.5 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl dark:text-white">
              {t.contact.title}{" "}
              <span className="bg-gradient-to-r from-emerald-700 to-amber-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-amber-300">
                {t.contact.titleAccent}
              </span>
            </h2>

            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base lg:text-lg dark:text-zinc-300">
              {t.contact.lead}
            </p>

            {/* Wizytówka z Herbem Radomia / Klubu */}
            <div className="mt-5 flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/80 p-3.5 backdrop-blur-xs sm:mt-6 sm:p-4 dark:border-white/10 dark:bg-white/5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted sm:h-14 sm:w-14 dark:border-white/10">
                <img
                  src="/branding/3.avif"
                  alt={t.header.brandSubtitle}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-1"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.add(
                      "hidden",
                    );
                  }}
                />
              </div>
              <div className="text-xs">
                <strong className="text-sm font-bold text-foreground dark:text-white">
                  {t.header.brandTitle}
                </strong>
                <p className="text-muted-foreground dark:text-zinc-400">
                  {t.header.brandSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Prawa kolumna: Oficjalne kanały komunikacji */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border/80 bg-card p-4.5 shadow-xl backdrop-blur-sm sm:p-6 lg:p-7 dark:border-white/10 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>{t.venues.contactTitle}</span>
              </div>

              <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                {/* E-mail */}
                <a
                  href={`mailto:${CLUB_CONTACT.email}`}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/60 p-3 transition-all hover:border-emerald-700 hover:bg-accent sm:p-3.5 dark:border-white/10 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 sm:h-10 sm:w-10 dark:bg-emerald-950 dark:text-emerald-300">
                      <Mail
                        className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase sm:text-[11px] dark:text-zinc-400">
                        {t.contact.emailLabel}
                      </span>
                      <div className="text-xs font-bold text-foreground sm:text-sm dark:text-white">
                        {CLUB_CONTACT.email}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                    aria-hidden="true"
                  />
                </a>

                {/* Telefon */}
                <a
                  href={`tel:${CLUB_CONTACT.phone}`}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/60 p-3 transition-all hover:border-emerald-700 hover:bg-accent sm:p-3.5 dark:border-white/10 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 sm:h-10 sm:w-10 dark:bg-amber-950 dark:text-amber-300">
                      <Phone
                        className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase sm:text-[11px] dark:text-zinc-400">
                        {t.contact.phoneLabel}
                      </span>
                      <div className="text-xs font-bold text-foreground sm:text-sm dark:text-white">
                        {CLUB_CONTACT.phoneDisplay || CLUB_CONTACT.phone}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                    aria-hidden="true"
                  />
                </a>

                {/* Facebook Fanpage */}
                <a
                  href={CLUB_CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/60 p-3 transition-all hover:border-emerald-700 hover:bg-accent sm:p-3.5 dark:border-white/10 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700 sm:h-10 sm:w-10 dark:bg-blue-950 dark:text-blue-300">
                      <Globe2
                        className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase sm:text-[11px] dark:text-zinc-400">
                        {t.contact.facebookLabel}
                      </span>
                      <div className="text-xs font-bold text-foreground sm:text-sm dark:text-white">
                        {t.footer.socialHandle}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
