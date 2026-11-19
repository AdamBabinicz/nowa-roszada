import { NextResponse } from "next/server";
import { neonQuery } from "@/lib/db/neon";
import { requireAdmin } from "@/lib/auth/session";

export interface GalleryPhoto {
  url: string;
  caption_pl?: string;
  caption_en?: string;
  caption_de?: string;
  caption_hu?: string;
}

export interface GalleryRow {
  id: number;
  slug: string;
  event_date: string;
  year: string;
  category_index: number;
  is_published: boolean;
  image: string;
  photos?: GalleryPhoto[] | null;
  title_pl: string;
  title_en?: string | null;
  title_de?: string | null;
  title_hu?: string | null;
  count_pl: string;
  count_en?: string | null;
  count_de?: string | null;
  count_hu?: string | null;
  caption_pl: string;
  caption_en?: string | null;
  caption_de?: string | null;
  caption_hu?: string | null;
  author_pl?: string | null;
  author_en?: string | null;
  author_de?: string | null;
  author_hu?: string | null;
  license_pl?: string | null;
  license_en?: string | null;
  license_de?: string | null;
  license_hu?: string | null;
  created_at?: string;
  updated_at?: string;
}

function normalizeGalleryImageUrl(url: string): string {
  if (typeof url !== "string") return "";
  return url.replace(/\.(jpg|jpeg|png)$/i, ".avif");
}

function normalizePhotos(photos: unknown): GalleryPhoto[] {
  if (!Array.isArray(photos)) return [];
  return photos
    .filter(
      (item): item is GalleryPhoto =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as GalleryPhoto).url === "string",
    )
    .map((item) => ({
      ...item,
      url: normalizeGalleryImageUrl(item.url),
    }));
}

// GET: Pobiera fotoreportaże posortowane chronologicznie (najnowsze na górze)
export async function GET() {
  try {
    const rows = await neonQuery<GalleryRow>(`
      SELECT
        id,
        slug,
        TO_CHAR(event_date, 'YYYY-MM-DD') as event_date,
        year,
        category_index,
        is_published,
        image,
        photos,
        title_pl,
        title_en,
        title_de,
        title_hu,
        count_pl,
        count_en,
        count_de,
        count_hu,
        caption_pl,
        caption_en,
        caption_de,
        caption_hu,
        author_pl,
        author_en,
        author_de,
        author_hu,
        license_pl,
        license_en,
        license_de,
        license_hu,
        created_at,
        updated_at
      FROM roszada_gallery
      WHERE is_published = true
      ORDER BY event_date DESC, id DESC
    `);

    const optimizedRows = rows.map((row) => ({
      ...row,
      image: normalizeGalleryImageUrl(row.image),
      photos: normalizePhotos(row.photos),
    }));

    return NextResponse.json({
      success: true,
      count: optimizedRows.length,
      data: optimizedRows,
    });
  } catch (err: unknown) {
    console.error("API GET gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Nie udało się pobrać galerii." },
      { status: 500 },
    );
  }
}

