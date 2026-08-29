"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatCircleDots, VideoCamera } from "@phosphor-icons/react/ssr";
import { InterestsInput } from "./InterestsInput";
import { OnlineIndicator } from "./OnlineIndicator";
import { SafetyNotice } from "./SafetyNotice";
import { SafetyEntryDialog } from "./SafetyEntryDialog";

export function Hero() {
  const [interests, setInterests] = useState("");
  const router = useRouter();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const navigate = (path: string) => {
    if (typeof window !== "undefined" && !localStorage.getItem("nadha-relay-safety-accepted")) {
      setPendingPath(path);
      return;
    }
    finishNavigate(path);
  };

  const finishNavigate = (path: string) => {
    const query = interests.trim() ? `?interests=${encodeURIComponent(interests.trim())}` : "";
    router.push(`${path}${query}`);
  };

  return (
    <main className="relative isolate flex flex-1 overflow-hidden bg-[#080808]">
      {/* Subtle monochrome ambient backlight */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-96 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-5 py-14 text-center sm:px-8 sm:py-20 lg:min-h-[calc(100vh-138px)] lg:py-24">
        <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-[#121212] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 shadow-sm">
          A conversation can change your day
        </div>
        <h1 className="max-w-3xl text-[42px] font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[72px]">
          Meet someone new, <span className="text-zinc-400">right now.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-lg">
          Drop into a spontaneous one-to-one conversation. Choose video or text, bring your curiosity, and say hello.
        </p>

        <div className="mt-8 w-full max-w-[510px] sm:mt-10">
          <InterestsInput value={interests} onChange={setInterests} />
          <div className="mt-3 grid gap-3 sm:grid-cols-[1.35fr_1fr]">
            <button
              onClick={() => navigate("/video")}
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-white px-6 font-bold text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-200 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              <VideoCamera size={21} weight="fill" aria-hidden /> Video chat
            </button>
            <button
              onClick={() => navigate("/text")}
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-[#121212] px-6 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#181818] hover:border-white/20 focus:outline-none focus:ring-4 focus:ring-white/10"
            >
              <ChatCircleDots size={21} weight="bold" aria-hidden /> Text chat
            </button>
          </div>
        </div>

        <div className="mt-6"><OnlineIndicator /></div>
        <div className="mt-8 w-full"><SafetyNotice /></div>
        <p id="how-it-works" className="mt-5 text-xs text-zinc-500">No account needed · End a chat whenever you like</p>
      </section>
      <SafetyEntryDialog open={Boolean(pendingPath)} onClose={() => setPendingPath(null)} onAccept={() => { const path = pendingPath; setPendingPath(null); if (path) finishNavigate(path); }} />
    </main>
  );
}
