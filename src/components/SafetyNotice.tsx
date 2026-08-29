import { ShieldCheck } from "@phosphor-icons/react/ssr";

export function SafetyNotice() {
  return (
    <div id="safety" className="mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-white px-4 py-3.5 text-left shadow-sm ring-1 ring-line">
      <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={21} weight="fill" aria-hidden />
      <p className="text-xs leading-5 text-muted">
        Be kind, protect your identity, and leave any conversation that feels uncomfortable. You’re always in control.
      </p>
    </div>
  );
}
