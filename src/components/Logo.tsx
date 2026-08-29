import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Nadha Relay home">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-[11px] bg-ink text-white shadow-sm transition-transform group-hover:-rotate-3">
        <span className="absolute h-2.5 w-2.5 -translate-x-1 translate-y-0.5 rounded-full bg-accent" />
        <span className="absolute h-2.5 w-2.5 translate-x-1 -translate-y-0.5 rounded-full border-2 border-white" />
      </span>
      <span className="text-[17px] font-extrabold tracking-[-0.035em] text-ink">Nadha Relay</span>
    </Link>
  );
}
