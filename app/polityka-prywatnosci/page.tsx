import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Phone } from "lucide-react";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  type Language,
  getTranslations,
} from "@/lib/translations";

const TERMS_URLS: Record<Language, string> = {
  PL: "/regulamin",
  EN: "/terms",
  DE: "/agb",
  HU: "/szabalyzat",
};

const PRIVACY_URLS: Record<Language, string> = {
  PL: "/polityka-prywatnosci",
  EN: "/privacy-policy",
  DE: "/datenschutz",
  HU: "/adatvedelem",
};

interface PageProps {
  searchParams: Promise<{ lang?: string }> | { lang?: string };
}

// Pomocnicza funkcja do ustalenia aktywnego języka
async function resolveLanguage(props: PageProps): Promise<Language> {
  const params = await props.searchParams;
  const langParam = params?.lang?.toUpperCase() as Language | undefined;

  if (langParam && SUPPORTED_LANGUAGES.includes(langParam)) {
    return langParam;
  }
  return DEFAULT_LANGUAGE;
}

// Dynamiczne metatagi SEO dostosowane do języka (wraz z hreflang)
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const language = await resolveLanguage(props);
  const t = getTranslations(language);

  return {
    title: `${t.privacyPage.title} | UKS Roszada Radom`,
    description: t.privacyPage.lead,
    alternates: {
      canonical: PRIVACY_URLS[language],
      languages: {
        "pl-PL": "/polityka-prywatnosci",
        "en-US": "/privacy-policy",
        "de-DE": "/datenschutz",
        "hu-HU": "/adatvedelem",
      },
    },
  };
}

export default async function PrivacyPolicyPage(props: PageProps) {
  const language = await resolveLanguage(props);
  const t = getTranslations(language);

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors selection:bg-emerald-700 selection:text-white">
      <div className="max-w-3xl mx-auto">
        {/* Nawigacja powrotna i przełącznik wersji językowych */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.privacyPage.backToHome}</span>
          </Link>

          <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl text-xs">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Link
                key={lang}
                href={PRIVACY_URLS[lang]}
                scroll={false}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center ${
                  language === lang
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={LANGUAGE_LABELS[lang].label}
              >
                <span className="mr-1">{LANGUAGE_LABELS[lang].flag}</span>
                <span>{lang}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Nagłówek dokumentu */}
        <header className="border-b border-border pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.privacyPage.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t.privacyPage.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {t.privacyPage.lead}
          </p>
        </header>

        {/* Treść polityki prywatności */}
        <div className="space-y-6 leading-relaxed">
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary font-mono text-sm">01.</span>
              <span>{t.privacyPage.adminTitle}</span>
            </h2>
            <p className="text-muted-foreground mb-4">
              {t.privacyPage.adminText}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2 text-sm text-foreground">
              <a
                href={`mailto:${t.privacyPage.email}`}
                className="inline-flex items-center gap-2 text-primary hover:underline transition-colors"
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{t.privacyPage.email}</span>
              </a>
              <a
                href={`tel:${t.privacyPage.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-primary hover:underline transition-colors"
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{t.privacyPage.phone}</span>
              </a>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary font-mono text-sm">02.</span>
              <span>{t.privacyPage.scopeTitle}</span>
            </h2>
            <p className="text-muted-foreground">{t.privacyPage.scopeText}</p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary font-mono text-sm">03.</span>
              <span>{t.privacyPage.cookiesTitle}</span>
            </h2>
            <p className="text-muted-foreground">{t.privacyPage.cookiesText}</p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary font-mono text-sm">04.</span>
              <span>{t.privacyPage.rightsTitle}</span>
            </h2>
            <p className="text-muted-foreground">{t.privacyPage.rightsText}</p>
          </section>
        </div>

        {/* Stopka z linkiem do regulaminu */}
        <footer className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>{t.footer.copyright}</p>
          <Link
            href={TERMS_URLS[language]}
            className="text-foreground hover:text-primary underline underline-offset-4 transition-colors"
          >
            {t.privacyPage.seeTerms}
          </Link>
        </footer>
      </div>
    </main>
  );
}
