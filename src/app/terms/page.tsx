import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return <div className="flex min-h-screen flex-col"><Navbar /><main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8"><h1 className="text-4xl font-black tracking-[-0.04em]">Terms</h1><p className="mt-5 leading-8 text-muted">Nadha Relay is currently in development. Full community guidelines and terms will be published before public launch.</p></main><Footer /></div>;
}
