"use client";

import { useEffect, useState } from "react";
import { signalingUrls } from "@/lib/webrtc";

type Props = {
  variant?: "pill" | "text";
  className?: string;
};

const LAUNCH_ACTIVITY_MODE = true;
const LAUNCH_ACTIVITY_MIN = 150;
const LAUNCH_ACTIVITY_MAX = 450;

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function OnlineIndicator({ variant = "text", className = "" }: Props) {
  const [online, setOnline] = useState<number | null>(null);
  const [launchActivity, setLaunchActivity] = useState<number | null>(null);

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

  useEffect(() => {
    if (!LAUNCH_ACTIVITY_MODE) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let active = true;

    // Frontend presentation only; this value is never authoritative or used by matchmaking.
    setLaunchActivity(randomInteger(180, 320));

    const scheduleUpdate = () => {
      timer = setTimeout(() => {
        if (!active) return;

        setLaunchActivity((current) => {
          if (current === null) return randomInteger(180, 320);
          const direction = Math.random() < 0.5 ? -1 : 1;
          const next = current + direction * randomInteger(2, 12);
          return Math.min(LAUNCH_ACTIVITY_MAX, Math.max(LAUNCH_ACTIVITY_MIN, next));
        });
        scheduleUpdate();
      }, randomInteger(4_000, 8_000));
    };

    scheduleUpdate();
    return () => {
      active = false;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  const displayCount =
    online === null
      ? "..."
      : online.toLocaleString();
  const activityLabel = LAUNCH_ACTIVITY_MODE
    ? `${launchActivity === null ? "..." : launchActivity.toLocaleString()} active now`
    : online === null
      ? "Live count unavailable"
      : `${displayCount} ${online === 1 ? "person is" : "people are"} online`;

  if (variant === "pill") {
    return (
      <div
        className={`inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-neutral-200/90 bg-white px-4 text-xs font-black text-neutral-900 shadow-sm transition-colors dark:border-white/15 dark:bg-[#141414] dark:text-zinc-200 ${className}`}
        aria-label={LAUNCH_ACTIVITY_MODE ? activityLabel : "Users currently online"}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span>{LAUNCH_ACTIVITY_MODE ? activityLabel : `${displayCount} online`}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 text-sm font-bold text-neutral-500 dark:text-zinc-400 ${className}`}
      aria-label={LAUNCH_ACTIVITY_MODE ? activityLabel : "Users currently online"}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      {activityLabel}
    </div>
  );
}
