import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./chat/ThemeToggle";

export function Navbar() {
  return (
    <header className="border-b border-neutral-200/80 bg-white/90 transition-colors dark:border-white/10 dark:bg-[#080808]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden items-center gap-5 text-sm font-medium text-neutral-500 dark:text-zinc-400 sm:flex sm:gap-8">
            <Link className="transition-colors hover:text-neutral-900 dark:hover:text-white" href="/#safety">
              Safety
            </Link>
            <Link className="hidden transition-colors hover:text-neutral-900 dark:hover:text-white sm:block" href="/#how-it-works">
              How it works
            </Link>
            <Link className="transition-colors hover:text-neutral-900 dark:hover:text-white" href="/about">
              About
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
