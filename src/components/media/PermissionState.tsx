import { Info, WarningCircle } from "@phosphor-icons/react/ssr";
import type { MediaIssue } from "@/types/media";

export function PermissionState({ issue }: { issue: MediaIssue | null }) {
  if (!issue) {
    return (
      <div className="flex gap-3 rounded-2xl bg-sky-50 p-4 text-left ring-1 ring-sky-100">
        <Info size={21} weight="fill" className="mt-0.5 shrink-0 text-sky-600" />
        <div><p className="text-sm font-bold text-ink">Your browser will ask for permission</p><p className="mt-1 text-xs leading-5 text-muted">Nadha Relay uses your camera and microphone only while you’re in a video chat.</p></div>
      </div>
    );
  }
  return (
    <div role="alert" className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-left ring-1 ring-amber-200">
      <WarningCircle size={21} weight="fill" className="mt-0.5 shrink-0 text-amber-600" />
      <div><p className="text-sm font-bold text-ink">{issue.title}</p><p className="mt-1 text-xs leading-5 text-muted">{issue.message}</p></div>
    </div>
  );
}
