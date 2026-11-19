"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  Filter,
  GraduationCap,
  MapPin,
  School,
  UserCheck,
} from "lucide-react";
import type { Messages } from "@/lib/translations";
import { SCHOOL_SECTIONS } from "@/lib/data/club";

interface SchoolsSectionProps {
  messages: Messages;
}

export function SchoolsSection({ messages: t }: SchoolsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const filteredSchools = useMemo(() => {
    if (activeFilter === "ALL") return SCHOOL_SECTIONS;
    return SCHOOL_SECTIONS.filter(
      (school) => school.filterKey === activeFilter,
    );
  }, [activeFilter]);

  const filterOptions = useMemo(() => {
    const uniqueSections = Array.from(
      new Map(SCHOOL_SECTIONS.map((s) => [s.filterKey, s.name])).entries(),
    );
    return [
      { label: t.schools.filterAll, key: "ALL" },
      ...uniqueSections.map(([key, label]) => ({ label, key })),
    ];
  }, [t.schools.filterAll]);

  const getCardSpan = (index: number, total: number) => {
    if (total === 5) {
      return index < 3 ? "lg:col-span-2" : "lg:col-span-3";
    }
    if (total === 1) {
      return "lg:col-span-6 max-w-xl mx-auto w-full";
    }
    return "lg:col-span-2";
  };

  return (
    <section
      id="schools"
      className="relative scroll-mt-20 overflow-hidden bg-background py-10 transition-colors sm:scroll-mt-24 sm:py-14 lg:py-16"
    >
      {/* 4 wielojęzyczne kotwice (PL: #szkoly, EN: #schools, DE: #schulen, HU: #iskolak) */}
      <span
        id="szkoly"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="schulen"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="iskolak"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Nagłówek Sekcji */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              <School className="h-4 w-4" aria-hidden="true" />
              <span>{t.schools.eyebrow}</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.schools.title}{" "}
              <span className="text-emerald-700 dark:text-emerald-400">
                {t.schools.titleAccent}
              </span>
            </h2>
            <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
              {t.schools.leadLines.join(" ")}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-muted/60 px-3.5 py-1.5 text-xs font-semibold text-foreground sm:px-4 sm:py-2">
              <GraduationCap
                className="h-4 w-4 text-emerald-700 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>{t.schools.schoolBadge}</span>
            </span>
          </div>
        </div>

        {/* Pasek Filtrów */}
        <div className="mt-6 -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:border-b sm:border-border/50 sm:px-0 sm:pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-bold text-foreground">
            <Filter
              className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span>{t.schools.filterLabel}</span>
          </div>

          {filterOptions.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setActiveFilter(option.key)}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600"
                    : "border border-border/70 bg-muted/50 text-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Siatka Szkół */}
        <div className="mt-6 grid gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6 lg:gap-6">
          {filteredSchools.map((school, index) => (
            <article
              key={school.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-4.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-700/40 hover:shadow-xl sm:p-5.5 lg:p-6 dark:hover:border-emerald-500/40 ${getCardSpan(
                index,
                filteredSchools.length,
              )}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 bg-muted/80 text-xs font-black text-foreground transition-colors group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white sm:h-8 sm:w-8">
                    0{index + 1}
                  </span>
                  {!school.hideClubBadge && (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {school.badge || t.header.brandTitle}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-base font-bold tracking-tight text-foreground transition-colors sm:mt-4 sm:text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  {school.name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground sm:mt-2.5">
                  <UserCheck
                    className="h-3.5 w-3.5 text-emerald-700 sm:h-4 sm:w-4 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>
                    {t.schools.trainerLabel} {school.trainer}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 border-t border-border/40 pt-3 text-xs text-muted-foreground sm:mt-4 sm:space-y-2 sm:pt-3.5">
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{school.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock
                      className="h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-foreground">
                      {school.schedule}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-border/40 pt-3 sm:mt-5 sm:pt-3.5">
                <a
                  href="#contact"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-muted/30 py-2 text-xs font-bold text-foreground transition-colors group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white dark:group-hover:border-emerald-600 dark:group-hover:bg-emerald-600"
                >
                  <span>{t.schools.cardLink}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
