"use client";

import { Camera, CameraSlash, Microphone, MicrophoneSlash } from "@phosphor-icons/react/ssr";

type Props = {
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  disabled: boolean;
  onCamera: () => void;
  onMicrophone: () => void;
};

export function MediaControls({
  cameraEnabled,
  microphoneEnabled,
  disabled,
  onCamera,
  onMicrophone,
}: Props) {
  const base =
    "flex h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 shadow-sm";

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onCamera}
        className={`${base} ${
          cameraEnabled
            ? "border border-neutral-200/80 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:bg-[#151515] dark:text-white dark:hover:bg-[#202020]"
            : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
        }`}
      >
        {cameraEnabled ? <Camera size={19} weight="fill" /> : <CameraSlash size={19} weight="fill" />}
        Camera {cameraEnabled ? "on" : "off"}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onMicrophone}
        className={`${base} ${
          microphoneEnabled
            ? "border border-neutral-200/80 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:bg-[#151515] dark:text-white dark:hover:bg-[#202020]"
            : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
        }`}
      >
        {microphoneEnabled ? <Microphone size={19} weight="fill" /> : <MicrophoneSlash size={19} weight="fill" />}
        Mic {microphoneEnabled ? "on" : "muted"}
      </button>
    </div>
  );
}
