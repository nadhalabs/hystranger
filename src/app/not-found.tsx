import Link from "next/link";
import { ArrowLeft, VideoCamera, WarningCircle } from "@phosphor-icons/react/ssr";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <div className="relative flex h-22 w-22 items-center justify-center rounded-3xl border-2 border-neutral-200/90 bg-white shadow-lg dark:border-white/15 dark:bg-[#141414]">
          <span className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white">
            404
          </span>
          <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-black shadow-md">
            <WarningCircle size={17} weight="bold" />
          </span>
        </div>

        <span className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-neutral-400 dark:text-zinc-500">
          Error 404
        </span>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
          Lost in the void.
        </h1>

        <p className="mt-3.5 max-w-md text-sm font-medium leading-6 text-neutral-500 dark:text-zinc-400 sm:text-base">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back to real connections.
        </p>

        <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
          <Link
            href="/video"
            className="inline-flex h-16 items-center justify-center gap-3 rounded-2xl bg-neutral-950 px-8 text-[17px] font-black text-white shadow-2xl transition hover:bg-neutral-800 active:scale-[0.99] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <VideoCamera size={22} weight="fill" />
            <span>Start Video Chat</span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-16 items-center justify-center gap-2.5 rounded-2xl border-2 border-neutral-200/90 bg-white px-8 text-[17px] font-black text-neutral-950 shadow-sm transition hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.99] dark:border-white/15 dark:bg-[#141414] dark:text-white dark:hover:bg-[#1c1c1c] dark:hover:border-white/25"
          >
            <ArrowLeft size={19} weight="bold" />
            <span>Return Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
