"use client";

import Link from "next/link";
import {
  Flag,
  LockKey,
  ShieldCheck,
  User,
  VideoCamera,
} from "@phosphor-icons/react/ssr";

export function WelcomeCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-[#121212] sm:rounded-3xl sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-100 text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
          <ShieldCheck size={24} weight="bold" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            Welcome to hyStranger
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-zinc-400 sm:text-sm">
            Connect freely. Be kind. Stay anonymous.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-zinc-300">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-zinc-400">
            <User size={14} weight="bold" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 dark:text-white">Be respectful</span>
            <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
              No hate, abuse or harassment.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-zinc-300">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-zinc-400">
            <ShieldCheck size={14} weight="bold" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 dark:text-white">Play by the rules</span>
            <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
              Breaking rules can get you banned.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-zinc-300">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-zinc-400">
            <VideoCamera size={14} weight="bold" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 dark:text-white">Show your face</span>
            <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
              Keep your camera on and visible.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-zinc-300">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-zinc-400">
            <Flag size={14} weight="bold" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 dark:text-white">Help keep it safe</span>
            <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
              Report bad behavior.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-zinc-300 sm:col-span-2">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-zinc-400">
            <LockKey size={14} weight="bold" />
          </div>
          <div>
            <span className="font-bold text-neutral-900 dark:text-white">Your privacy matters</span>
            <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
              No personal info or socials.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-white/5">
        <p className="text-[11px] text-neutral-400 dark:text-zinc-500">
          By using hyStranger, you agree to our{" "}
          <Link
            href="/terms"
            target="_blank"
            className="font-medium text-neutral-700 underline underline-offset-2 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="font-medium text-neutral-700 underline underline-offset-2 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
