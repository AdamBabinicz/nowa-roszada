import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Dokładnie 50 znaków ze spacjami
const META_TITLE = "UKS Roszada Radom — szachy, które mądrze wychowują";

// Dokładnie 150 znaków ze spacjami
const META_DESCRIPTION =
  "UKS Roszada Radom: szachy dla dzieci, młodzieży i rodzin — stałe treningi w szkołach, turnieje oraz pasja rozwijana z sukcesem od 2006 roku w Radomiu.";

// Bezpieczny bazowy adres URL: zawsze domena docelowa https://roszada.radom.pl
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL &&
  !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "https://roszada.radom.pl";

const OG_IMAGE_URL = `${SITE_URL}/hero/roszada-hero.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: META_TITLE,
    template: "%s | UKS Roszada Radom",
  },
  description: META_DESCRIPTION,
  applicationName: "UKS Roszada Radom",
  authors: [{ name: "UKS Roszada Radom" }],

  // Relatywny link kanoniczny (poprawnie rozwiązuje się dla strony głównej i podstron)
  alternates: {
    canonical: "./",
  },

  // Pełna kontrola indeksowania przez roboty sieciowe
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Połączenie z Web App Manifestem (PWA / instalacja na ekranie telefonu)
  manifest: "/site.webmanifest",

  // Pełna konfiguracja faviconów i ikon urządzeń
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.svg",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  // Open Graph (Facebook, LinkedIn, Discord, Messenger)
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE_URL,
    siteName: "UKS Roszada Radom",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        secureUrl: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Herb i logo UKS Roszada Radom — 20 lat tradycji szachowej",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#042f2e" },
  ],
};

// Strukturyzowane dane Schema.org dla klubu sportowego
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  "@id": `${SITE_URL}/#sportsclub`,
  name: "UKS Roszada Radom",
  alternateName: "Uczniowski Klub Sportowy Roszada Radom",
  url: SITE_URL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  image: OG_IMAGE_URL,
  description: META_DESCRIPTION,
  foundingDate: "2006",
  knowsAbout: ["Szachy", "Edukacja szachowa", "Chess", "Królewska gra"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Tadeusza Mazowieckiego 13A",
    postalCode: "26-604",
    addressLocality: "Radom",
    addressRegion: "Mazowieckie",
    addressCountry: "PL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+48-502-215-278",
    contactType: "Zarząd Klubu",
    email: "malgorzatack@wp.pl",
    availableLanguage: ["Polish", "English", "German", "Hungarian"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="antialiased">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider>{children}</ThemeProvider>

        {/* Analityka ładowana wyłącznie w środowisku produkcyjnym */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Vercel Web Analytics */}
            <Analytics />

            {/* Google Consent Mode v2 + Inicjalizacja GA4 */}
            <Script
              id="google-consent-and-analytics-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}

                  // Odczytanie wcześniejszej zgody z ciasteczka 'roszada_consent'
                  var hasConsent = document.cookie.indexOf('roszada_consent=accepted') !== -1;

                  // Google Consent Mode v2: stan domyślny
                  gtag('consent', 'default', {
                    'analytics_storage': hasConsent ? 'granted' : 'denied',
                    'ad_storage': hasConsent ? 'granted' : 'denied',
                    'ad_user_data': hasConsent ? 'granted' : 'denied',
                    'ad_personalization': hasConsent ? 'granted' : 'denied'
                  });

                  // Nasłuchiwanie na zdarzenie z banera cookie po kliknięciu 'Akceptuj'
                  window.addEventListener('consent-mode-update', function(e) {
                    var detail = e.detail || {};
                    gtag('consent', 'update', {
                      'analytics_storage': detail.analytics_storage || 'granted',
                      'ad_storage': detail.ad_storage || 'granted',
                      'ad_user_data': 'granted',
                      'ad_personalization': 'granted'
                    });
                  });

                  // Konfiguracja GA4
                  gtag('js', new Date());
                  gtag('config', 'G-1R6BR7E5DG', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />

            {/* Skrypt biblioteki Google Analytics 4 */}
            <Script
              strategy="afterInteractive"
              src="https://www.googletagmanager.com/gtag/js?id=G-1R6BR7E5DG"
            />
          </>
        )}
      </body>
    </html>
  );
}
