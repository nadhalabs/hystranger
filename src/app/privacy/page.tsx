import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
  return <div className="flex min-h-screen flex-col"><Navbar /><main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8"><h1 className="text-4xl font-black tracking-[-0.04em]">Privacy</h1><p className="mt-5 leading-8 text-muted">During media setup, your camera preview remains local to your browser. A complete privacy policy will be published before public launch.</p></main><Footer /></div>;
}
