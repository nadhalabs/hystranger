import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="hyStranger home">
      <span className="relative flex h-7 w-7 items-center justify-center text-white transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" stroke="white" />
          <circle cx="8" cy="10" r="1.2" fill="#080808" stroke="none" />
          <circle cx="12" cy="10" r="1.2" fill="#080808" stroke="none" />
          <circle cx="16" cy="10" r="1.2" fill="#080808" stroke="none" />
        </svg>
      </span>
      <span className="text-[19px] font-bold tracking-tight text-white">
        hyStranger
      </span>
    </Link>
  );
}
