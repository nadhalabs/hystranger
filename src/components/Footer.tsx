import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white transition-colors dark:border-white/10 dark:bg-[#080808]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
        <Logo />
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-neutral-500 dark:text-zinc-500">
          <Link href="/privacy" className="transition hover:text-neutral-900 dark:hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-neutral-900 dark:hover:text-white">
            Terms
          </Link>
          <span>© {new Date().getFullYear()} hyStranger</span>
        </div>
      </div>
    </footer>
  );
}
