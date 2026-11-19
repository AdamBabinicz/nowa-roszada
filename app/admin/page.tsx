"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Edit2,
  FileImage,
  FileText,
  LockKeyhole,
  LogOut,
  Send,
  Trash2,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import {
  type Language,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getTranslations,
} from "@/lib/translations";
import type { NewsRow } from "@/app/api/news/route";
import type { TournamentRow } from "@/app/api/tournaments/route";

type EditLang = "pl" | "en" | "de" | "hu";
type AdminTab = "news" | "tournaments";

const EDIT_LANGS: Array<{ code: EditLang; label: string }> = [
  { code: "pl", label: "PL" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "hu", label: "HU" },
];

interface PendingImage {
  url: string;
  name: string;
  sizeKb: number;
}

const ADMIN_I18N: Record<Language, Record<string, any>> = {
  PL: {
    backToHome: "Wróć do strony głównej",
    kicker: "Panel Zarządzania UKS Roszada",
    title: "Panel Administratora",
    subtitle:
      "Publikacja aktualności, komunikatów turniejowych i regulaminów w bazie Neon.",
    email: "Adres e-mail",
    password: "Hasło",
    loginButton: "Zaloguj się do panelu",
    pageHeading: "Zarządzanie Treściami Klubu",
    logoutButton: "Wyloguj się",
    tabNews: "Wiadomości i Aktualności",
    tabTournaments: "Turnieje i Regulaminy",
    editPost: "Edycja wpisu",
    newPost: "Nowy wpis klubowy",
    editingNotice: "Edytujesz wpis",
    cancelEdit: "Anuluj edycję",
    category: "Kategoria",
    categories: {
      club: "Klub",
      tournaments: "Turnieje",
      jubilee: "Jubileusz XX-lecia",
      training: "Szkolenie",
    },
    date: "Data publikacji",
    author: "Autor wpisu",
    titleField: "Tytuł artykułu",
    required: "Wymagane",
    excerptField: "Krótkie wprowadzenie (zajawka)",
    contentField: "Pełna treść wiadomości",
    contentHint: "Możesz formatować tekst za pomocą akapitów",
    photosHeading: "Galeria zdjęć (format AVIF / WebP)",
    photosHint: "Maksymalna waga pojedynczego zdjęcia: 50 KB",
    addPhotosButton: "Dodaj zdjęcia",
    noticeFormatError: "Dozwolone są wyłącznie formaty AVIF lub WebP.",
    noticeSizeError: "Rozmiar pliku przekracza dozwolony limit 50 KB.",
    pinPost: "Przypnij wpis na samej górze listy aktualności",
    saving: "Zapisywanie w Neon...",
    saveChangesButton: "Zapisz zmiany",
    publishButton: "Opublikuj w bazie Neon",
    listHeading: "Opublikowane wiadomości",
    listSubtitle: "Zarządzaj wpisami w serwisie",
    refresh: "Odśwież listę",
    emptyList: "Brak wpisów w bazie danych.",
    pinnedBadge: "Przypięty",
    versionsLabel: "Wersje językowe:",
    editAction: "Edytuj",
    deleteAction: "Usuń",
    noticeTitleReq: "Wpisz tytuł.",
    noticeContentReq: "Wpisz treść artykułu.",
    noticeLoginSuccess: "Zalogowano pomyślnie do panelu.",
    noticeLoginError: "Nieprawidłowy adres e-mail lub hasło.",
    noticeUpdateSuccess: "Zapisano pomyślnie w bazie Neon.",
    noticePublishSuccess: "Pomyślnie opublikowano w bazie Neon.",
    deleteConfirm: "Czy na pewno chcesz bezpowrotnie usunąć ten element?",
    noticeDeleteSuccess: "Element został usunięty z bazy.",
  },
  EN: {
    backToHome: "Back to website",
    kicker: "UKS Roszada Management Panel",
    title: "Admin Dashboard",
    subtitle: "Manage news and official tournament regulations in Neon DB.",
    email: "Email address",
    password: "Password",
    loginButton: "Sign in to Dashboard",
    pageHeading: "Club Content Management",
    logoutButton: "Sign out",
    tabNews: "News & Articles",
    tabTournaments: "Tournaments & Regulations",
    editPost: "Edit post",
    newPost: "New post",
    editingNotice: "Editing",
    cancelEdit: "Cancel",
    category: "Category",
    categories: {
      club: "Club",
      tournaments: "Tournaments",
      jubilee: "20th Jubilee",
      training: "Training",
    },
    date: "Date",
    author: "Author",
    titleField: "Title",
    required: "Required",
    excerptField: "Excerpt",
    contentField: "Content",
    contentHint: "Format using paragraphs",
    photosHeading: "Gallery (AVIF / WebP)",
    photosHint: "Max size: 50 KB",
    addPhotosButton: "Upload photos",
    noticeFormatError: "Only AVIF or WebP allowed.",
    noticeSizeError: "File exceeds 50 KB.",
    pinPost: "Pin to top",
    saving: "Saving...",
    saveChangesButton: "Save changes",
    publishButton: "Publish to Neon DB",
    listHeading: "Published list",
    listSubtitle: "Manage database entries",
    refresh: "Refresh",
    emptyList: "No items found in database.",
    pinnedBadge: "Pinned",
    versionsLabel: "Languages:",
    editAction: "Edit",
    deleteAction: "Delete",
    noticeTitleReq: "Title is required.",
    noticeContentReq: "Content is required.",
    noticeLoginSuccess: "Signed in successfully.",
    noticeLoginError: "Invalid credentials.",
    noticeUpdateSuccess: "Updated successfully in Neon DB.",
    noticePublishSuccess: "Published successfully to Neon DB.",
    deleteConfirm: "Are you sure you want to delete this?",
    noticeDeleteSuccess: "Deleted successfully.",
  },
  DE: {
    backToHome: "Zurück zur Website",
    kicker: "UKS Roszada Verwaltungsportal",
    title: "Administrationsbereich",
    subtitle: "Turniere und Neuigkeiten verwalten.",
    email: "E-Mail-Adresse",
    password: "Passwort",
    loginButton: "Anmelden",
    pageHeading: "Inhaltsverwaltung",
    logoutButton: "Abmelden",
    tabNews: "Nachrichten",
    tabTournaments: "Turniere & Reglements",
    editPost: "Bearbeiten",
    newPost: "Neuer Eintrag",
    editingNotice: "Wird bearbeitet",
    cancelEdit: "Abbrechen",
    category: "Kategorie",
    categories: {
      club: "Verein",
      tournaments: "Turniere",
      jubilee: "Jubiläum",
      training: "Training",
    },
    date: "Datum",
    author: "Autor",
    titleField: "Titel",
    required: "Erforderlich",
    excerptField: "Kurzbeschreibung",
    contentField: "Inhalt",
    contentHint: "Absätze verwenden",
    photosHeading: "Fotogalerie",
    photosHint: "Max: 50 KB",
    addPhotosButton: "Fotos hinzufügen",
    noticeFormatError: "Nur AVIF/WebP.",
    noticeSizeError: "Über 50 KB.",
    pinPost: "Oben anheften",
    saving: "Speichern...",
    saveChangesButton: "Speichern",
    publishButton: "Veröffentlichen",
    listHeading: "Einträge",
    listSubtitle: "Verwaltung",
    refresh: "Aktualisieren",
    emptyList: "Keine Daten.",
    pinnedBadge: "Angeheftet",
    versionsLabel: "Sprachen:",
    editAction: "Bearbeiten",
    deleteAction: "Löschen",
    noticeTitleReq: "Titel erforderlich.",
    noticeContentReq: "Inhalt erforderlich.",
    noticeLoginSuccess: "Erfolgreich angemeldet.",
    noticeLoginError: "Ungültige Anmeldedaten.",
    noticeUpdateSuccess: "Erfolgreich aktualisiert.",
    noticePublishSuccess: "Erfolgreich veröffentlicht.",
    deleteConfirm: "Wirklich löschen?",
    noticeDeleteSuccess: "Gelöscht.",
  },
  HU: {
    backToHome: "Vissza a főoldalra",
    kicker: "UKS Roszada Kezelőpult",
    title: "Adminisztrációs Felület",
    subtitle: "Hírek és versenykiírások kezelése.",
    email: "E-mail cím",
    password: "Jelszó",
    loginButton: "Bejelentkezés",
    pageHeading: "Tartalomkezelés",
    logoutButton: "Kijelentkezés",
    tabNews: "Hírek",
    tabTournaments: "Versenyek",
    editPost: "Szerkesztés",
    newPost: "Új bejegyzés",
    editingNotice: "Szerkesztés",
    cancelEdit: "Mégse",
    category: "Kategória",
    categories: {
      club: "Klub",
      tournaments: "Versenyek",
      jubilee: "Jubileum",
      training: "Edzés",
    },
    date: "Dátum",
    author: "Szerző",
    titleField: "Cím",
    required: "Kötelező",
    excerptField: "Összefoglaló",
    contentField: "Tartalom",
    contentHint: "Bekezdések",
    photosHeading: "Fotók",
    photosHint: "Max: 50 KB",
    addPhotosButton: "Feltöltés",
    noticeFormatError: "Csak AVIF/WebP.",
    noticeSizeError: "Több mint 50 KB.",
    pinPost: "Kitűzés",
    saving: "Mentés...",
    saveChangesButton: "Mentés",
    publishButton: "Közzététel",
    listHeading: "Bejegyzések",
    listSubtitle: "Kezelés",
    refresh: "Frissítés",
    emptyList: "Nincs adat.",
    pinnedBadge: "Kitűzött",
    versionsLabel: "Nyelvek:",
    editAction: "Szerkesztés",
    deleteAction: "Törlés",
    noticeTitleReq: "Cím kötelező.",
    noticeContentReq: "Tartalom kötelező.",
    noticeLoginSuccess: "Sikeres bejelentkezés.",
    noticeLoginError: "Érvénytelen adatok.",
    noticeUpdateSuccess: "Sikeresen frissítve.",
    noticePublishSuccess: "Sikeresen közzétéve.",
    deleteConfirm: "Biztosan törlöd?",
    noticeDeleteSuccess: "Törölve.",
  },
};

