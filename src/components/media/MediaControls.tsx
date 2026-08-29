"use client";

import { Camera, CameraSlash, Microphone, MicrophoneSlash } from "@phosphor-icons/react";

type Props = {
  cameraEnabled: boolean; microphoneEnabled: boolean; disabled: boolean;
  onCamera: () => void; onMicrophone: () => void;
};

export function MediaControls({ cameraEnabled, microphoneEnabled, disabled, onCamera, onMicrophone }: Props) {
  const base = "flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" disabled={disabled} onClick={onCamera} className={`${base} ${cameraEnabled ? "bg-white text-ink ring-1 ring-line" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`}>
        {cameraEnabled ? <Camera size={20} weight="fill" /> : <CameraSlash size={20} weight="fill" />}
        Camera {cameraEnabled ? "on" : "off"}
      </button>
      <button type="button" disabled={disabled} onClick={onMicrophone} className={`${base} ${microphoneEnabled ? "bg-white text-ink ring-1 ring-line" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`}>
        {microphoneEnabled ? <Microphone size={20} weight="fill" /> : <MicrophoneSlash size={20} weight="fill" />}
        Mic {microphoneEnabled ? "on" : "muted"}
      </button>
    </div>
  );
}