// POST: Dodaje nowy fotoreportaż do galerii (tylko zalogowany admin)
export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.image || !body.title_pl || !body.caption_pl) {
      return NextResponse.json(
        {
          success: false,
          error: "Ścieżka okładki, polski tytuł oraz polski opis są wymagane.",
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

    const eventDate = body.event_date || new Date().toISOString().split("T")[0];
    const year = String(body.year || eventDate.slice(0, 4));
    const photosJson = JSON.stringify(normalizePhotos(body.photos));

    const inserted = await neonQuery<GalleryRow>(
      `
      INSERT INTO roszada_gallery (
        slug, event_date, year, category_index, is_published, image, photos,
        title_pl, title_en, title_de, title_hu,
        count_pl, count_en, count_de, count_hu,
        caption_pl, caption_en, caption_de, caption_hu,
        author_pl, author_en, author_de, author_hu,
        license_pl, license_en, license_de, license_hu
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::jsonb,
        $8, $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17, $18, $19,
        $20, $21, $22, $23,
        $24, $25, $26, $27
      )
      RETURNING id, slug, TO_CHAR(event_date, 'YYYY-MM-DD') as event_date, image
    `,
      [
        slug,
        eventDate,
        year,
        Number(body.category_index ?? 0),
        body.is_published !== false,
        normalizeGalleryImageUrl(body.image),
        photosJson,
        body.title_pl,
        body.title_en || null,
        body.title_de || null,
        body.title_hu || null,
        body.count_pl || year,
        body.count_en || null,
        body.count_de || null,
        body.count_hu || null,
        body.caption_pl,
        body.caption_en || null,
        body.caption_de || null,
        body.caption_hu || null,
        body.author_pl || null,
        body.author_en || null,
        body.author_de || null,
        body.author_hu || null,
        body.license_pl || null,
        body.license_en || null,
        body.license_de || null,
        body.license_hu || null,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Fotoreportaż został pomyślnie dodany do galerii.",
      data: inserted[0],
    });
  } catch (err: unknown) {
    console.error("API POST gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas dodawania wpisu do galerii." },
      { status: 500 },
    );
  }
}

// PUT: Aktualizuje istniejący fotoreportaż w bazie Neon (tylko zalogowany admin)
export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Brak ID wpisu galerii do aktualizacji." },
        { status: 400 },
      );
    }

    const eventDate = body.event_date || new Date().toISOString().split("T")[0];
    const year = String(body.year || eventDate.slice(0, 4));
    const photosJson = JSON.stringify(normalizePhotos(body.photos));

    const updated = await neonQuery<GalleryRow>(
      `
      UPDATE roszada_gallery SET
        event_date = $1,
        year = $2,
        category_index = $3,
        is_published = $4,
        image = $5,
        photos = $6::jsonb,
        title_pl = $7,
        title_en = $8,
        title_de = $9,
        title_hu = $10,
        count_pl = $11,
        count_en = $12,
        count_de = $13,
        count_hu = $14,
        caption_pl = $15,
        caption_en = $16,
        caption_de = $17,
        caption_hu = $18,
        author_pl = $19,
        author_en = $20,
        author_de = $21,
        author_hu = $22,
        license_pl = $23,
        license_en = $24,
        license_de = $25,
        license_hu = $26,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $27
      RETURNING id, slug, TO_CHAR(event_date, 'YYYY-MM-DD') as event_date, image
    `,
      [
        eventDate,
        year,
        Number(body.category_index ?? 0),
        body.is_published !== false,
        normalizeGalleryImageUrl(body.image),
        photosJson,
        body.title_pl,
        body.title_en || null,
        body.title_de || null,
        body.title_hu || null,
        body.count_pl || year,
        body.count_en || null,
        body.count_de || null,
        body.count_hu || null,
        body.caption_pl,
        body.caption_en || null,
        body.caption_de || null,
        body.caption_hu || null,
        body.author_pl || null,
        body.author_en || null,
        body.author_de || null,
        body.author_hu || null,
        body.license_pl || null,
        body.license_en || null,
        body.license_de || null,
        body.license_hu || null,
        body.id,
      ],
    );

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nie znaleziono wpisu galerii o podanym ID." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fotoreportaż został pomyślnie zaktualizowany.",
      data: updated[0],
    });
  } catch (err: unknown) {
    console.error("API PUT gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas aktualizacji galerii." },
      { status: 500 },
    );
  }
}

// DELETE: Usuwa fotoreportaż z bazy Neon (tylko zalogowany admin)
export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Wymagane ID wpisu galerii." },
        { status: 400 },
      );
    }

    await neonQuery("DELETE FROM roszada_gallery WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Fotoreportaż został usunięty.",
    });
  } catch (err: unknown) {
    console.error("API DELETE gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas usuwania wpisu galerii." },
      { status: 500 },
    );
  }
}
