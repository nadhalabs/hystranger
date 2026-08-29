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
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-5" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="report-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-[26px] bg-white p-6 shadow-2xl sm:rounded-[26px]">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><Flag size={20} weight="fill" className="text-rose-600" /><h2 id="report-title" className="text-lg font-black text-ink">Report this stranger</h2></div><button onClick={onClose} aria-label="Close report dialog" className="rounded-full p-2 text-muted hover:bg-canvas"><X size={18} /></button></div>
        <p className="mt-2 text-xs leading-5 text-muted">Your video is not recorded. We save only pseudonymous match details and your selected reason.</p>
        <div className="mt-4 grid gap-2">{reasons.map((item) => <button key={item.value} onClick={() => setReason(item.value)} className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ring-1 transition ${reason === item.value ? "bg-rose-50 text-rose-800 ring-rose-300" : "bg-white text-ink ring-line hover:bg-canvas"}`}>{item.label}</button>)}</div>
        <button disabled={!reason} onClick={() => reason && onReport(reason)} className="mt-4 h-12 w-full rounded-xl bg-rose-600 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-40">Submit report and leave</button>
        <button onClick={onBlock} className="mt-2 h-11 w-full rounded-xl text-sm font-bold text-muted hover:bg-canvas hover:text-ink">Block without reporting</button>
      </section>
    </div>
  );
}
