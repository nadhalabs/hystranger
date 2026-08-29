import Link from "next/link";
import { ArrowLeft, ChatCircleDots } from "@phosphor-icons/react/ssr";

export function ComingSoon() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#121212] text-white">
        <ChatCircleDots size={33} weight="duotone" />
      </div>
      <span className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Coming soon</span>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Text conversations are on the way.</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">We’re building a thoughtful text matching experience. For now, you can prepare your camera and microphone for video chat.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/video" className="rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-black transition hover:bg-zinc-200">Prepare for video</Link>
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#121212] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1a1a1a]"><ArrowLeft size={17} /> Back home</Link>
      </div>
    </main>
  );
}
