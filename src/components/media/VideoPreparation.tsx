"use client";

import Link from "next/link";
import { ArrowLeft, Check, LockKey, VideoCamera } from "@phosphor-icons/react/ssr";
import { useMediaSetup } from "@/hooks/useMediaSetup";
import { useRelayCall } from "@/hooks/useRelayCall";
import { RelayExperience } from "@/components/chat/RelayExperience";
import { Navbar } from "@/components/Navbar";
import { CameraPreview } from "./CameraPreview";
import { DeviceSelect } from "./DeviceSelect";
import { MediaControls } from "./MediaControls";
import { PermissionState } from "./PermissionState";

export function VideoPreparation() {
  const media = useMediaSetup();
  const call = useRelayCall(media.stream);

  if (call.phase !== "idle") return <RelayExperience media={media} call={call} />;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          onClick={media.stopStream}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} /> Back home
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <CameraPreview
              stream={media.stream}
              cameraEnabled={media.cameraEnabled}
              loading={media.loading}
            />
            {media.stream && (
              <div className="mt-3">
                <MediaControls
                  cameraEnabled={media.cameraEnabled}
                  microphoneEnabled={media.microphoneEnabled}
                  disabled={media.loading}
                  onCamera={media.toggleCamera}
                  onMicrophone={media.toggleMicrophone}
                />
              </div>
            )}
          </div>

          <section className="pt-1 lg:pt-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-zinc-400">
              Before you join
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Look and sound good?
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-zinc-400">
              Set up your camera and microphone. You’ll have another chance to leave before any conversation begins.
            </p>

            <div className="mt-6">
              <PermissionState issue={media.issue} />
            </div>

            {!media.stream ? (
              <button
                type="button"
                onClick={() => void media.requestMedia()}
                disabled={media.loading}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-neutral-900 px-6 font-bold text-white shadow-lg transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <VideoCamera size={21} weight="fill" />{" "}
                {media.issue ? "Try again" : "Allow camera & microphone"}
              </button>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <DeviceSelect
                    label="Camera"
                    devices={media.cameras}
                    value={media.cameraId}
                    onChange={(value) => void media.switchCamera(value)}
                    disabled={media.loading}
                  />
                  <DeviceSelect
                    label="Microphone"
                    devices={media.microphones}
                    value={media.microphoneId}
                    onChange={(value) => void media.switchMicrophone(value)}
                    disabled={media.loading}
                  />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold text-neutral-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        media.hasCamera
                          ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      }`}
                    >
                      <Check size={12} weight="bold" />
                    </span>{" "}
                    Camera detected
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        media.hasMicrophone
                          ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      }`}
                    >
                      <Check size={12} weight="bold" />
                    </span>{" "}
                    Microphone detected
                  </div>
                </div>
                {media.isReady && (
                  <button
                    type="button"
                    onClick={() => void call.start()}
                    className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 font-bold text-white transition hover:bg-neutral-800 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-neutral-300 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white/20"
                  >
                    Continue <span aria-hidden>→</span>
                  </button>
                )}
              </>
            )}
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400 dark:text-zinc-500">
              <LockKey size={13} weight="fill" /> Your preview stays on this device
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
