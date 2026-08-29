"use client";

import { useEffect, useRef } from "react";
import { CameraSlash, SpinnerGap } from "@phosphor-icons/react";

type Props = { stream: MediaStream | null; cameraEnabled: boolean; loading: boolean };

export function CameraPreview({ stream, cameraEnabled, loading }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-ink shadow-soft sm:aspect-video lg:aspect-[4/3]">
      <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" aria-label="Your camera preview" />
      {(!stream || !cameraEnabled || loading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink text-white">
          {loading ? <SpinnerGap size={34} className="animate-spin text-accent" /> : <CameraSlash size={35} className="text-white/55" weight="duotone" />}
          <span className="text-sm font-medium text-white/70">{loading ? "Starting your devices…" : cameraEnabled ? "Camera preview will appear here" : "Camera is off"}</span>
        </div>
      )}
      <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">You</div>
    </div>
  );
}