export default function AdminPage() {
  const [uiLang, setUiLang] = useState<Language>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<AdminTab>("news");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang")?.toUpperCase() as Language;
      if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
        setUiLang(urlLang);
        localStorage.setItem("roszada_lang", urlLang);
        return;
      }

      const savedLang = localStorage.getItem("roszada_lang") as Language | null;
      if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
        setUiLang(savedLang);
      }
    } catch {}
  }, []);

  const handleUiLanguageChange = (newLang: Language) => {
    setUiLang(newLang);
    try {
      localStorage.setItem("roszada_lang", newLang);
    } catch {}
  };

  const extAdmin = (getTranslations(uiLang) as any)?.admin || {};
  const baseDict = ADMIN_I18N[uiLang] || ADMIN_I18N.PL;
  const t: Record<string, any> = {
    ...baseDict,
    ...extAdmin,
    categories: {
      ...baseDict.categories,
      ...(extAdmin.categories || {}),
    },
  };

  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [tournamentsList, setTournamentsList] = useState<TournamentRow[]>([]);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth")
      .then((res) => res.json())
      .then((json) => {
        if (active && json.authenticated) {
          setLoggedIn(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // ==================== STAN WIADOMOŚCI ====================
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeEditLang, setActiveEditLang] = useState<EditLang>("pl");
  const [category, setCategory] = useState("Klub");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [author, setAuthor] = useState("Zarząd UKS Roszada");
  const [isPinned, setIsPinned] = useState(false);

  const [titles, setTitles] = useState<Record<EditLang, string>>({
    pl: "",
    en: "",
    de: "",
    hu: "",
  });
  const [excerpts, setExcerpts] = useState<Record<EditLang, string>>({
    pl: "",
    en: "",
    de: "",
    hu: "",
  });
  const [contents, setContents] = useState<Record<EditLang, string>>({
    pl: "",
    en: "",
    de: "",
    hu: "",
  });

  const [images, setImages] = useState<PendingImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // ==================== STAN TURNIEJÓW ====================
  const [editingTournamentId, setEditingTournamentId] = useState<number | null>(
    null,
  );
  const [tournSlug, setTournSlug] = useState("");
  const [tournTitle, setTournTitle] = useState("");
  const [tournCategory, setTournCategory] = useState("memorial");
  const [tournTag, setTournTag] = useState("TURNIEJ");
  const [tournDay, setTournDay] = useState("");
  const [tournMonth, setTournMonth] = useState("LIS");
  const [tournYear, setTournYear] = useState("2026");
  const [tournLocation, setTournLocation] = useState("");
  const [tournJudge, setTournJudge] = useState("");
  const [tournPace, setTournPace] = useState("");
  const [tournRounds, setTournRounds] = useState("");
  const [tournEntryFee, setTournEntryFee] = useState("");
  const [tournRegistrationUrl, setTournRegistrationUrl] = useState("");
  const [tournRegulationsMarkdown, setTournRegulationsMarkdown] = useState("");
  const [tournIsFeatured, setTournIsFeatured] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNewsList(json.data);
      }
    } catch {
      showNotice("error", t.emptyList);
    } finally {
      setLoading(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tournaments");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTournamentsList(json.data);
      }
    } catch {
      showNotice("error", "Błąd pobierania turniejów.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      if (activeTab === "news") {
        fetchNews();
      } else {
        fetchTournaments();
      }
    }
  }, [loggedIn, activeTab]);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Bezpieczne logowanie serwerowe z odczytem pól z formularza
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get("email") as string;
    const passwordVal = formData.get("password") as string;

    try {
      setLoading(true);
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, password: passwordVal }),
      });

      const json = await res.json();
      if (json.success) {
        setLoggedIn(true);
        showNotice("success", t.noticeLoginSuccess);
      } else {
        showNotice("error", json.error || t.noticeLoginError);
      }
    } catch {
      showNotice("error", "Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== OBSŁUGA TURNIEJÓW ====================
  const startEditingTournament = (item: TournamentRow) => {
    setEditingTournamentId(item.id);
    setTournSlug(item.slug || "");
    setTournTitle(item.title || "");
    setTournCategory(item.category || "memorial");
    setTournTag(item.tag || "TURNIEJ");
    setTournDay(item.day || "");
    setTournMonth(item.month || "LIS");
    setTournYear(item.year || "2026");
    setTournLocation(item.location || "");
    setTournJudge(item.judge || "");
    setTournPace(item.pace || "");
    setTournRounds(item.rounds || "");
    setTournEntryFee(item.entry_fee || "");
    setTournRegistrationUrl(item.registration_url || "");
    setTournRegulationsMarkdown(item.regulations_markdown || "");
    setTournIsFeatured(Boolean(item.is_featured));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditingTournament = () => {
    setEditingTournamentId(null);
    setTournSlug("");
    setTournTitle("");
    setTournCategory("memorial");
    setTournTag("TURNIEJ");
    setTournDay("");
    setTournMonth("LIS");
    setTournYear("2026");
    setTournLocation("");
    setTournJudge("");
    setTournPace("");
    setTournRounds("");
    setTournEntryFee("");
    setTournRegistrationUrl("");
    setTournRegulationsMarkdown("");
    setTournIsFeatured(false);
  };

  const handleSubmitTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournTitle.trim() || !tournDay.trim() || !tournLocation.trim()) {
      showNotice("error", "Wypełnij tytuł, dzień oraz lokalizację turnieju.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: editingTournamentId || undefined,
        slug:
          tournSlug.trim() ||
          tournTitle
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`,
        title: tournTitle,
        category: tournCategory,
        tag: tournTag,
        day: tournDay,
        month: tournMonth,
        year: tournYear,
        location: tournLocation,
        judge: tournJudge,
        pace: tournPace,
        rounds: tournRounds,
        entry_fee: tournEntryFee,
        registration_url: tournRegistrationUrl,
        regulations_markdown: tournRegulationsMarkdown,
        is_featured: tournIsFeatured,
      };

      const method = editingTournamentId ? "PUT" : "POST";
      const res = await fetch("/api/tournaments", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.status === 401) {
        setLoggedIn(false);
        throw new Error(json.error || "Sesja wygasła. Zaloguj się ponownie.");
      }
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Błąd zapisu turnieju w Neon.");
      }

      showNotice(
        "success",
        editingTournamentId ? t.noticeUpdateSuccess : t.noticePublishSuccess,
      );
      cancelEditingTournament();
      fetchTournaments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      showNotice("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (id: number) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      const res = await fetch(`/api/tournaments?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (res.status === 401) {
        setLoggedIn(false);
        showNotice(
          "error",
          json.error || "Sesja wygasła. Zaloguj się ponownie.",
        );
        return;
      }

      if (json.success) {
        showNotice("success", t.noticeDeleteSuccess);
        if (editingTournamentId === id) cancelEditingTournament();
        setTournamentsList((prev) => prev.filter((item) => item.id !== id));
      } else {
        showNotice("error", json.error || "Błąd usuwania.");
      }
    } catch {
      showNotice("error", "Błąd połączenia.");
    }
  };

  // ==================== OBSŁUGA WIADOMOŚCI ====================
  const startEditing = (item: NewsRow) => {
    setEditingId(item.id);
    setCategory(item.category || "Klub");
    setDate(item.date);
    setAuthor(item.author || "Zarząd UKS Roszada");
    setIsPinned(Boolean(item.is_pinned));
    setTitles({
      pl: item.title_pl || "",
      en: item.title_en || "",
      de: item.title_de || "",
      hu: item.title_hu || "",
    });
    setExcerpts({
      pl: item.excerpt_pl || "",
      en: item.excerpt_en || "",
      de: item.excerpt_de || "",
      hu: item.excerpt_hu || "",
    });
    setContents({
      pl: item.content_pl || "",
      en: item.content_en || "",
      de: item.content_de || "",
      hu: item.content_hu || "",
    });
    if (Array.isArray(item.images)) {
      setImages(
        item.images.map((img, i) => ({
          url: img.url,
          name: `AVIF ${i + 1}`,
          sizeKb: img.size_kb || 40,
        })),
      );
    } else {
      setImages([]);
    }
    setImageError(null);
    setActiveEditLang("pl");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitles({ pl: "", en: "", de: "", hu: "" });
    setExcerpts({ pl: "", en: "", de: "", hu: "" });
    setContents({ pl: "", en: "", de: "", hu: "" });
    setImages([]);
    setImageError(null);
    setIsPinned(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxKb = 50;
    const newItems: PendingImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeKb = Math.round(file.size / 1024);
      const isAvifOrWebp =
        file.type === "image/avif" ||
        file.type === "image/webp" ||
        file.name.toLowerCase().endsWith(".avif") ||
        file.name.toLowerCase().endsWith(".webp");

      if (!isAvifOrWebp) {
        setImageError(`${file.name}: ${t.noticeFormatError}`);
        return;
      }

      if (sizeKb > maxKb) {
        setImageError(`${file.name} (${sizeKb} KB): ${t.noticeSizeError}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        newItems.push({
          url: resultUrl,
          name: file.name,
          sizeKb: sizeKb,
        });

        if (newItems.length === files.length) {
          setImages((prev) => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titles.pl.trim()) {
      showNotice("error", t.noticeTitleReq);
      setActiveEditLang("pl");
      return;
    }
    if (!contents.pl.trim()) {
      showNotice("error", t.noticeContentReq);
      setActiveEditLang("pl");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: editingId || undefined,
        title_pl: titles.pl,
        title_en: titles.en,
        title_de: titles.de,
        title_hu: titles.hu,
        excerpt_pl: excerpts.pl,
        excerpt_en: excerpts.en,
        excerpt_de: excerpts.de,
        excerpt_hu: excerpts.hu,
        content_pl: contents.pl,
        content_en: contents.en,
        content_de: contents.de,
        content_hu: contents.hu,
        category,
        author,
        is_pinned: isPinned,
        date,
        images: images.map((img) => ({
          url: img.url,
          size_kb: img.sizeKb,
          alt_pl: titles.pl,
          alt_en: titles.en,
        })),
      };

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.status === 401) {
        setLoggedIn(false);
        throw new Error(json.error || "Sesja wygasła. Zaloguj się ponownie.");
      }
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Błąd zapisu.");
      }

      showNotice(
        "success",
        editingId ? t.noticeUpdateSuccess : t.noticePublishSuccess,
      );
      cancelEditing();
      fetchNews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      showNotice("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      const json = await res.json();

      if (res.status === 401) {
        setLoggedIn(false);
        showNotice(
          "error",
          json.error || "Sesja wygasła. Zaloguj się ponownie.",
        );
        return;
      }

      if (json.success) {
        showNotice("success", t.noticeDeleteSuccess);
        if (editingId === id) cancelEditing();
        setNewsList((prev) => prev.filter((item) => item.id !== id));
      } else {
        showNotice("error", json.error || "Błąd.");
      }
    } catch {
      showNotice("error", "Błąd połączenia.");
    }
  };

  // ==================== EKRAN LOGOWANIA ====================
  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 p-4 transition-colors dark:bg-stone-950 sm:p-6">
        <p className="text-xs font-semibold text-stone-500">...</p>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 p-4 transition-colors dark:bg-stone-950 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-[#f9f7f2] p-8 shadow-xl transition-colors dark:border-stone-800 dark:bg-stone-900 sm:p-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.backToHome}</span>
          </Link>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 bg-white text-2xl shadow-xs dark:border-stone-700 dark:bg-stone-800 dark:text-amber-400">
            ♞
          </div>

          <p className="mt-6 text-xs font-bold tracking-widest text-stone-500 uppercase dark:text-stone-400">
            {t.kicker}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
            {t.subtitle}
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-stone-700 dark:text-stone-300"
              >
                {t.email}
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="zarzad@uksroszada.pl"
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white/70 px-4 py-3 text-xs text-stone-900 transition-all focus:border-stone-900 focus:bg-white focus:outline-hidden dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:border-amber-400"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-stone-700 dark:text-stone-300"
              >
                {t.password}
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white/70 px-4 py-3 text-xs text-stone-900 transition-all focus:border-stone-900 focus:bg-white focus:outline-hidden dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-stone-800 disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600 cursor-pointer"
            >
              <LockKeyhole className="h-4 w-4" />
              <span>{loading ? "Weryfikacja..." : t.loginButton}</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ==================== GŁÓWNY EKRAN PANELU ====================
  return (
    <main className="min-h-screen bg-stone-100 py-8 transition-colors dark:bg-stone-950 sm:py-12">
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-bold text-white shadow-2xl transition-all ${
            notification.type === "success"
              ? "bg-emerald-700 dark:bg-emerald-600"
              : "bg-red-700 dark:bg-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{t.backToHome}</span>
            </Link>
            <p className="mt-2 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              {t.kicker}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {t.pageHeading}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-card border border-border/80 p-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleUiLanguageChange(lang)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    uiLang === lang
                      ? "bg-stone-900 text-white dark:bg-emerald-700 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth", { method: "DELETE" });
                setLoggedIn(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-xs transition-colors hover:bg-accent cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-red-500" />
              <span>{t.logoutButton}</span>
            </button>
          </div>
        </div>

        {/* PRZEŁĄCZNIK ZAKŁADEK */}
        <div className="mt-6 flex border-b border-border/60 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "news"
                ? "border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>{t.tabNews}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
              {newsList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tournaments")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tournaments"
                ? "border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>{t.tabTournaments}</span>
            <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
              Neon DB ({tournamentsList.length})
            </span>
          </button>
        </div>

        {/* ZAKŁADKA 1: AKTUALNOŚCI */}
        {activeTab === "news" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div
              className={`rounded-3xl border p-6 shadow-sm sm:p-8 lg:col-span-7 transition-colors ${
                editingId
                  ? "border-amber-400 bg-amber-500/5 dark:border-amber-500/40"
                  : "border-border/80 bg-card"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <span
                    className={`text-[10px] font-bold tracking-widest uppercase ${
                      editingId
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {editingId ? t.editPost : t.newPost}
                  </span>
                  <h2 className="text-lg font-bold text-foreground">
                    {editingId ? `${t.editingNotice} #${editingId}` : t.newPost}
                  </h2>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>{t.cancelEdit}</span>
                  </button>
                )}

                <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1">
                  {EDIT_LANGS.map((lng) => {
                    const isActive = activeEditLang === lng.code;
                    return (
                      <button
                        key={lng.code}
                        type="button"
                        onClick={() => setActiveEditLang(lng.code)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {lng.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmitNews} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      {t.category}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    >
                      <option value="Klub">{t.categories.club}</option>
                      <option value="Turnieje">
                        {t.categories.tournaments}
                      </option>
                      <option value="Jubileusz">{t.categories.jubilee}</option>
                      <option value="Szkolenie">{t.categories.training}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      {t.date}
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      {t.author}
                    </label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Marek Niedźwiecki"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>
                      {t.titleField} ({activeEditLang.toUpperCase()})
                    </span>
                    {activeEditLang === "pl" && (
                      <span className="text-[10px] text-emerald-600 font-normal">
                        {t.required}
                      </span>
                    )}
                  </label>
                  <input
                    required={activeEditLang === "pl"}
                    value={titles[activeEditLang]}
                    onChange={(e) =>
                      setTitles({
                        ...titles,
                        [activeEditLang]: e.target.value,
                      })
                    }
                    placeholder={`${t.titleField}...`}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground">
                    {t.excerptField} ({activeEditLang.toUpperCase()})
                  </label>
                  <input
                    value={excerpts[activeEditLang]}
                    onChange={(e) =>
                      setExcerpts({
                        ...excerpts,
                        [activeEditLang]: e.target.value,
                      })
                    }
                    placeholder={`${t.excerptField}...`}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>
                      {t.contentField} ({activeEditLang.toUpperCase()})
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {t.contentHint}
                    </span>
                  </label>
                  <textarea
                    required={activeEditLang === "pl"}
                    rows={6}
                    value={contents[activeEditLang]}
                    onChange={(e) =>
                      setContents({
                        ...contents,
                        [activeEditLang]: e.target.value,
                      })
                    }
                    placeholder={`${t.contentField}...`}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs leading-relaxed text-foreground focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* ZDJĘCIA */}
                <div className="rounded-2xl border border-dashed border-border p-4 bg-muted/10">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <FileImage className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                        <span>{t.photosHeading}</span>
                      </label>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {t.photosHint}
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{t.addPhotosButton}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/avif,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {imageError && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{imageError}</span>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-xs"
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="h-20 w-full object-cover"
                          />
                          <div className="p-1.5 text-[10px]">
                            <p className="truncate font-semibold text-foreground">
                              {img.name}
                            </p>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              {img.sizeKb} KB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-border text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {t.pinPost}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                    editingId
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>
                    {loading
                      ? t.saving
                      : editingId
                        ? t.saveChangesButton
                        : t.publishButton}
                  </span>
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {t.listHeading} ({newsList.length})
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {t.listSubtitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fetchNews}
                  className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400 cursor-pointer"
                >
                  {t.refresh}
                </button>
              </div>

              <div className="mt-5 space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {newsList.length === 0 && !loading && (
                  <p className="text-xs text-muted-foreground py-8 text-center">
                    {t.emptyList}
                  </p>
                )}

                {newsList.map((item) => {
                  const langLower = uiLang.toLowerCase();
                  const displayTitle =
                    item[`title_${langLower}` as keyof NewsRow] ||
                    item.title_pl;
                  const displayContent =
                    item[`content_${langLower}` as keyof NewsRow] ||
                    item.content_pl;

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                        editingId === item.id
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-border/60 bg-muted/20 hover:border-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                            {item.category}
                          </span>
                          <span className="text-[11px] italic text-muted-foreground">
                            {item.date}
                          </span>
                          {item.is_pinned && (
                            <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                              {t.pinnedBadge}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-2 text-xs font-bold text-foreground line-clamp-2">
                          {String(displayTitle)}
                        </h4>
                        {displayContent && (
                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {String(displayContent)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-2">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400 cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>{t.editAction}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNews(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{t.deleteAction}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ZAKŁADKA 2: TURNIEJE I REGULAMINY */}
        {activeTab === "tournaments" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div
              className={`rounded-3xl border p-6 shadow-sm sm:p-8 lg:col-span-7 transition-colors ${
                editingTournamentId
                  ? "border-amber-400 bg-amber-500/5 dark:border-amber-500/40"
                  : "border-border/80 bg-card"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <span
                    className={`text-[10px] font-bold tracking-widest uppercase ${
                      editingTournamentId
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {editingTournamentId
                      ? "Edycja turnieju i regulaminu"
                      : "Nowy turniej do bazy"}
                  </span>
                  <h2 className="text-lg font-bold text-foreground">
                    {editingTournamentId
                      ? `Edytujesz turniej #${editingTournamentId}`
                      : "Dodaj turniej i wklej regulamin"}
                  </h2>
                </div>

                {editingTournamentId && (
                  <button
                    type="button"
                    onClick={cancelEditingTournament}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Anuluj</span>
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSubmitTournament}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-foreground">
                    Tytuł turnieju *
                  </label>
                  <input
                    required
                    value={tournTitle}
                    onChange={(e) => setTournTitle(e.target.value)}
                    placeholder="np. Jubileuszowy Turniej Szachowy na XX-lecie UKS Roszada"
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      Kategoria
                    </label>
                    <select
                      value={tournCategory}
                      onChange={(e) => setTournCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    >
                      <option value="memorial">Memoriał</option>
                      <option value="klasyfikacyjny">Klasyfikacyjny</option>
                      <option value="liga">Liga Mazowiecka</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      Etykieta (Tag)
                    </label>
                    <input
                      value={tournTag}
                      onChange={(e) => setTournTag(e.target.value)}
                      placeholder="np. XX LAT KLUBU"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      Dzień *
                    </label>
                    <input
                      required
                      value={tournDay}
                      onChange={(e) => setTournDay(e.target.value)}
                      placeholder="np. 14–15"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      Miesiąc
                    </label>
                    <select
                      value={tournMonth}
                      onChange={(e) => setTournMonth(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    >
                      {[
                        "STY",
                        "LUT",
                        "MAR",
                        "KWI",
                        "MAJ",
                        "CZE",
                        "LIP",
                        "SIE",
                        "WRZ",
                        "PAŹ",
                        "LIS",
                        "GRU",
                      ].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      Miejsce rozgrywek *
                    </label>
                    <input
                      required
                      value={tournLocation}
                      onChange={(e) => setTournLocation(e.target.value)}
                      placeholder="np. Hotel Hoppen House · ul. Rynek 8, Radom"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">
                      Sędzia Główny / Dyrektor
                    </label>
                    <input
                      value={tournJudge}
                      onChange={(e) => setTournJudge(e.target.value)}
                      placeholder="np. Marek Niedźwiecki (Dyrektor)"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Kluczowe dane do kafelków modala
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                        <Clock className="h-3 w-3 text-emerald-700" />
                        <span>Tempo gry</span>
                      </label>
                      <input
                        value={tournPace}
                        onChange={(e) => setTournPace(e.target.value)}
                        placeholder="np. P'30 + 30'' na ruch"
                        className="mt-1 w-full rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                        <Trophy className="h-3 w-3 text-amber-600" />
                        <span>Rundy / System</span>
                      </label>
                      <input
                        value={tournRounds}
                        onChange={(e) => setTournRounds(e.target.value)}
                        placeholder="np. 7 rund (Szwajcar)"
                        className="mt-1 w-full rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                        <Coins className="h-3 w-3 text-emerald-700" />
                        <span>Wpisowe</span>
                      </label>
                      <input
                        value={tournEntryFee}
                        onChange={(e) => setTournEntryFee(e.target.value)}
                        placeholder="np. 40 zł / juniorzy 30 zł"
                        className="mt-1 w-full rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-foreground">
                      Link do zapisów (ChessArbiter / ChessManager)
                    </label>
                    <input
                      type="url"
                      value={tournRegistrationUrl}
                      onChange={(e) => setTournRegistrationUrl(e.target.value)}
                      placeholder="http://chessarbiter.com/turnieje/..."
                      className="mt-1 w-full rounded-xl border border-border/80 bg-background px-3.5 py-1.5 text-xs text-foreground focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1 text-xs font-bold text-foreground">
                      <FileText className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Pełna treść regulaminu (wklej z .odt / Worda)</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      Obsługuje nagłówki ## i listy -
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={tournRegulationsMarkdown}
                    onChange={(e) =>
                      setTournRegulationsMarkdown(e.target.value)
                    }
                    placeholder="Wklej tutaj cały regulamin od prezesa (Cele, Organizatorzy, Wpisowe, Nagrody finansowe, RODO)..."
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background p-3.5 text-xs leading-relaxed font-mono text-foreground focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tournIsFeatured}
                      onChange={(e) => setTournIsFeatured(e.target.checked)}
                      className="rounded border-border text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      Wyróżnij turniej (złota ramka)
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                    editingTournamentId
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>
                    {loading
                      ? "Zapisywanie w Neon..."
                      : editingTournamentId
                        ? "Zapisz zmiany regulaminu w Neon"
                        : "Zapisz nowy turniej i regulamin w Neon"}
                  </span>
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Turnieje w bazie Neon ({tournamentsList.length})
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Pobierane z tabeli roszada_tournaments
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fetchTournaments}
                  className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400 cursor-pointer"
                >
                  Odśwież
                </button>
              </div>

              <div className="mt-5 space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {tournamentsList.length === 0 && !loading && (
                  <p className="text-xs text-muted-foreground py-8 text-center">
                    Brak turniejów w bazie. Dodaj pierwszy z lewej strony!
                  </p>
                )}

                {tournamentsList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                      editingTournamentId === item.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-border/60 bg-muted/20 hover:border-border"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          {item.day} {item.month} {item.year}
                        </span>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-foreground line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                        📍 {item.location}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                        {item.pace && (
                          <span className="rounded bg-background px-1.5 py-0.5 border border-border/60">
                            ⏱ {item.pace}
                          </span>
                        )}
                        {item.regulations_markdown ? (
                          <span className="text-emerald-600 font-bold">
                            ✓ Regulamin ({item.regulations_markdown.length} zn.)
                          </span>
                        ) : (
                          <span className="text-amber-600">
                            Brak regulaminu
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-2">
                      <button
                        type="button"
                        onClick={() => startEditingTournament(item)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400 cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edytuj regulamin</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTournament(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Usuń</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
