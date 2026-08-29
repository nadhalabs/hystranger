"use client";

import Link from "next/link";
import { ArrowLeft, Check, LockKey, VideoCamera } from "@phosphor-icons/react";
import { useMediaSetup } from "@/hooks/useMediaSetup";
import { useRelayCall } from "@/hooks/useRelayCall";
import { RelayExperience } from "@/components/chat/RelayExperience";
import { CameraPreview } from "./CameraPreview";
import { DeviceSelect } from "./DeviceSelect";
import { MediaControls } from "./MediaControls";
import { PermissionState } from "./PermissionState";

export function VideoPreparation() {
  const media = useMediaSetup();
  const call = useRelayCall(media.stream);

  if (call.phase !== "idle") return <RelayExperience media={media} call={call} />;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <Link href="/" onClick={media.stopStream} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"><ArrowLeft size={18} /> Back home</Link>
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <CameraPreview stream={media.stream} cameraEnabled={media.cameraEnabled} loading={media.loading} />
          {media.stream && <div className="mt-3"><MediaControls cameraEnabled={media.cameraEnabled} microphoneEnabled={media.microphoneEnabled} disabled={media.loading} onCamera={media.toggleCamera} onMicrophone={media.toggleMicrophone} /></div>}
        </div>

        <section className="pt-1 lg:pt-4">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Before you join</span>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink sm:text-4xl">Look and sound good?</h1>
          <p className="mt-3 text-sm leading-6 text-muted">Set up your camera and microphone. You’ll have another chance to leave before any conversation begins.</p>

          <div className="mt-6"><PermissionState issue={media.issue} /></div>

          {!media.stream ? (
            <button type="button" onClick={() => void media.requestMedia()} disabled={media.loading} className="mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-accent px-6 font-bold text-white shadow-[0_8px_24px_rgba(255,107,94,0.22)] transition hover:bg-accent-dark disabled:cursor-wait disabled:opacity-60">
              <VideoCamera size={21} weight="fill" /> {media.issue ? "Try again" : "Allow camera & microphone"}
            </button>
          ) : (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <DeviceSelect label="Camera" devices={media.cameras} value={media.cameraId} onChange={(value) => void media.switchCamera(value)} disabled={media.loading} />
                <DeviceSelect label="Microphone" devices={media.microphones} value={media.microphoneId} onChange={(value) => void media.switchMicrophone(value)} disabled={media.loading} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold text-muted">
                <div className="flex items-center gap-2"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${media.hasCamera ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}><Check size={12} weight="bold" /></span> Camera detected</div>
                <div className="flex items-center gap-2"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${media.hasMicrophone ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}><Check size={12} weight="bold" /></span> Microphone detected</div>
              </div>
              {media.isReady && (
                <button type="button" onClick={() => void call.start()} className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 font-bold text-white transition hover:bg-ink/90 focus:outline-none focus:ring-4 focus:ring-ink/10">
                  Continue <span aria-hidden>→</span>
                </button>
              )}
            </>
          )}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted"><LockKey size={13} weight="fill" /> Your preview stays on this device</p>
        </section>
      </div>
    </main>
  );
}
