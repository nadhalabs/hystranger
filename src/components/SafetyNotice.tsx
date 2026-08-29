import { ShieldCheck } from "@phosphor-icons/react/ssr";

export function SafetyNotice() {
  return (
    <div
      id="safety"
      className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3.5 text-left shadow-sm transition-colors dark:border-white/10 dark:bg-[#121212]"
    >
      <ShieldCheck className="mt-0.5 shrink-0 text-neutral-800 dark:text-zinc-300" size={21} weight="fill" aria-hidden />
      <p className="text-xs leading-5 text-neutral-500 dark:text-zinc-400">
        Be kind, protect your identity, and leave any conversation that feels uncomfortable. You’re always in control.
      </p>
    </div>
  );
}
