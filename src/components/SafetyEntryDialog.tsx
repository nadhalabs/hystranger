"use client";

import { useState } from "react";
import { ShieldCheck, X } from "@phosphor-icons/react/ssr";

type Props = { open: boolean; onClose: () => void; onAccept: () => void };

export function SafetyEntryDialog({ open, onClose, onAccept }: Props) {
  const [adult, setAdult] = useState(false);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-[28px] border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl sm:rounded-[28px] sm:p-7"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
            <ShieldCheck size={25} weight="fill" />
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <h2 id="safety-title" className="mt-5 text-2xl font-black tracking-tight text-white">
          A quick safety check
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          You’ll meet real strangers. Leave whenever you want, keep personal details private, and report inappropriate behavior.
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#141414] p-4">
          <input
            type="checkbox"
            checked={adult}
            onChange={(event) => setAdult(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-white"
          />
          <span className="text-sm font-semibold leading-5 text-white">
            I’m 18 or older and agree to treat others respectfully.
          </span>
        </label>

        <button
          disabled={!adult}
          onClick={() => {
            localStorage.setItem("nadha-relay-safety-accepted", "1");
            onAccept();
          }}
          className="mt-5 h-13 w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-black transition hover:bg-zinc-200 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          I understand — continue
        </button>
        <p className="mt-3 text-center text-[11px] leading-4 text-zinc-500">
          hyStranger does not record your video.
        </p>
      </section>
    </div>
  );
}
