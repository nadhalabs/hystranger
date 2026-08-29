import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl dark:text-white">Terms of Service</h1>
        <div className="mt-5 space-y-4 text-neutral-600 leading-8 dark:text-zinc-400">
          <p>
            hyStranger is designed for respectful, consensual one-to-one video conversations between adults.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must be 18 years of age or older to use hyStranger.</li>
            <li>No nudity, sexual content, hate speech, or harassment is permitted.</li>
            <li>Your camera must show you live.</li>
            <li>Violators are subject to immediate and permanent bans.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
