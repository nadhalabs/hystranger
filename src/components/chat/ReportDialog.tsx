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

type Props = { open: boolean; onClose: () => void; onReport: (reason: ReportReason) => void; onBlock: () => void };

export function ReportDialog({ open, onClose, onReport, onBlock }: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="report-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-[26px] border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl sm:rounded-[26px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flag size={20} weight="fill" className="text-red-400" />
            <h2 id="report-title" className="text-lg font-bold text-white">Report stranger</h2>
          </div>
          <button onClick={onClose} aria-label="Close report dialog" className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition">
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-zinc-400">
          Video is not recorded. Only pseudonymous match metadata and your selected reason are submitted.
        </p>
        <div className="mt-4 grid gap-2">
          {reasons.map((item) => (
            <button
              key={item.value}
              onClick={() => setReason(item.value)}
              className={`rounded-xl px-4 py-3 text-left text-sm font-semibold border transition ${
                reason === item.value
                  ? "bg-red-500/10 border-red-500/40 text-red-300"
                  : "bg-[#151515] border-white/5 text-zinc-200 hover:bg-[#1a1a1a] hover:border-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          disabled={!reason}
          onClick={() => reason && onReport(reason)}
          className="mt-4 h-12 w-full rounded-xl bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit report & leave
        </button>
        <button
          onClick={onBlock}
          className="mt-2 h-11 w-full rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition"
        >
          Block without reporting
        </button>
      </section>
    </div>
  );
}
