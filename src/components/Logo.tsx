import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-transform active:scale-95 ${className}`}
      aria-label="hyStranger home"
    >
      <div className="relative flex h-8.5 w-8.5 items-center justify-center rounded-[11px] bg-neutral-900 shadow-md ring-1 ring-black/10 transition-transform group-hover:scale-105 dark:bg-white dark:ring-white/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4.5 w-4.5 text-white dark:text-neutral-950"
        >
          {/* Sleek dual connection arcs with connection nodes */}
          <path
            d="M5.5 16C5.5 12.4 8.4 9.5 12 9.5H13M18.5 8C18.5 11.6 15.6 14.5 12 14.5H11"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="6" cy="16" r="1.4" fill="currentColor" />
          <circle cx="18" cy="8" r="1.4" fill="currentColor" />
        </svg>
      </div>

      <div className="flex items-baseline tracking-tight">
        <span className="text-[19px] font-bold text-neutral-400 dark:text-zinc-500">
          hy
        </span>
        <span className="text-[19px] font-extrabold text-neutral-900 dark:text-white">
          Stranger
        </span>
      </div>
    </Link>
  );
}
