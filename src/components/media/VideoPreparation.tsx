"use client";

import Link from "next/link";
import { ArrowLeft, LockKey, VideoCamera } from "@phosphor-icons/react/ssr";
import { useMediaSetup } from "@/hooks/useMediaSetup";
import { useRelayCall } from "@/hooks/useRelayCall";
import { RelayExperience } from "@/components/chat/RelayExperience";
import { Navbar } from "@/components/Navbar";
import { CameraPreview } from "./CameraPreview";
import { DeviceSelect } from "./DeviceSelect";
import { PermissionState } from "./PermissionState";

export function VideoPreparation() {
  const media = useMediaSetup();
  const call = useRelayCall(media.stream);

  if (call.phase !== "idle") return <RelayExperience media={media} call={call} />;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-4 sm:px-8 sm:py-6">
        <div className="mb-4">
          <Link
            href="/"
            onClick={media.stopStream}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 transition hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Camera Preview */}
          <div className="w-full">
            <CameraPreview
              stream={media.stream}
              cameraEnabled={true}
              loading={media.loading}
            />
          </div>

          {/* Controls & Continue (Immediately Visible, No Scrolling) */}
          <section className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-zinc-400">
              Quick Setup
            </span>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
              Ready to meet someone?
            </h1>
            <p className="mt-1.5 text-xs leading-5 text-neutral-500 dark:text-zinc-400">
              Your camera and microphone are live and stay on while connected.
            </p>

            <div className="mt-3">
              <PermissionState issue={media.issue} />
            </div>

            {!media.stream ? (
              <button
                type="button"
                onClick={() => void media.requestMedia()}
                disabled={media.loading}
                className="mt-4 flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl bg-neutral-900 px-6 font-bold text-white shadow-lg transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <VideoCamera size={20} weight="fill" />{" "}
                {media.issue ? "Try again" : "Allow camera & microphone"}
              </button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="grid gap-2.5 sm:grid-cols-2">
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

                {media.isReady && (
                  <button
                    type="button"
                    onClick={() => void call.start()}
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 font-extrabold text-white shadow-lg transition hover:bg-neutral-800 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-neutral-300 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white/20"
                  >
                    <span>Continue to Match</span>
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            )}

            <p className="mt-3 flex items-center justify-center gap-1 text-center text-[11px] text-neutral-400 dark:text-zinc-500">
              <LockKey size={12} weight="fill" /> Preview stays on this device · Leave anytime
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
