"use client";

import { useEffect, useState } from "react";
import { signalingUrls } from "@/lib/webrtc";

export function OnlineIndicator() {
  const [online, setOnline] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(signalingUrls().stats, { cache: "no-store" });
        const data = await response.json() as { online: number };
        if (active) setOnline(data.online);
      } catch { if (active) setOnline(null); }
    };
    void load();
    const timer = setInterval(load, 20_000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium text-muted" aria-label="People currently online">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      {online === null ? "Live count unavailable" : `${online} ${online === 1 ? "person is" : "people are"} exploring now`}
    </div>
  );
}
