import { Info, WarningCircle } from "@phosphor-icons/react/ssr";
import type { MediaIssue } from "@/types/media";

export function PermissionState({ issue }: { issue: MediaIssue | null }) {
  if (!issue) {
    return (
      <div className="flex gap-3 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4 text-left dark:border-white/10 dark:bg-[#121212]">
        <Info size={21} weight="fill" className="mt-0.5 shrink-0 text-neutral-700 dark:text-zinc-300" />
        <div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white">Browser permission required</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-zinc-400">
            hyStranger uses your camera and microphone only while you’re in a video chat.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left dark:border-red-500/30 dark:bg-red-500/10">
      <WarningCircle size={21} weight="fill" className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
      <div>
        <p className="text-sm font-bold text-red-900 dark:text-white">{issue.title}</p>
        <p className="mt-1 text-xs leading-5 text-red-700 dark:text-zinc-400">{issue.message}</p>
      </div>
    </div>
  );
}
