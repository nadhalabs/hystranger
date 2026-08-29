import { ShieldCheck } from "@phosphor-icons/react/ssr";

export function SafetyNotice() {
  return (
    <div id="safety" className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-[#121212] px-4 py-3.5 text-left shadow-sm">
      <ShieldCheck className="mt-0.5 shrink-0 text-zinc-300" size={21} weight="fill" aria-hidden />
      <p className="text-xs leading-5 text-zinc-400">
        Be kind, protect your identity, and leave any conversation that feels uncomfortable. You’re always in control.
      </p>
    </div>
  );
}
