"use client";

import { useState } from "react";
import { Flag, X } from "@phosphor-icons/react/ssr";
import type { ReportReason } from "@/types/signaling";

const reasons: Array<{ value: ReportReason; label: string }> = [
  { value: "sexual_content", label: "Nudity or sexual content" },
  { value: "harassment", label: "Harassment or hateful behavior" },
  { value: "violence", label: "Violence or threats" },
  { value: "underage", label: "Underage concern" },
  { value: "spam", label: "Spam or bot" },
  { value: "other", label: "Something else" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onReport: (reason: ReportReason) => void;
  onBlock: () => void;
};

export function ReportDialog({ open, onClose, onReport, onBlock }: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-[32px] border-2 border-neutral-200/90 bg-white p-6 shadow-2xl transition-colors dark:border-white/15 dark:bg-[#141414] sm:rounded-[32px] sm:p-7"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <Flag size={22} weight="fill" />
            </div>
            <h2
              id="report-title"
              className="text-xl font-black text-neutral-900 dark:text-white"
            >
              Report stranger
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report dialog"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20 dark:hover:text-white transition"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <p className="mt-2.5 text-xs leading-5 font-medium text-neutral-500 dark:text-zinc-400">
          Video is not recorded. Only pseudonymous match metadata and your selected reason are submitted.
        </p>

        <div className="mt-4 grid gap-2.5">
          {reasons.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setReason(item.value)}
              className={`rounded-2xl px-5 py-3.5 text-left text-sm font-bold border-2 transition active:scale-[0.99] ${
                reason === item.value
                  ? "bg-red-50 border-red-400 text-red-700 dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-300 shadow-sm"
                  : "bg-neutral-50 border-neutral-200/90 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 dark:bg-[#1c1c1c] dark:border-white/10 dark:text-zinc-200 dark:hover:bg-[#222]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          disabled={!reason}
          type="button"
          onClick={() => reason && onReport(reason)}
          className="mt-5 flex h-16 w-full items-center justify-center rounded-2xl bg-red-600 text-base font-black text-white shadow-2xl transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit report & leave
        </button>

        <button
          type="button"
          onClick={onBlock}
          className="mt-2.5 flex h-13 w-full items-center justify-center rounded-2xl text-sm font-bold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white transition"
        >
          Block without reporting
        </button>
      </section>
    </div>
  );
}
