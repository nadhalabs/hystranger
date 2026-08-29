import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
      aria-label="hyStranger home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-white dark:text-black">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5"
        >
          {/* Minimal geometric mask/smile icon */}
          <path d="M4 8a8 8 0 0 1 16 0v5a8 8 0 0 1-16 0V8z" fill="currentColor" stroke="none" />
          <circle cx="9" cy="11" r="1.5" className="fill-white dark:fill-black" stroke="none" />
          <circle cx="15" cy="11" r="1.5" className="fill-white dark:fill-black" stroke="none" />
          <path
            d="M9.5 15c.8.6 1.6.9 2.5.9s1.7-.3 2.5-.9"
            className="stroke-white dark:stroke-black"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[20px] font-extrabold tracking-tight text-neutral-900 dark:text-white">
        hyStranger
      </span>
    </Link>
  );
}
