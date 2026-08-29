"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react/ssr";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("hystranger-theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  if (!mounted) {
    return (
      <div
        className={`flex h-11 w-[76px] items-center justify-between rounded-full border-2 border-neutral-200/90 bg-neutral-100 p-1 dark:border-white/15 dark:bg-[#141414] ${className}`}
        aria-hidden="true"
      >
        <div className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative flex h-11 w-[76px] items-center justify-between rounded-full border-2 border-neutral-200/90 bg-neutral-100/90 p-1 shadow-sm transition-all hover:border-neutral-400 dark:border-white/15 dark:bg-[#141414] dark:hover:border-white/30 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-md transition-all duration-200 dark:bg-neutral-800 ${
          isDark ? "left-[38px]" : "left-1"
        }`}
      />
      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center transition-colors ${
          !isDark ? "text-neutral-950" : "text-neutral-400"
        }`}
      >
        <Sun size={17} weight={!isDark ? "fill" : "bold"} />
      </span>
      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center transition-colors ${
          isDark ? "text-white" : "text-neutral-400"
        }`}
      >
        <Moon size={17} weight={isDark ? "fill" : "bold"} />
      </span>
    </button>
  );
}
