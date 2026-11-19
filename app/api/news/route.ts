import { NextResponse } from "next/server";
import { neonQuery } from "@/lib/db/neon";
import { requireAdmin } from "@/lib/auth/session";

export interface NewsImage {
  url: string;
  size_kb?: number;
  alt_pl?: string;
  alt_en?: string;
}

export interface NewsRow {
  id: number;
  slug: string;
  date: string;
  category: string;
  author: string;
  is_pinned: boolean;
  title_pl: string;
  title_en?: string | null;
  title_de?: string | null;
  title_hu?: string | null;
  excerpt_pl?: string | null;
  excerpt_en?: string | null;
  excerpt_de?: string | null;
  excerpt_hu?: string | null;
  content_pl: string;
  content_en?: string | null;
  content_de?: string | null;
  content_hu?: string | null;
  images?: NewsImage[] | null;
  created_at?: string;
  updated_at?: string;
}

// Pomocnicza funkcja: wymusza nowoczesny format .avif dla plików z katalogu /upload/
function ensureAvifFormat(images: NewsImage[] | null | undefined): NewsImage[] {
  if (!Array.isArray(images)) return [];
  return images.map((img) => ({
    ...img,
    url:
      typeof img.url === "string"
        ? img.url.replace(/\.(jpg|jpeg|png)$/i, ".avif")
        : img.url,
  }));
}

// GET: Pobiera wszystkie wiadomości posortowane wg ważności (is_pinned) i daty
export async function GET() {
  try {
    const rows = await neonQuery<NewsRow>(`
      SELECT
        id,
        slug,
        TO_CHAR(date, 'YYYY-MM-DD') as date,
        category,
        author,
        is_pinned,
        title_pl,
        title_en,
        title_de,
        title_hu,
        excerpt_pl,
        excerpt_en,
        excerpt_de,
        excerpt_hu,
        content_pl,
        content_en,
        content_de,
        content_hu,
        images,
        created_at,
        updated_at
      FROM roszada_news
      ORDER BY is_pinned DESC, date DESC, id DESC
    `);

    // Automatyczna konwersja starych odwołań .jpg z bazy na istniejące .avif
    const optimizedRows = rows.map((row) => ({
      ...row,
      images: ensureAvifFormat(row.images),
    }));

    return NextResponse.json({
      success: true,
      count: optimizedRows.length,
      data: optimizedRows,
    });
  } catch (err: unknown) {
    console.error("API GET news error:", err);
    return NextResponse.json(
      { success: false, error: "Nie udało się pobrać aktualności." },
      { status: 500 },
    );
  }
}

// POST: Dodaje nowy artykuł do bazy Neon
export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.title_pl || !body.content_pl) {
      return NextResponse.json(
        {
          success: false,
          error: "Tytuł i treść w języku polskim są wymagane.",
        },
        { status: 400 },
      );
    }

    const slug =
      body.slug ||
      body.title_pl
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const dateVal = body.date || new Date().toISOString().split("T")[0];
    const category = body.category || "Klub";
    const author = body.author || "Zarząd UKS Roszada";
    const isPinned = Boolean(body.is_pinned);
    const optimizedImages = ensureAvifFormat(body.images || []);
    const imagesJson = JSON.stringify(optimizedImages);

    const inserted = await neonQuery<NewsRow>(
      `
      INSERT INTO roszada_news (
        slug, date, category, author, is_pinned,
        title_pl, title_en, title_de, title_hu,
        excerpt_pl, excerpt_en, excerpt_de, excerpt_hu,
        content_pl, content_en, content_de, content_hu,
        images
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18::jsonb
      )
      RETURNING id, slug, TO_CHAR(date, 'YYYY-MM-DD') as date
    `,
      [
        slug,
        dateVal,
        category,
        author,
        isPinned,
        body.title_pl,
        body.title_en || null,
        body.title_de || null,
        body.title_hu || null,
        body.excerpt_pl || null,
        body.excerpt_en || null,
        body.excerpt_de || null,
        body.excerpt_hu || null,
        body.content_pl,
        body.content_en || null,
        body.content_de || null,
        body.content_hu || null,
        imagesJson,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Artykuł został pomyślnie dodany.",
      data: inserted[0],
    });
  } catch (err: unknown) {
    console.error("API POST news error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas dodawania wiadomości." },
      { status: 500 },
    );
  }
}

// PUT: Aktualizuje istniejący artykuł w bazie Neon
export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Brak ID artykułu do aktualizacji." },
        { status: 400 },
      );
    }

    const optimizedImages = ensureAvifFormat(body.images || []);
    const imagesJson = JSON.stringify(optimizedImages);
    const dateVal = body.date || new Date().toISOString().split("T")[0];

    const updated = await neonQuery<NewsRow>(
      `
      UPDATE roszada_news SET
        date = $1,
        category = $2,
        author = $3,
        is_pinned = $4,
        title_pl = $5,
        title_en = $6,
        title_de = $7,
        title_hu = $8,
        excerpt_pl = $9,
        excerpt_en = $10,
        excerpt_de = $11,
        excerpt_hu = $12,
        content_pl = $13,
        content_en = $14,
        content_de = $15,
        content_hu = $16,
        images = $17::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $18
      RETURNING id, slug, TO_CHAR(date, 'YYYY-MM-DD') as date
    `,
      [
        dateVal,
        body.category || "Klub",
        body.author || "Zarząd UKS Roszada",
        Boolean(body.is_pinned),
        body.title_pl,
        body.title_en || null,
        body.title_de || null,
        body.title_hu || null,
        body.excerpt_pl || null,
        body.excerpt_en || null,
        body.excerpt_de || null,
        body.excerpt_hu || null,
        body.content_pl,
        body.content_en || null,
        body.content_de || null,
        body.content_hu || null,
        imagesJson,
        body.id,
      ],
    );

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nie znaleziono artykułu o podanym ID." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Artykuł został pomyślnie zaktualizowany.",
      data: updated[0],
    });
  } catch (err: unknown) {
    console.error("API PUT news error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas aktualizacji wiadomości." },
      { status: 500 },
    );
  }
}

// DELETE: Usuwa artykuł z bazy Neon
export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Wymagane ID artykułu." },
        { status: 400 },
      );
    }

    await neonQuery("DELETE FROM roszada_news WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Artykuł został usunięty.",
    });
  } catch (err: unknown) {
    console.error("API DELETE news error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas usuwania wiadomości." },
      { status: 500 },
    );
  }
}
