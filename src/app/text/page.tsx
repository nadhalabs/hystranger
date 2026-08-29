import { ComingSoon } from "@/components/ComingSoon";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function TextPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />
      <ComingSoon />
      <Footer />
    </div>
  );
}
