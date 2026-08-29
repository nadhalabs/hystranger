"use client";

import { useEffect, useState } from "react";
import { WifiHigh, WifiSlash } from "@phosphor-icons/react/ssr";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowRestored(true);
        const timer = setTimeout(() => setShowRestored(false), 3500);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  if (!isOnline) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="fixed top-3 left-1/2 z-[100] flex max-w-sm -translate-x-1/2 items-center gap-2.5 rounded-full border border-red-300 bg-red-50/95 px-4 py-2 text-xs font-bold text-red-700 shadow-xl backdrop-blur-md dark:border-red-500/40 dark:bg-red-950/90 dark:text-red-200 animate-bounce"
      >
        <WifiSlash size={16} weight="bold" className="shrink-0 animate-pulse text-red-600 dark:text-red-400" />
        <span>No internet connection. Reconnecting…</span>
      </div>
    );
  }

  if (showRestored) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-3 left-1/2 z-[100] flex max-w-sm -translate-x-1/2 items-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-50/95 px-4 py-2 text-xs font-bold text-emerald-800 shadow-xl backdrop-blur-md dark:border-emerald-500/40 dark:bg-emerald-950/90 dark:text-emerald-200 transition-opacity"
      >
        <WifiHigh size={16} weight="bold" className="shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Internet restored. Back online!</span>
      </div>
    );
  }

  return null;
}
