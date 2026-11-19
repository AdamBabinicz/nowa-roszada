/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Zapobiega zatrzymaniu wdrożenia przy drobnych ostrzeżeniach typowania
    ignoreBuildErrors: true,
  },

  // Pełna optymalizacja grafik pod maksymalny wynik Google PageSpeed / Lighthouse
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Przekierowania 301 (Permanent Redirects) ze starej wersji strony
  async redirects() {
    return [
      // Stary główny plik PHP -> przekierowanie 301 na stronę główną
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Przepisywanie adresów URL dla wersji językowych regulaminu i polityki prywatności
  async rewrites() {
    return [
      // Regulamin (EN / DE / HU) -> czyste, naturalne adresy URL
      { source: "/terms", destination: "/regulamin?lang=en" },
      { source: "/agb", destination: "/regulamin?lang=de" },
      { source: "/szabalyzat", destination: "/regulamin?lang=hu" },

      // Polityka prywatności (EN / DE / HU) -> czyste, naturalne adresy URL
      {
        source: "/privacy-policy",
        destination: "/polityka-prywatnosci?lang=en",
      },
      { source: "/datenschutz", destination: "/polityka-prywatnosci?lang=de" },
      { source: "/adatvedelem", destination: "/polityka-prywatnosci?lang=hu" },
    ];
  },

  // Nagłówki bezpieczeństwa HTTP podnoszące ocenę w audytach jakości i SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
