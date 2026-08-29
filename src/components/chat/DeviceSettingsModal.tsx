"use client";

import { DeviceSelect } from "@/components/media/DeviceSelect";
import { Gear, X } from "@phosphor-icons/react/ssr";
import type { useMediaSetup } from "@/hooks/useMediaSetup";

type Props = {
  open: boolean;
  onClose: () => void;
  media: ReturnType<typeof useMediaSetup>;
};

export function DeviceSettingsModal({ open, onClose, media }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-settings-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xl transition-colors dark:border-white/10 dark:bg-[#141414] text-neutral-900 dark:text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/5">
              <Gear size={18} weight="bold" />
            </div>
            <h2 id="device-settings-title" className="text-base font-extrabold">
              Device Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <DeviceSelect
            label="Camera"
            devices={media.cameras}
            value={media.cameraId}
            onChange={(val) => void media.switchCamera(val)}
            disabled={media.loading}
          />

          <DeviceSelect
            label="Microphone"
            devices={media.microphones}
            value={media.microphoneId}
            onChange={(val) => void media.switchMicrophone(val)}
            disabled={media.loading}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-11 w-full rounded-xl bg-neutral-900 font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}
