import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Privacy</h1>
        <p className="mt-5 leading-8 text-zinc-400">
          During media setup, your camera preview remains local to your browser. Video streams are transmitted peer-to-peer and are never recorded.
        </p>
      </main>
      <Footer />
    </div>
  );
}
