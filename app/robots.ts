import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Wykrywanie środowiska preview Vercela (gałęzie testowe)
  const isPreview = process.env.VERCEL_ENV === "preview";

  // W środowisku testowym całkowicie blokujemy roboty przed indeksowaniem
  if (isPreview) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // W środowisku produkcyjnym: bezpieczny adres bez końcowego ukośnika
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL &&
    !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://roszada.radom.pl"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
