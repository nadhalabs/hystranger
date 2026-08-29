"use client";

import { useState } from "react";
import {
  ArrowsOutSimple,
  ArrowsInSimple,
  Camera,
  CameraSlash,
  Gear,
  Microphone,
  MicrophoneSlash,
} from "@phosphor-icons/react/ssr";
import { StreamVideo } from "./StreamVideo";

type Props = {
  stream: MediaStream | null;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  loading: boolean;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
  onOpenSettings: () => void;
  pip?: boolean;
  className?: string;
};

export function LocalVideoPanel({
  stream,
  cameraEnabled,
  microphoneEnabled,
  loading,
  onToggleCamera,
  onToggleMicrophone,
  onOpenSettings,
  pip = false,
  className = "",
}: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setFullscreen(false);
    }
  };

  // PiP (Picture-in-Picture) Mode for Mobile
  if (pip) {
    return (
      <div
        className={`relative aspect-[3/4] w-26 sm:w-32 overflow-hidden rounded-2xl border-2 border-white/30 bg-black shadow-2xl transition-all ${className}`}
      >
        {stream && cameraEnabled ? (
          <StreamVideo
            stream={stream}
            muted
            mirrored
            label="Your video preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-neutral-400 p-2 text-center">
            <CameraSlash size={22} weight="bold" />
            <span className="text-[10px] font-bold">Camera off</span>
          </div>
        )}

        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          You
        </div>
      </div>
    );
  }

  // Full Panel Mode for Desktop
  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-black shadow-sm transition-all dark:border-white/10 sm:rounded-3xl ${className}`}
    >
      {stream && cameraEnabled ? (
        <StreamVideo
          stream={stream}
          muted
          mirrored
          label="Your video"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2.5 text-neutral-400">
          <CameraSlash size={32} weight="bold" />
          <span className="text-xs font-semibold text-neutral-400">
            {loading ? "Initializing camera..." : "Camera is off"}
          </span>
        </div>
      )}

      {/* Top-Left Badge: You + Audio Wave */}
      <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
        <span>You</span>
        <span className="flex items-center gap-0.5 opacity-80" aria-hidden="true">
          <span
            className={`h-2.5 w-0.5 rounded-full bg-white ${
              microphoneEnabled ? "animate-pulse" : "opacity-30"
            }`}
          />
          <span
            className={`h-3.5 w-0.5 rounded-full bg-white ${
              microphoneEnabled ? "animate-pulse delay-75" : "opacity-30"
            }`}
          />
          <span
            className={`h-2 w-0.5 rounded-full bg-white ${
              microphoneEnabled ? "animate-pulse delay-150" : "opacity-30"
            }`}
          />
        </span>
      </div>

      {/* Bottom-Left Floating Media Capsule */}
      <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={onToggleMicrophone}
          disabled={loading}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            microphoneEnabled
              ? "text-white hover:bg-white/20"
              : "bg-red-500/20 text-red-300"
          }`}
          title={microphoneEnabled ? "Mute microphone" : "Unmute microphone"}
          aria-label={microphoneEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {microphoneEnabled ? (
            <Microphone size={16} weight="fill" />
          ) : (
            <MicrophoneSlash size={16} weight="fill" />
          )}
        </button>

        <button
          type="button"
          onClick={onToggleCamera}
          disabled={loading}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            cameraEnabled
              ? "text-white hover:bg-white/20"
              : "bg-red-500/20 text-red-300"
          }`}
          title={cameraEnabled ? "Turn camera off" : "Turn camera on"}
          aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"}
        >
          {cameraEnabled ? (
            <Camera size={16} weight="fill" />
          ) : (
            <CameraSlash size={16} weight="fill" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20 hover:text-white"
          title="Device settings"
          aria-label="Device settings"
        >
          <Gear size={16} weight="bold" />
        </button>
      </div>

      {/* Bottom-Right Fullscreen Toggle */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute bottom-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md transition hover:bg-black/80 hover:text-white"
        title="Toggle fullscreen"
        aria-label="Toggle fullscreen"
      >
        {fullscreen ? (
          <ArrowsInSimple size={16} weight="bold" />
        ) : (
          <ArrowsOutSimple size={16} weight="bold" />
        )}
      </button>
    </div>
  );
}
