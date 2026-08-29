import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
        <Logo />
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <span>© {new Date().getFullYear()} hyStranger</span>
        </div>
      </div>
    </footer>
  );
}
