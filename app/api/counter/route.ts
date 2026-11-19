import { NextResponse } from "next/server";
import { neonQuery } from "@/lib/db/neon";

// Dotychczasowa liczba odwiedzin z dawnej strony klubu
const INITIAL_COUNT = 12450;

// Pomocnicza flaga, aby nie sprawdzać CREATE TABLE przy każdym pojedynczym zapytaniu
let isTableInitialized = false;

async function ensureTable(): Promise<void> {
  if (isTableInitialized) return;

  await neonQuery(`
    CREATE TABLE IF NOT EXISTS site_counter (
      id VARCHAR(50) PRIMARY KEY,
      count BIGINT NOT NULL DEFAULT ${INITIAL_COUNT},
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  isTableInitialized = true;
}

async function getStoredCounter(): Promise<number> {
  try {
    await ensureTable();

    const rows = await neonQuery<{ count: string | number }>(
      `SELECT count FROM site_counter WHERE id = 'visits' LIMIT 1;`,
    );

    if (rows.length > 0 && rows[0].count !== undefined) {
      return Number(rows[0].count);
    }

    // Jeśli wiersz jeszcze nie istnieje, tworzymy go z wartością początkową
    await neonQuery(
      `INSERT INTO site_counter (id, count)
       VALUES ('visits', $1)
       ON CONFLICT (id) DO NOTHING;`,
      [INITIAL_COUNT],
    );

    return INITIAL_COUNT;
  } catch (error) {
    console.error("Błąd podczas odczytu licznika z bazy Neon:", error);
    return INITIAL_COUNT;
  }
}

async function incrementCounter(): Promise<number> {
  try {
    await ensureTable();

    // Atomowe zwiększenie licznika o 1 lub inicjalizacja przy braku rekordu
    const rows = await neonQuery<{ count: string | number }>(
      `INSERT INTO site_counter (id, count)
       VALUES ('visits', $1)
       ON CONFLICT (id)
       DO UPDATE SET count = site_counter.count + 1, updated_at = NOW()
       RETURNING count;`,
      [INITIAL_COUNT + 1],
    );

    if (rows.length > 0 && rows[0].count !== undefined) {
      return Number(rows[0].count);
    }

    return INITIAL_COUNT;
  } catch (error) {
    console.error("Błąd podczas zwiększania licznika w bazie Neon:", error);
    return INITIAL_COUNT;
  }
}

/**
 * GET: Pobranie aktualnego stanu licznika (np. przy pierwszym renderze)
 */
export async function GET() {
  const count = await getStoredCounter();
  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

/**
 * POST: Odnotowanie nowej wizyty (zwiększenie o 1 w bazie Neon)
 */
export async function POST() {
  const count = await incrementCounter();
  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
