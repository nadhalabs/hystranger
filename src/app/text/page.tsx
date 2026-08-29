import { ComingSoon } from "@/components/ComingSoon";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function TextPage() {
  return <div className="flex min-h-screen flex-col"><Navbar /><ComingSoon /><Footer /></div>;
}
