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
        className={`flex h-9 w-[68px] items-center justify-between rounded-full border border-neutral-200 bg-neutral-100 p-1 dark:border-white/10 dark:bg-[#121212] ${className}`}
        aria-hidden="true"
      >
        <div className="h-7 w-7 rounded-full" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative flex h-9 w-[68px] items-center justify-between rounded-full border border-neutral-200/80 bg-neutral-100/90 p-1 transition-colors hover:border-neutral-300 dark:border-white/10 dark:bg-[#121212] dark:hover:border-white/20 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-sm transition-all duration-200 dark:bg-neutral-800 ${
          isDark ? "left-[36px]" : "left-1"
        }`}
      />
      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center transition-colors ${
          !isDark ? "text-neutral-900" : "text-neutral-400"
        }`}
      >
        <Sun size={15} weight={!isDark ? "fill" : "regular"} />
      </span>
      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center transition-colors ${
          isDark ? "text-white" : "text-neutral-400"
        }`}
      >
        <Moon size={15} weight={isDark ? "fill" : "regular"} />
      </span>
    </button>
  );
}
