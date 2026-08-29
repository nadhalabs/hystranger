import Link from "next/link";
import { ArrowLeft, VideoCamera, WarningCircle } from "@phosphor-icons/react/ssr";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-neutral-200/80 bg-white shadow-md dark:border-white/10 dark:bg-[#121212]">
          <span className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
            404
          </span>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
            <WarningCircle size={14} weight="bold" />
          </span>
        </div>

        <span className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-zinc-500">
          Error 404
        </span>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
          Lost in the void.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500 dark:text-zinc-400">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back to real connections.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/video"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 font-bold text-white shadow-md transition hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <VideoCamera size={18} weight="fill" />
            <span>Start Video Chat</span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-6 font-bold text-neutral-900 shadow-sm transition hover:bg-neutral-50 active:scale-95 dark:border-white/10 dark:bg-[#121212] dark:text-white dark:hover:bg-[#181818]"
          >
            <ArrowLeft size={16} />
            <span>Return Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
