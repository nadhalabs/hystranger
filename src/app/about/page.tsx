import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">About hyStranger</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Small moments of real connection.</h1>
        <div className="mt-6 space-y-4 text-base leading-8 text-zinc-400">
          <p>hyStranger is a minimal place to meet someone outside your usual circle through spontaneous one-to-one conversations.</p>
          <p>We’re building it around respect, clear controls, and your ability to leave at any time.</p>
        </div>
        <Link href="/" className="mt-8 inline-block font-bold text-white underline decoration-white/40 decoration-2 underline-offset-4 hover:decoration-white">Start exploring</Link>
      </main>
      <Footer />
    </div>
  );
}
