import Link from "next/link";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#080808]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-5 text-sm font-medium text-zinc-400 sm:gap-8">
          <Link className="transition-colors hover:text-white" href="/#safety">Safety</Link>
          <Link className="hidden transition-colors hover:text-white sm:block" href="/#how-it-works">How it works</Link>
          <Link className="transition-colors hover:text-white" href="/about">About</Link>
        </div>
      </nav>
    </header>
  );
}
