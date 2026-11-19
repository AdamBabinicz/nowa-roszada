/**
 * Klient Neon Database dla Next.js
 * Obsługuje oficjalny protokół HTTP Neon z pełną diagnostyką błędów.
 */

interface NeonSqlResponse<T = Record<string, unknown>> {
  rows?: T[];
  fields?: Array<{ name: string; dataTypeID: number }>;
  command?: string;
  rowCount?: number;
}

export async function neonQuery<T = Record<string, unknown>>(
  sqlQuery: string,
  params: unknown[] = [],
): Promise<T[]> {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "BRAK ZMIENNEJ DATABASE_URL w pliku .env.local! Upewnij się, że plik istnieje i zrestartuj serwer.",
    );
  }

  try {
    const parsed = new URL(databaseUrl);
    const host = parsed.hostname;

    // Oficjalny endpoint HTTP Neon: https://<host>/sql
    const response = await fetch(`https://${host}/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Neon przyjmuje pełny connection string w nagłówku
        "Neon-Connection-String": databaseUrl,
      },
      body: JSON.stringify({
        query: sqlQuery,
        params: params,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Neon HTTP Error:", response.status, errText);
      throw new Error(`Błąd bazy Neon (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as NeonSqlResponse<T>;
    return data.rows || [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Błąd zapytania neonQuery:", message);
    throw new Error(message);
  }
}
