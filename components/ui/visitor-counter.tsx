"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface VisitorCounterProps {
  label?: string;
  className?: string;
}

export function VisitorCounter({
  label = "Odwiedziny:",
  className = "",
}: VisitorCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function recordOrFetchVisit() {
      try {
        const hasVisited = sessionStorage.getItem("roszada_visited_session");

        // Jeśli to nowa wizyta w tej sesji przeglądarki -> inkrementujemy (POST)
        // W przeciwnym razie tylko pobieramy aktualny stan (GET)
        const method = hasVisited ? "GET" : "POST";
        const response = await fetch("/api/counter", {
          method,
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted && typeof data.count === "number") {
            setCount(data.count);
            sessionStorage.setItem("roszada_visited_session", "true");
          }
        }
      } catch {
        // Cichy fallback przy braku połączenia
      }
    }

    recordOrFetchVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  if (count === null) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 ${className}`}
        aria-hidden="true"
      >
        <Activity className="h-3 w-3 animate-pulse text-emerald-600" />
        <span>...</span>
      </div>
    );
  }

  // Formatowanie liczby ze spacjami (np. 12 451)
  const formattedCount = count.toLocaleString("pl-PL");

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground ${className}`}
      title={`${label} ${formattedCount}`}
    >
      <Activity
        className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
        aria-hidden="true"
      />
      <span className="text-[11px] font-medium">{label}</span>
      <span className="font-mono text-xs font-bold text-foreground">
        {formattedCount}
      </span>
    </div>
  );
}
