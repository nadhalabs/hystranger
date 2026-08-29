import { Info, WarningCircle } from "@phosphor-icons/react/ssr";
import type { MediaIssue } from "@/types/media";

export function PermissionState({ issue }: { issue: MediaIssue | null }) {
  if (!issue) {
    return (
      <div className="flex gap-3 rounded-2xl border border-white/10 bg-[#121212] p-4 text-left">
        <Info size={21} weight="fill" className="mt-0.5 shrink-0 text-zinc-300" />
        <div>
          <p className="text-sm font-bold text-white">Browser permission required</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            hyStranger uses your camera and microphone only while you’re in a video chat.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left">
      <WarningCircle size={21} weight="fill" className="mt-0.5 shrink-0 text-red-400" />
      <div>
        <p className="text-sm font-bold text-white">{issue.title}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-400">{issue.message}</p>
      </div>
    </div>
  );
}
