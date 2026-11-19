"use client";

interface ClubLogoProps {
  className?: string;
  ariaHidden?: boolean;
  alt?: string;
}

export function ClubLogo({
  className = "h-11 w-11 sm:h-12 sm:w-12",
  ariaHidden = false, // Zmienione na false, aby logo było widoczne dla dostępności
  alt = "UKS ROSZADA RADOM",
}: ClubLogoProps) {
  return (
    <div
      aria-hidden={ariaHidden ? "true" : undefined}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-amber-400/40 transition-transform duration-200 group-hover:scale-105 dark:bg-zinc-950 dark:ring-amber-400/30 ${className}`}
    >
      <img
        src="/branding/logo.avif"
        alt={alt}
        loading="lazy"
        decoding="async"
        width={48}
        height={48}
        className="h-full w-full object-contain p-0.5"
      />
    </div>
  );
}
