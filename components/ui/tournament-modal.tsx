"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Check,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Printer,
  Shield,
  Trophy,
  X,
} from "lucide-react";
import type { Messages } from "@/lib/translations";

export type TournamentItem = Messages["tournaments"]["items"][number];

interface TournamentModalProps {
  tournament: TournamentItem | null;
  isOpen: boolean;
  onClose: () => void;
  messages: Messages;
}

export function TournamentModal({
  tournament,
  isOpen,
  onClose,
  messages: t,
}: TournamentModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Bezpieczne pobranie tłumaczeń z fallbackami
  const m = t?.tournaments?.modal ?? {
    regulationsTitle: "Komunikat Organizacyjny i Regulamin",
    quickFactsTitle: "Kluczowe informacje turniejowe",
    paceLabel: "Tempo gry",
    roundsLabel: "Liczba rund / System",
    feeLabel: "Wpisowe",
    arbiterLabel: "Sędzia główny",
    dateLabel: "Termin zawodów",
    locationLabel: "Miejsce gry",
    registerOnlineBtn: "Zgłoś się w serwisie turniejowym",
    contactClubBtn: "Zgłoszenie e-mail / Zapytaj klub",
    downloadPdfBtn: "Pobierz oficjalny PDF",
    printBtn: "Drukuj regulamin",
    closeBtn: "Zamknij",
    fullTextTitle: "Oficjalny Regulamin Turnieju",
    noRegulationsNotice:
      "Szczegółowy regulamin zostanie opublikowany wkrótce. Skontaktuj się z klubem w celu potwierdzenia udziału.",
    badgeOfficial: "OFICJALNY KOMUNIKAT PZSZACH / UKS ROSZADA",
    shareBtn: "Kopiuj link do turnieju",
    copiedBtn: "Skopiowano link!",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !tournament) return null;

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (tournament.id) {
      url.searchParams.set("turniej", tournament.id);
    }
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const parseInlineStyles = (text: string) => {
    // 1. Parsowanie linków markdown [tekst](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-emerald-700 underline decoration-emerald-500/50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {match[1]} ↗
        </a>,
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // 2. Parsowanie pogrubień **tekst**
    return parts.map((part, partIdx) => {
      if (typeof part !== "string") return part;

      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((sub, i) => {
        if (sub.startsWith("**") && sub.endsWith("**")) {
          return (
            <strong
              key={`${partIdx}-${i}`}
              className="font-bold text-foreground"
            >
              {sub.slice(2, -2)}
            </strong>
          );
        }
        return sub;
      });
    });
  };

  const renderMarkdown = (content?: string) => {
    if (!content) {
      return (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {m.noRegulationsNotice}
        </div>
      );
    }

    const lines = content.split("\n");
    return (
      <div className="space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          if (trimmed.startsWith("## ")) {
            return (
              <h3
                key={idx}
                className="mt-5 border-b border-border/60 pb-1 font-serif text-base font-bold text-foreground first:mt-0 sm:text-lg"
              >
                {trimmed.replace("## ", "")}
              </h3>
            );
          }

          if (trimmed.startsWith("- ")) {
            const rawText = trimmed.replace("- ", "");
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-1">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700 dark:bg-emerald-400" />
                <span className="flex-1">{parseInlineStyles(rawText)}</span>
              </div>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-1">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  {trimmed.match(/^\d+\./)?.[0]}
                </span>
                <span className="flex-1">
                  {parseInlineStyles(trimmed.replace(/^\d+\.\s*/, ""))}
                </span>
              </div>
            );
          }

          return <p key={idx}>{parseInlineStyles(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Wykrywanie czy turniej ma 1 link, czy 2 grupy rozdzielone znakiem "|"
  const rawUrls = (tournament.registrationUrl || "")
    .split("|")
    .map((u) => u.trim())
    .filter(Boolean);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tournament-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 lg:p-8"
    >
      {/* Tło / Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Kontener Okna Modala */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Pasek Górny */}
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{m.badgeOfficial}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title={m.shareBtn}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{m.copiedBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">{m.shareBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title={m.printBtn}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground hover:bg-accent cursor-pointer"
            >
              <Printer className="h-4 w-4 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={m.closeBtn}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground hover:bg-accent cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Zawartość Scrollowalna */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-800 to-emerald-950 text-white shadow-md sm:h-20 sm:w-20 dark:from-emerald-900 dark:to-zinc-950">
              <span className="text-xl font-black leading-none sm:text-2xl">
                {tournament.day}
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-wider text-amber-300 uppercase sm:text-[11px]">
                {tournament.month}
              </span>
              <span className="text-[9px] text-emerald-200/80 sm:text-[10px]">
                {tournament.year}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {tournament.tag}
                </span>
                {tournament.judge && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {tournament.judge}
                  </span>
                )}
              </div>

              <h2
                id="tournament-modal-title"
                className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              >
                {tournament.title}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                <span>{tournament.location}</span>
              </div>
            </div>
          </div>

          {/* Szybka pigułka */}
          <div className="mt-7">
            <h3 className="text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              {m.quickFactsTitle}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{m.paceLabel}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-foreground sm:text-sm">
                  {tournament.pace || "Wg komunikatu"}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{m.roundsLabel}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-foreground sm:text-sm">
                  {tournament.rounds || "Wg komunikatu"}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <Coins className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{m.feeLabel}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-foreground sm:text-sm">
                  {tournament.entryFee || "Zgodnie z reg."}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{m.dateLabel}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-foreground sm:text-sm">
                  {tournament.day} {tournament.month} {tournament.year}
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMICZNE PRZYCISKI ZGŁOSZEŃ (1 LUB 2 GRUPY) */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            {rawUrls.length >= 2 ? (
              <>
                <a
                  href={rawUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
                >
                  <span>Zgłoś się: Grupa A (ChessArbiter)</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={rawUrls[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 sm:text-sm"
                >
                  <span>Zgłoś się: Grupa B (ChessArbiter)</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            ) : rawUrls.length === 1 ? (
              <a
                href={rawUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
              >
                <span>{m.registerOnlineBtn}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>{m.contactClubBtn}</span>
              </a>
            )}
          </div>

          {/* Pełny Regulamin Organizacyjny */}
          <div className="mt-8 border-t border-border/80 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <h3 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                {m.fullTextTitle}
              </h3>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs">
              {renderMarkdown(tournament.regulationsMarkdown)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/80 bg-muted/30 px-5 py-3.5 sm:px-7">
          <span className="text-xs text-muted-foreground">
            UKS Roszada Radom · {tournament.year}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-accent cursor-pointer"
          >
            {m.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
