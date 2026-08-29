import Link from "next/link";
import { ArrowLeft, ChatCircleDots } from "@phosphor-icons/react/ssr";

export function ComingSoon() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-neutral-200/90 bg-white text-neutral-950 shadow-md dark:border-white/15 dark:bg-[#141414] dark:text-white">
        <ChatCircleDots size={40} weight="duotone" />
      </div>
      <span className="mt-7 text-xs font-black uppercase tracking-[0.15em] text-neutral-400 dark:text-zinc-500">
        Coming soon
      </span>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
        Text conversations are on the way.
      </h1>
      <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-neutral-500 sm:text-base dark:text-zinc-400">
        We’re building a thoughtful text matching experience. For now, you can prepare your camera and microphone for video chat.
      </p>
      <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
        <Link
          href="/video"
          className="flex h-16 items-center justify-center rounded-2xl bg-neutral-950 px-8 text-[17px] font-black text-white shadow-2xl transition hover:bg-neutral-800 active:scale-[0.99] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          Prepare for video
        </Link>
        <Link
          href="/"
          className="inline-flex h-16 items-center justify-center gap-2.5 rounded-2xl border-2 border-neutral-200/90 bg-white px-8 text-[17px] font-black text-neutral-950 shadow-sm transition hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.99] dark:border-white/15 dark:bg-[#141414] dark:text-white dark:hover:bg-[#1c1c1c] dark:hover:border-white/25"
        >
          <ArrowLeft size={19} weight="bold" /> Back home
        </Link>
      </div>
    </main>
  );
}
