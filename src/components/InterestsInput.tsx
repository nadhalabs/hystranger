import { Sparkle } from "@phosphor-icons/react/ssr";

type Props = { value: string; onChange: (value: string) => void };

export function InterestsInput({ value, onChange }: Props) {
  return (
    <label className="block text-left">
      <span className="mb-2.5 block text-xs font-black uppercase tracking-[0.14em] text-neutral-500 dark:text-zinc-400">
        What are you into?
      </span>
      <span className="flex h-16 items-center gap-3.5 rounded-2xl border-2 border-neutral-200/90 bg-white px-5 shadow-sm transition focus-within:border-neutral-500 focus-within:ring-4 focus-within:ring-neutral-200/60 dark:border-white/15 dark:bg-[#141414] dark:focus-within:border-white/40 dark:focus-within:ring-white/10">
        <Sparkle size={22} className="shrink-0 text-neutral-400 dark:text-zinc-400" weight="fill" aria-hidden />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Music, travel, movies, coding..."
          className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-zinc-500"
          aria-label="Your interests"
        />
      </span>
    </label>
  );
}
