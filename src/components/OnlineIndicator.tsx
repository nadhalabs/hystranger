"use client";

import { useEffect, useState } from "react";
import { signalingUrls } from "@/lib/webrtc";

type Props = {
  variant?: "pill" | "text";
  className?: string;
};

export function OnlineIndicator({ variant = "text", className = "" }: Props) {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(signalingUrls().stats, { cache: "no-store" });
        const data = await response.json() as { online: number };
        if (active) setOnline(data.online);
      } catch {
        if (active) setOnline(null);
      }
    };
    void load();
    const timer = setInterval(load, 20_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const displayCount =
    online === null
      ? "..."
      : online.toLocaleString();

  if (variant === "pill") {
    return (
      <div
        className={`inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-neutral-200/90 bg-white px-4 text-xs font-black text-neutral-900 shadow-sm transition-colors dark:border-white/15 dark:bg-[#141414] dark:text-zinc-200 ${className}`}
        aria-label="Users currently online"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span>{displayCount} online</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 text-sm font-bold text-neutral-500 dark:text-zinc-400 ${className}`}
      aria-label="Users currently online"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      {online === null ? "Live count unavailable" : `${displayCount} ${online === 1 ? "person is" : "people are"} online`}
    </div>
  );
}
