"use client";

import { useState } from "react";
import { ShieldCheck, X } from "@phosphor-icons/react/ssr";

type Props = { open: boolean; onClose: () => void; onAccept: () => void };

export function SafetyEntryDialog({ open, onClose, onAccept }: Props) {
  const [adult, setAdult] = useState(false);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-[32px] border-2 border-neutral-200/90 bg-white p-6 shadow-2xl transition-colors dark:border-white/15 dark:bg-[#141414] sm:rounded-[32px] sm:p-7 text-neutral-900 dark:text-white"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-neutral-200/90 bg-neutral-100 text-neutral-950 dark:border-white/15 dark:bg-white/5 dark:text-white">
            <ShieldCheck size={28} weight="fill" />
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20 dark:hover:text-white transition"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <h2 id="safety-title" className="mt-5 text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
          A quick safety check
        </h2>
        <p className="mt-2 text-sm leading-6 font-medium text-neutral-500 dark:text-zinc-400">
          You’ll meet real strangers. Leave whenever you want, keep personal details private, and report inappropriate behavior.
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 border-neutral-200/90 bg-neutral-50 p-4.5 dark:border-white/15 dark:bg-[#1a1a1a]">
          <input
            type="checkbox"
            checked={adult}
            onChange={(event) => setAdult(event.target.checked)}
            className="mt-0.5 h-5 w-5 accent-neutral-950 dark:accent-white"
          />
          <span className="text-sm font-bold leading-5 text-neutral-800 dark:text-zinc-200">
            I’m 18 or older and agree to treat others respectfully.
          </span>
        </label>

        <button
          disabled={!adult}
          onClick={() => {
            localStorage.setItem("nadha-relay-safety-accepted", "1");
            onAccept();
          }}
          className="mt-5 flex h-16 w-full items-center justify-center rounded-2xl bg-neutral-950 px-6 text-base font-black text-white shadow-2xl transition hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-400/20 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white/20"
        >
          I understand — continue
        </button>
        <p className="mt-3 text-center text-[11px] font-semibold text-neutral-400 dark:text-zinc-500">
          hyStranger does not record your video.
        </p>
      </section>
    </div>
  );
}
