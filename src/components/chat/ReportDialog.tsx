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
        className="w-full max-w-md rounded-t-[28px] border border-neutral-200/80 bg-white p-6 shadow-2xl transition-colors dark:border-white/10 dark:bg-[#141414] sm:rounded-[28px]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <Flag size={18} weight="fill" />
            </div>
            <h2
              id="report-title"
              className="text-lg font-bold text-neutral-900 dark:text-white"
            >
              Report stranger
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report dialog"
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-zinc-400">
          Video is not recorded. Only pseudonymous match metadata and your selected reason are submitted.
        </p>

        <div className="mt-4 grid gap-2">
          {reasons.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setReason(item.value)}
              className={`rounded-xl px-4 py-3 text-left text-sm font-semibold border transition ${
                reason === item.value
                  ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-500/15 dark:border-red-500/40 dark:text-red-300"
                  : "bg-neutral-50 border-neutral-200/70 text-neutral-800 hover:bg-neutral-100 dark:bg-[#1c1c1c] dark:border-white/5 dark:text-zinc-200 dark:hover:bg-[#222]"
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
          className="mt-4 h-12 w-full rounded-xl bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit report & leave
        </button>

        <button
          type="button"
          onClick={onBlock}
          className="mt-2 h-11 w-full rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white transition"
        >
          Block without reporting
        </button>
      </section>
    </div>
  );
}
