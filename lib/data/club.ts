export interface SchoolSection {
  id: string;
  name: string;
  trainer: string;
  location: string;
  schedule: string;
  filterKey: "25" | "6" | "29" | "6lo" | "klub";
  accentColor: "emerald" | "amber" | "slate" | "indigo";
  badge?: string;
  hideClubBadge?: boolean;
}

export interface TrainingVenue {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  postalCode: string;
  schedule: string;
  trainerInfo?: string;
  badge?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  year: string;
  categoryIndex: 0 | 1 | 2; // 0: Dziecięce/Szkolne, 1: Liga/Grand Prix, 2: Archiwum XX-lecia
  count: string;
  image: string;
}

/**
 * 3 Oficjalne Sale Treningowe UKS Roszada Radom (zgodnie z Master Promptem)
 */
export const CLUB_VENUES: TrainingVenue[] = [
  {
    id: "radomig",
    name: "Radomig",
    subtitle: "Główna sala klubowa",
    address: "ul. Tadeusza Mazowieckiego 13A",
    postalCode: "26-604 Radom",
    schedule: "Sobota: 17:30",
    badge: "Sala Główna",
  },
  {
    id: "kuznia",
    name: "Kwadrat",
    subtitle: "Ośrodek szachowy juniorów",
    address: "ul. Grzybowska 16",
    postalCode: "26-616 Radom",
    schedule: "Poniedziałek: 16:00",
    badge: "Młode Talenty",
  },
  {
    id: "psp29",
    name: "Nihil Novi Chess Club",
    subtitle: "Lokalny klub i cykliczny projekt szachowy",
    address: "ul. Rynek 3",
    postalCode: "26-600 Radom",
    schedule: "Czwartek: 18:00",
    badge: "Tradycja od 2025",
  },
];

/**
 * Koła szachowe w radomskich szkołach partnerskich
 */
export const SCHOOL_SECTIONS: SchoolSection[] = [
  {
    id: "psp-25",
    name: "PSP nr 25 im. Wandy Chotomskiej",
    trainer: "Klaudia Borkowska",
    location: "ul. Starokrakowska 124",
    schedule: "Wtorek 15:00",
    filterKey: "25",
    accentColor: "emerald",
    badge: "UKS ROSZADA",
    hideClubBadge: false,
  },
  {
    id: "psp-6",
    name: "PSP nr 6 z Oddziałami Integracyjnymi im. Orła Białego",
    trainer: "Marzena Kucharska",
    location: "ul. Rapackiego 24",
    schedule: "Czwartek 15:30",
    filterKey: "6",
    accentColor: "amber",
    badge: "UKS ROSZADA",
    hideClubBadge: false,
  },
  {
    id: "psp-29",
    name: "PSP nr 29 z Oddziałami Integracyjnymi im. Władysława Broniewskiego",
    trainer: "Agnieszka Wielosik",
    location: "ul. Ceglana 14",
    schedule: "Poniedziałek 12:45, · Środa 10:50, 15:00 · Piątek 10:00",
    filterKey: "29",
    accentColor: "emerald",
    badge: "UKS ROSZADA",
    hideClubBadge: false,
  },
  {
    id: "lo-6",
    name: "VI LO im. J. Kochanowskiego",
    trainer: "Renata Bielecka",
    location: "ul. Kilińskiego 25",
    schedule: "Piątek 16:30",
    filterKey: "6lo",
    accentColor: "indigo",
    badge: "",
    hideClubBadge: true,
  },
  {
    id: "klubowa",
    name: "Akademia Roszady — Sekcja Turniejowa",
    trainer: "Trenerzy Klubowi UKS Roszada",
    location: "ul. Tadeusza Mazowieckiego 13A, RADOMIG",
    schedule: "Sobota 17:30",
    filterKey: "klub",
    accentColor: "amber",
    badge: "UKS ROSZADA",
    hideClubBadge: false,
  },
];

/**
 * Albumy z kroniki fotograficznej klubu
 */
export const CLUB_GALLERIES: GalleryAlbum[] = [
  {
    id: "gal-szkoly-2024",
    title: "Mistrzostwa Radomia Szkół Podstawowych",
    year: "2024",
    categoryIndex: 0,
    count: "86 ujęć",
    image: "/gallery/8.avif",
  },
  {
    id: "gal-gp-2024",
    title: "Grand Prix Radomia w Szachach Szybkich",
    year: "2024",
    categoryIndex: 1,
    count: "124 ujęcia",
    image: "/gallery/9.avif",
  },
  {
    id: "gal-jubileusz-2026",
    title: "Wielki Turniej Jubileuszowy XX-lecia",
    year: "2026",
    categoryIndex: 2,
    count: "216 ujęć",
    image: "/gallery/10.avif",
  },
];

/**
 * Oficjalne dane kontaktowe, linki zewnętrzne i darowizny klubu
 */
export const CLUB_CONTACT = {
  email: "roszada@gmail.com",
  // Format z myślnikami: w 100% zgodny z W3C / RFC 3966 (zakaz spacji w protokole tel:)
  phone: "+48-502-147-317",
  phoneDisplay: "+48 502 147 317",
  phoneRaw: "+48502147317",
  facebook: "https://www.facebook.com/uksroszada",
  memorialUrl: "https://marek-niedzwiecki.netlify.app/",
  lichessUrl: "https://lichess.org/team/akademia-szachowa-marka-niedzwieckiego",
  chessTacticsUrl: "https://chesstactics-audio.netlify.app/",
  psychologyBlogUrl: "https://psychologiaiszachy.blogspot.com/",
  churchChessUrl: "https://smpd.pl/kosciol-na-zachodzie-a-szachy/",
  chessCultureUrl: "https://www.facebook.com/KKSzachowej",
  pzszachUrl: "https://pzszach.pl/",
  fideUrl: "https://fide.com",
  // 1,5% Podatku (Darowizna PIT)
  krs: "0000270261",
  donationTarget: "UKS ROSZADA 9268",
} as const;
