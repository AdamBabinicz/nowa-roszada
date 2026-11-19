"use client";

import {
  ArrowUpRight,
  Clock,
  Compass,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { Messages } from "@/lib/translations";
import { CLUB_CONTACT, CLUB_VENUES } from "@/lib/data/club";

interface VenuesSectionProps {
  messages: Messages;
}

export function VenuesSection({ messages: t }: VenuesSectionProps) {
  return (
    <section
      id="venues"
      className="relative scroll-mt-20 overflow-hidden bg-background py-10 transition-colors sm:scroll-mt-24 sm:py-14 lg:py-16"
    >
      {/* 4 zlokalizowane kotwice dla PL (#treningi), DE (#trainings), HU (#edzesek) oraz EN (#venues) */}
      <span
        id="treningi"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="trainings"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="edzesek"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtelny szmaragdowy blask w tle */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Nagłówek Sekcji */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>{t.venues.eyebrow}</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.venues.title}{" "}
              <span className="text-emerald-700 dark:text-emerald-400">
                {t.venues.titleAccent}
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-2.5 sm:text-base">
              {t.venues.leadLines.join(" ")}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700/30 bg-emerald-50/50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100/70 sm:px-4 sm:py-2.5 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            >
              <span>{t.venues.cardLink}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 3 Autentyczne Sale UKS Roszada Radom */}
        <div className="mt-7 grid gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {CLUB_VENUES.map((venue, index) => {
            const isMain = index === 0;
            return (
              <article
                key={venue.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5.5 lg:p-6 ${
                  isMain
                    ? "border-emerald-700/50 bg-gradient-to-b from-emerald-50/80 to-background shadow-md dark:border-emerald-600/40 dark:from-emerald-950/30 dark:to-card"
                    : "border-border/70 bg-card/60 backdrop-blur-xs hover:border-emerald-600/30"
                }`}
              >
                <div>
                  {/* Górny wiersz: Numer & Badge o podwyższonym kontraście */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 bg-muted/80 text-xs font-black text-foreground transition-colors group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white sm:h-8 sm:w-8">
                      0{index + 1}
                    </span>
                    {venue.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:border-amber-400/20 dark:text-amber-300">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        {venue.badge}
                      </span>
                    )}
                  </div>

                  {/* Nazwa sali i opis */}
                  <h3 className="mt-3 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-700 sm:mt-3.5 sm:text-lg lg:text-xl dark:group-hover:text-emerald-400">
                    {venue.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {venue.subtitle}
                  </p>

                  {/* Adres i Harmonogram */}
                  <div className="mt-4 space-y-2 border-t border-border/50 pt-3 text-xs sm:mt-4.5 sm:pt-3.5">
                    <div className="flex items-start gap-2.5 text-muted-foreground">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="font-semibold text-foreground">
                          {venue.address}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {venue.postalCode}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Clock
                        className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-foreground">
                        {venue.schedule}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Link do zapisu */}
                <div className="mt-4 border-t border-border/40 pt-3 sm:mt-4.5 sm:pt-3.5">
                  <a
                    href="#contact"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-background/80 py-2 text-xs font-bold text-foreground transition-colors group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white dark:group-hover:border-emerald-600 dark:group-hover:bg-emerald-600"
                  >
                    <span>{t.venues.cardLink}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pasek Szybkiego Kontaktu Klubowego */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-muted/40 p-4 backdrop-blur-xs sm:mt-10 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white dark:bg-emerald-600">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {t.venues.contactTitle}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t.venues.contactStripText}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold sm:gap-3">
              <a
                href={`tel:${CLUB_CONTACT.phone}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-foreground transition-colors hover:bg-accent sm:px-3.5 sm:py-2"
              >
                <Phone
                  className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span>{CLUB_CONTACT.phoneDisplay || CLUB_CONTACT.phone}</span>
              </a>

              <a
                href={`mailto:${CLUB_CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-foreground transition-colors hover:bg-accent sm:px-3.5 sm:py-2"
              >
                <Mail
                  className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span>{CLUB_CONTACT.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
