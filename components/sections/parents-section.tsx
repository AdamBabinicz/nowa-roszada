"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  HeartHandshake,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { Messages } from "@/lib/translations";
import { CLUB_CONTACT } from "@/lib/data/club";

interface ParentsSectionProps {
  messages: Messages;
}

export function ParentsSection({ messages: t }: ParentsSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copiedKrs, setCopiedKrs] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const copyToClipboard = async (text: string, type: "krs" | "target") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "krs") {
        setCopiedKrs(true);
        setTimeout(() => setCopiedKrs(false), 2000);
      } else {
        setCopiedTarget(true);
        setTimeout(() => setCopiedTarget(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const donation = t.parents?.donation;

  const kicker = donation?.kicker || "1,5% Podatku dla dzieci";
  const title = donation?.title || "Wesprzyj UKS Roszada w rozliczeniu PIT";
  const lead = donation?.lead || "";
  const krsLabel = donation?.krsLabel || "Numer KRS";
  const targetLabel = donation?.targetLabel || "Cel szczegółowy PIT";
  const copyBtn = donation?.copyBtn || "Kopiuj";
  const copiedBtn = donation?.copiedBtn || "Skopiowano!";
  const entityName = donation?.entityName || "Uczniowski Klub Sportowy ROSZADA";

  return (
    <section
      id="parents"
      className="relative overflow-hidden bg-gradient-to-b from-card/40 via-background to-background py-10 transition-colors sm:py-14 lg:py-16"
    >
      {/* 4 zlokalizowane kotwice (PL: #rodzice / #rodzicow, DE: #eltern, HU: #szulok, EN: #parents) */}
      <span
        id="rodzice"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="rodzicow"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="eltern"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />
      <span
        id="szulok"
        className="absolute -top-24 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtelna poświata w tle */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Górna siatka: Tekst wprowadzający + FAQ */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* Lewa kolumna: Tytuł, opis i CTA bez pustki pionowej */}
          <div className="flex flex-col justify-start lg:col-span-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>{t.parents.eyebrow}</span>
              </div>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {t.parents.title}{" "}
                <span className="text-emerald-700 dark:text-emerald-400">
                  {t.parents.titleAccent}
                </span>
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
                {t.parents.lead}
              </p>
            </div>

            <div className="mt-6 border-t border-border/50 pt-5 sm:mt-7 sm:pt-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg sm:py-3 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <span>{t.parents.cta}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Prawa kolumna: FAQ */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/80 bg-card p-4.5 shadow-xs sm:p-6 lg:p-7">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                <span>{t.parents.eyebrow}</span>
              </div>

              <div className="mt-4 divide-y divide-border/60 sm:mt-5">
                {t.parents.faq.map((item, index) => {
                  const isOpen = openIndex === index;
                  const answerId = `faq-answer-${index}`;

                  return (
                    <div
                      key={item.question}
                      className="py-3 first:pt-0 last:pb-0 sm:py-3.5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        className="flex w-full items-center justify-between text-left text-sm font-bold text-foreground transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
                      >
                        <span className="pr-4">{item.question}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isOpen
                              ? "rotate-180 text-emerald-700 dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div
                          id={answerId}
                          className="mt-2 pr-4 text-xs leading-relaxed text-muted-foreground sm:pr-6"
                        >
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Dolna Karta: Moduł 1,5% PIT */}
        <div className="mt-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card p-4.5 shadow-lg backdrop-blur-xs sm:mt-10 sm:p-6 lg:mt-12 lg:p-7 dark:border-amber-400/20">
          <div className="grid items-center gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Opis i Nagłówek Wsparcia */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-400/30 dark:text-amber-300">
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                <span>{kicker}</span>
              </div>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {lead}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>{entityName}</span>
              </div>
            </div>

            {/* Dwa Pola z Przyciskami Kopiowania */}
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6">
              {/* Box 1: Numer KRS */}
              <div className="flex flex-1 flex-col justify-between rounded-2xl border border-border/80 bg-background/90 p-4 shadow-xs">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase sm:text-[11px]">
                    {krsLabel}
                  </span>
                  <div className="mt-1 font-mono text-base font-black tracking-wider text-foreground sm:text-lg">
                    {CLUB_CONTACT.krs}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(CLUB_CONTACT.krs, "krs")}
                  className={`mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:mt-4 ${
                    copiedKrs
                      ? "bg-emerald-700 text-white dark:bg-emerald-600"
                      : "border border-border/80 bg-muted/40 text-foreground hover:bg-accent"
                  }`}
                >
                  {copiedKrs ? (
                    <>
                      <Check
                        className="h-3.5 w-3.5 text-white"
                        aria-hidden="true"
                      />
                      <span>{copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>{copyBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Box 2: Cel Szczegółowy */}
              <div className="flex flex-1 flex-col justify-between rounded-2xl border border-border/80 bg-background/90 p-4 shadow-xs">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase sm:text-[11px]">
                    {targetLabel}
                  </span>
                  <div className="mt-1 font-mono text-sm font-black tracking-wide text-foreground break-words sm:text-base">
                    {CLUB_CONTACT.donationTarget}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(CLUB_CONTACT.donationTarget, "target")
                  }
                  className={`mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:mt-4 ${
                    copiedTarget
                      ? "bg-emerald-700 text-white dark:bg-emerald-600"
                      : "border border-border/80 bg-muted/40 text-foreground hover:bg-accent"
                  }`}
                >
                  {copiedTarget ? (
                    <>
                      <Check
                        className="h-3.5 w-3.5 text-white"
                        aria-hidden="true"
                      />
                      <span>{copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>{copyBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
