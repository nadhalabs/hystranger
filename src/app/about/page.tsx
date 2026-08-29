import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-zinc-400">
          About hyStranger
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
          Small moments of real connection.
        </h1>
        <div className="mt-6 space-y-4 text-base leading-8 text-neutral-600 dark:text-zinc-400">
          <p>
            hyStranger is a minimal place to meet someone outside your usual circle through spontaneous one-to-one conversations.
          </p>
          <p>
            We’re building it around respect, clear controls, and your ability to leave at any time.
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-block font-bold text-neutral-900 underline decoration-neutral-400 decoration-2 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-white/40 dark:hover:decoration-white"
        >
          Start exploring
        </Link>
      </main>
      <Footer />
    </div>
  );
}
