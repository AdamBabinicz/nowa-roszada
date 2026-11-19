"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ArrowRight,
  Calendar,
  MapPin,
  GraduationCap,
  Newspaper,
  Camera,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  type Language,
  type Messages,
  getTranslations,
} from "@/lib/translations";

interface HeaderProps {
  currentLanguage?: Language;
  currentLang?: Language;
  onLanguageChange?: (newLang: Language) => void;
  messages?: Messages;
}

export function Header({
  currentLanguage,
  currentLang,
  onLanguageChange,
  messages,
}: HeaderProps) {
  const activeLangProp = currentLanguage || currentLang;
  const [lang, setLang] = useState<Language>(
    activeLangProp || DEFAULT_LANGUAGE,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Oficjalna obsługa trybu ciemnego przez next-themes
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Synchronizacja języka
  useEffect(() => {
    if (activeLangProp) {
      setLang(activeLangProp);
    }
  }, [activeLangProp]);

  // Cień belki przy scrollowaniu
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Zamknięcie menu języków przy kliknięciu poza
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (newLang: Language) => {
    setLang(newLang);
    setIsLangDropdownOpen(false);
    try {
      localStorage.setItem("roszada_lang", String(newLang));
    } catch {}
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      window.dispatchEvent(
        new CustomEvent("roszada_lang_change", { detail: newLang }),
      );
    }
  };

  const t = messages || getTranslations(lang);
  const langKey = String(lang || "PL").toUpperCase() as Language;

  // W 100% zlokalizowana mapa identyfikatorów URL dla każdego z 4 języków
  const sectionIds = {
    PL: {
      news: "aktualnosci",
      schools: "szkoly",
      venues: "treningi",
      tournaments: "turnieje",
      gallery: "galeria",
      contact: "kontakt",
    },
    EN: {
      news: "news",
      schools: "schools",
      venues: "venues",
      tournaments: "tournaments",
      gallery: "gallery",
      contact: "contact",
    },
    DE: {
      news: "aktuelles",
      schools: "schulen",
      venues: "trainings",
      tournaments: "turniere",
      gallery: "galerie",
      contact: "kontakt",
    },
    HU: {
      news: "hirek",
      schools: "iskolak",
      venues: "edzesek",
      tournaments: "versenyek",
      gallery: "fotok",
      contact: "kapcsolat",
    },
  }[langKey] || {
    news: "aktualnosci",
    schools: "szkoly",
    venues: "treningi",
    tournaments: "turnieje",
    gallery: "galeria",
    contact: "kontakt",
  };

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targets: string[],
    fallbackKeyword?: string,
  ) => {
    setIsMobileMenuOpen(false);
    setIsLangDropdownOpen(false);

    if (typeof window === "undefined" || window.location.pathname !== "/") {
      return;
    }

    for (const target of targets) {
      const cleanId = target.replace("#", "");
      const el = document.getElementById(cleanId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const currentUrl = new URL(window.location.href);
        currentUrl.hash = cleanId;
        window.history.pushState(null, "", currentUrl.toString());
        return;
      }
    }

    if (fallbackKeyword) {
      const sections = Array.from(
        document.querySelectorAll("section, article, main > div"),
      );
      for (const sec of sections) {
        const text = sec.textContent?.toLowerCase() || "";
        if (text.includes(fallbackKeyword.toLowerCase())) {
          e.preventDefault();
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
    }
  };

  const navLinks = [
    {
      href: `#${sectionIds.news}`,
      targets: [sectionIds.news, "aktualnosci", "news", "aktuelles", "hirek"],
      keyword: "z życia klubu",
      label: t?.news?.title || "Aktualności",
      icon: Newspaper,
    },
    {
      href: `#${sectionIds.schools}`,
      targets: [sectionIds.schools, "szkoly", "schools", "schulen", "iskolak"],
      keyword: "szkołach",
      label: t?.header?.nav?.schools || "Szkoły",
      icon: GraduationCap,
    },
    {
      href: `#${sectionIds.venues}`,
      targets: [
        sectionIds.venues,
        "treningi",
        "venues",
        "trainings",
        "edzesek",
      ],
      keyword: "harmonogram",
      label: t?.header?.nav?.venues || "Treningi",
      icon: MapPin,
    },
    {
      href: `#${sectionIds.tournaments}`,
      targets: [
        sectionIds.tournaments,
        "turnieje",
        "tournaments",
        "turniere",
        "versenyek",
      ],
      keyword: "turniej",
      label: t?.header?.nav?.tournaments || "Turnieje",
      icon: Calendar,
    },
    {
      href: `#${sectionIds.gallery}`,
      targets: [sectionIds.gallery, "galeria", "gallery", "galerie", "fotok"],
      keyword: "fotoreportaż",
      label: t?.header?.nav?.gallery || "Foto",
      icon: Camera,
    },
    {
      href: `#${sectionIds.contact}`,
      targets: [sectionIds.contact, "kontakt", "contact", "kapcsolat"],
      keyword: "kontakt",
      label: t?.footer?.links?.contact || "Kontakt",
      icon: Mail,
    },
  ];

  const announcementTarget = `#${sectionIds.schools}`;
  const brandName = t?.header?.brandTitle || "UKS ROSZADA";
  const brandSub = t?.header?.brandSubtitle || "RADOM · 20 LAT";
  const signupLabel = t?.header?.signup || "Zapisz dziecko";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md transition-colors duration-200 dark:bg-zinc-950/95">
        {/* Pasek ogłoszeń */}
        {t?.announcement?.text && (
          <div className="bg-emerald-950 px-3 py-1.5 text-[11px] text-emerald-100 sm:text-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-center text-center">
              <a
                href={announcementTarget}
                onClick={(e) =>
                  handleScrollTo(
                    e,
                    [sectionIds.schools, "szkoly", "schools"],
                    "szkołach",
                  )
                }
                className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-white truncate"
              >
                <span className="font-bold text-amber-400 shrink-0">♟</span>
                <span className="truncate">{t.announcement.text}</span>
                <ArrowRight className="ml-0.5 h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>
        )}

        <div
          className={`border-b border-zinc-200/80 transition-all duration-200 dark:border-zinc-800 ${
            isScrolled ? "py-2 shadow-sm sm:py-2.5" : "py-2 sm:py-3"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
            <Link
              href="/"
              prefetch={false}
              className="group flex min-w-0 shrink items-center gap-2 sm:gap-3"
              aria-label={t?.header?.brandAria || brandName}
            >
              {/* Logo klubu zoptymalizowane pod LCP i rozmiar (Next.js Image) */}
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 p-0.5 shadow-xs sm:h-9 sm:w-9 dark:border-zinc-700 dark:bg-zinc-800">
                <Image
                  src="/branding/logo.avif"
                  alt={brandName}
                  width={36}
                  height={36}
                  priority
                  sizes="36px"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-sm font-black tracking-tight text-zinc-900 transition-colors sm:text-base group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                    {brandName}
                  </span>
                  <span className="hidden rounded-md border border-amber-300/80 bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 xs:inline-flex sm:text-[10px] dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-300">
                    2006–2026
                  </span>
                </div>
                <p className="truncate text-[10px] font-semibold tracking-wider text-emerald-800 uppercase sm:text-[11px] dark:text-emerald-400">
                  {brandSub}
                </p>
              </div>
            </Link>

            {/* Menu Desktop */}
            <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.targets, item.keyword)}
                  className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-emerald-50/70 hover:text-emerald-900 dark:text-zinc-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Przełącznik motywu */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={t?.header?.themeToggleAria || "Zmień motyw"}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-100 sm:h-9 sm:w-9 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-zinc-600" />
                )}
              </button>

              {/* Wybór języka */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  aria-expanded={isLangDropdownOpen}
                  aria-label={
                    t?.header?.languageSwitcherAria || "Wybierz język"
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100/90 px-2 py-1.5 text-xs font-bold text-zinc-800 transition-colors hover:bg-zinc-200/90 sm:px-2.5 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-700/90"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                  <span className="uppercase">{String(lang)}</span>
                  <ChevronDown
                    className={`h-3 w-3 text-zinc-500 transition-transform duration-200 ${
                      isLangDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isLangDropdownOpen && (
                  <div className="animate-in fade-in slide-in-from-top-1 absolute right-0 z-50 mt-1.5 w-28 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl duration-150 dark:border-zinc-800 dark:bg-zinc-900">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={String(l)}
                        type="button"
                        onClick={() => handleSelectLanguage(l)}
                        className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                          lang === l
                            ? "bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="uppercase">{String(l)}</span>
                        <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">
                          {LANGUAGE_LABELS[l]?.label || String(l)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Przycisk Zapisz Dziecko */}
              <a
                href={announcementTarget}
                onClick={(e) =>
                  handleScrollTo(
                    e,
                    [sectionIds.schools, "szkoly", "schools"],
                    "szkołach",
                  )
                }
                className="hidden rounded-lg bg-emerald-300 px-3.5 py-1.5 text-xs font-bold text-emerald-950 shadow-xs transition-colors hover:bg-emerald-400 sm:inline-flex dark:bg-emerald-400 dark:hover:bg-emerald-300"
              >
                {signupLabel}
              </a>

              {/* Hamburger Mobile */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label={
                  isMobileMenuOpen
                    ? "Zamknij menu"
                    : t?.header?.menuOpenAria || "Otwórz menu"
                }
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-900 text-white shadow-sm transition-colors hover:bg-zinc-800 sm:h-9 sm:w-9 lg:hidden dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bufor wyrównujący dla fixed header */}
      <div className="h-[70px] sm:h-[78px]" aria-hidden="true" />

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[70px] z-40 flex flex-col bg-white transition-colors sm:top-[78px] lg:hidden dark:bg-zinc-950">
          <div
            className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="flex-1 space-y-2 overflow-y-auto border-t border-zinc-200 bg-white p-3.5 shadow-2xl sm:p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) =>
                      handleScrollTo(e, item.targets, item.keyword)
                    }
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-emerald-50 hover:text-emerald-950 active:bg-emerald-100 dark:text-zinc-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-emerald-800 dark:bg-zinc-900 dark:text-emerald-400">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="pt-2">
              <a
                href={announcementTarget}
                onClick={(e) =>
                  handleScrollTo(
                    e,
                    [sectionIds.schools, "szkoly", "schools"],
                    "szkołach",
                  )
                }
                className="flex w-full items-center justify-center rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-xs transition-colors hover:bg-emerald-400"
              >
                {signupLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
