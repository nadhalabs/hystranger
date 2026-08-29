import { Sparkle } from "@phosphor-icons/react/ssr";

type Props = { value: string; onChange: (value: string) => void };

export function InterestsInput({ value, onChange }: Props) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-neutral-500 dark:text-zinc-400">
        What are you into?
      </span>
      <span className="flex h-14 items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white px-4 shadow-sm transition focus-within:border-neutral-400 focus-within:ring-4 focus-within:ring-neutral-200/50 dark:border-white/10 dark:bg-[#121212] dark:focus-within:border-white/30 dark:focus-within:ring-white/5">
        <Sparkle size={19} className="shrink-0 text-neutral-400 dark:text-zinc-400" weight="fill" aria-hidden />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Music, travel, movies..."
          className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-zinc-500"
          aria-label="Your interests"
        />
      </span>
    </label>
  );
}
