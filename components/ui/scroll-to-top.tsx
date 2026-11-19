"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  ariaLabel?: string;
}

export function ScrollToTop({
  ariaLabel = "Przewiń do góry",
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Sprawdzenie od razu na starcie
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={ariaLabel}
      className="fixed right-6 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-background/90 text-foreground shadow-2xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white dark:hover:border-emerald-600 dark:hover:bg-emerald-600"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
