"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Cookie,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Messages } from "@/lib/translations";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface CookieBannerProps {
  messages: Messages;
  isOpen: boolean;
  onClose: () => void;
}

export function CookieBanner({
  messages: t,
  isOpen,
  onClose,
}: CookieBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Stan poszczególnych kategorii
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const analyticsState = analytics ? "granted" : "denied";
    const marketingState = marketing ? "granted" : "denied";

    try {
      // 1. Zapis preferencji w localStorage
      const consentPreferences = {
        necessary: true,
        analytics,
        marketing,
        date: new Date().toISOString(),
      };
      localStorage.setItem(
        "roszada_consent_preferences",
        JSON.stringify(consentPreferences),
      );

      // 2. Ciasteczko dla layout.tsx
      const cookieValue = analytics ? "accepted" : "denied";
      document.cookie = `roszada_consent=${cookieValue}; max-age=31536000; path=/; SameSite=Lax`;

      // 3. Bezpośrednia aktualizacja w bibliotece Google Analytics
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: analyticsState,
          ad_storage: marketingState,
          ad_user_data: marketingState,
          ad_personalization: marketingState,
        });
      }

      // 4. Custom event dla layout.tsx
      window.dispatchEvent(
        new CustomEvent("consent-mode-update", {
          detail: {
            analytics_storage: analyticsState,
            ad_storage: marketingState,
            ad_user_data: marketingState,
            ad_personalization: marketingState,
          },
        }),
      );
    } catch {
      // Bezpieczny fallback dla trybu incognito przeglądarki
    }

    onClose();
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleRejectAll = () => {
    saveConsent(false, false);
  };

  const handleSaveSelected = () => {
    saveConsent(analyticsConsent, marketingConsent);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-live="polite"
      aria-label={t.cookies.ariaLabel}
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-lg rounded-2xl border border-border/80 bg-card/95 p-4 text-card-foreground shadow-2xl backdrop-blur-md transition-all sm:bottom-4 sm:left-auto sm:right-6 sm:p-5"
    >
      {/* Nagłówek banera */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 sm:h-9 sm:w-9 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Cookie className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {t.cookies.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleRejectAll}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t.lightbox.closeAria}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Opis banera */}
      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:mt-3">
        {t.cookies.text}
      </p>

      {/* Przełącznik widoku kategorii */}
      <div className="mt-2.5">
        <button
          type="button"
          onClick={() => setShowPreferences((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {showPreferences ? t.cookies.hideCategories : t.cookies.customize}
          </span>
          {showPreferences ? (
            <ChevronUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Panel kategorii */}
      {showPreferences && (
        <div className="mt-3 space-y-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs">
          {/* Niezbędne */}
          <div className="flex items-start justify-between gap-3">
            <div className="pr-2">
              <span className="font-semibold text-foreground">
                {t.cookies.necessaryTitle}
              </span>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                {t.cookies.necessaryDesc}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {t.cookies.necessaryBadge}
            </span>
          </div>

          {/* Analityczne */}
          <label className="flex cursor-pointer items-start justify-between gap-3 border-t border-border/40 pt-2">
            <div className="pr-2">
              <span className="font-semibold text-foreground">
                {t.cookies.analyticsTitle}
              </span>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                {t.cookies.analyticsDesc}
              </p>
            </div>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
          </label>

          {/* Marketingowe */}
          <label className="flex cursor-pointer items-start justify-between gap-3 border-t border-border/40 pt-2">
            <div className="pr-2">
              <span className="font-semibold text-foreground">
                {t.cookies.marketingTitle}
              </span>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                {t.cookies.marketingDesc}
              </p>
            </div>
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
          </label>
        </div>
      )}

      {/* Dolny pasek akcji */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-border/40 pt-3">
        <a
          href="/polityka-prywatnosci"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          <span>{t.cookies.learnMore}</span>
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>

        <div className="flex flex-wrap items-center gap-2">
          {showPreferences ? (
            <>
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t.cookies.rejectOptional}
              </button>
              <button
                type="button"
                onClick={handleSaveSelected}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.cookies.saveSelected}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t.cookies.rejectAll}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.cookies.acceptAll}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
