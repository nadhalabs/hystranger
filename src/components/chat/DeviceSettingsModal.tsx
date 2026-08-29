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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-settings-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[32px] border-2 border-neutral-200/90 bg-white p-7 shadow-2xl transition-colors dark:border-white/15 dark:bg-[#141414] text-neutral-900 dark:text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5">
              <Gear size={22} weight="bold" />
            </div>
            <h2 id="device-settings-title" className="text-lg font-black">
              Device Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20 dark:hover:text-white transition"
          >
            <X size={19} weight="bold" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
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
          className="mt-7 flex h-16 w-full items-center justify-center rounded-2xl bg-neutral-950 text-base font-black text-white shadow-2xl transition hover:bg-neutral-800 active:scale-[0.99] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}
