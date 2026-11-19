import { NextResponse } from "next/server";
import { neonQuery } from "@/lib/db/neon";
import { requireAdmin } from "@/lib/auth/session";

export interface TournamentRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  tag: string;
  day: string;
  month: string;
  year: string;
  location: string;
  judge?: string | null;
  pace?: string | null;
  rounds?: string | null;
  entry_fee?: string | null;
  registration_url?: string | null;
  regulations_markdown?: string | null;
  image?: string | null;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

// GET: Pobiera wszystkie turnieje z bazy Neon
export async function GET() {
  try {
    const rows = await neonQuery<TournamentRow>(`
      SELECT
        id,
        slug,
        title,
        category,
        tag,
        day,
        month,
        year,
        location,
        judge,
        pace,
        rounds,
        entry_fee,
        registration_url,
        regulations_markdown,
        image,
        is_featured,
        created_at,
        updated_at
      FROM roszada_tournaments
      ORDER BY id ASC
    `);

    return NextResponse.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err: unknown) {
    console.error("API GET tournaments error:", err);
    return NextResponse.json(
      { success: false, error: "Nie udało się pobrać turniejów." },
      { status: 500 },
    );
  }
}

// POST: Dodaje nowy turniej do bazy Neon
export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.title || !body.day || !body.month || !body.location) {
      return NextResponse.json(
        {
          success: false,
          error: "Tytuł, data (dzień, miesiąc) oraz lokalizacja są wymagane.",
        },
        { status: 400 },
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const inserted = await neonQuery<TournamentRow>(
      `
      INSERT INTO roszada_tournaments (
        slug, title, category, tag, day, month, year, location, judge,
        pace, rounds, entry_fee, registration_url, regulations_markdown,
        image, is_featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16
      )
      RETURNING *
    `,
      [
        slug,
        body.title,
        body.category || "memorial",
        body.tag || "TURNIEJ",
        body.day,
        body.month,
        body.year || "2026",
        body.location,
        body.judge || null,
        body.pace || null,
        body.rounds || null,
        body.entry_fee || null,
        body.registration_url || null,
        body.regulations_markdown || null,
        body.image || null,
        Boolean(body.is_featured),
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Turniej został pomyślnie dodany.",
      data: inserted[0],
    });
  } catch (err: unknown) {
    console.error("API POST tournaments error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas dodawania turnieju." },
      { status: 500 },
    );
  }
}

// PUT: Aktualizuje istniejący turniej i regulamin w bazie Neon
export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Brak ID turnieju do aktualizacji." },
        { status: 400 },
      );
    }

    const updated = await neonQuery<TournamentRow>(
      `
      UPDATE roszada_tournaments SET
        title = $1,
        category = $2,
        tag = $3,
        day = $4,
        month = $5,
        year = $6,
        location = $7,
        judge = $8,
        pace = $9,
        rounds = $10,
        entry_fee = $11,
        registration_url = $12,
        regulations_markdown = $13,
        image = $14,
        is_featured = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *
    `,
      [
        body.title,
        body.category || "memorial",
        body.tag || "TURNIEJ",
        body.day,
        body.month,
        body.year || "2026",
        body.location,
        body.judge || null,
        body.pace || null,
        body.rounds || null,
        body.entry_fee || null,
        body.registration_url || null,
        body.regulations_markdown || null,
        body.image || null,
        Boolean(body.is_featured),
        body.id,
      ],
    );

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nie znaleziono turnieju o podanym ID." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Turniej i regulamin zostały zaktualizowane w bazie.",
      data: updated[0],
    });
  } catch (err: unknown) {
    console.error("API PUT tournaments error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas aktualizacji turnieju." },
      { status: 500 },
    );
  }
}

// DELETE: Usuwa turniej z bazy Neon
export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Wymagane ID turnieju." },
        { status: 400 },
      );
    }

    await neonQuery("DELETE FROM roszada_tournaments WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Turniej został usunięty z bazy.",
    });
  } catch (err: unknown) {
    console.error("API DELETE tournaments error:", err);
    return NextResponse.json(
      { success: false, error: "Błąd podczas usuwania turnieju." },
      { status: 500 },
    );
  }
}
