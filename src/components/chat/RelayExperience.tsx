"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  CameraSlash,
  ChatCircleDots,
  Flag,
  LockKey,
  Microphone,
  MicrophoneSlash,
  Moon,
  PhoneDisconnect,
  Prohibit,
  ShieldCheck,
  SpinnerGap,
  UsersThree,
  VideoCamera,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import type { useMediaSetup } from "@/hooks/useMediaSetup";
import type { useRelayCall } from "@/hooks/useRelayCall";
import { Logo } from "@/components/Logo";
import { OnlineIndicator } from "@/components/OnlineIndicator";
import { ChatPanel } from "./ChatPanel";
import { StreamVideo } from "./StreamVideo";
import { ReportDialog } from "./ReportDialog";
import type { ReportReason } from "@/types/signaling";

type MediaController = ReturnType<typeof useMediaSetup>;
type CallController = ReturnType<typeof useRelayCall>;
type Props = { media: MediaController; call: CallController };

export function RelayExperience({ media, call }: Props) {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const connected = call.phase === "connected";
  const searching = call.phase === "searching" || call.phase === "connecting-signal";
  const peerConnecting = call.phase === "connecting-peer";
  const peerLeft = call.phase === "peer-left";
  const hasError = call.phase === "error";

  const stop = () => {
    call.stop();
    media.stopStream();
    router.push("/");
  };

  // Keyboard shortcut: Esc to trigger Next or Cancel Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (reportOpen) {
          setReportOpen(false);
          return;
        }
        if (chatOpen) {
          setChatOpen(false);
          return;
        }
        if (searching) {
          call.cancelSearch();
        } else if (connected || peerLeft || hasError) {
          call.findAnother();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [call, connected, searching, peerLeft, hasError, reportOpen, chatOpen]);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#080808] text-white select-none overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#121212] px-3 py-1 text-xs font-semibold text-zinc-300">
            <Moon size={13} weight="fill" className="text-zinc-400" />
            <span>Dark</span>
          </div>

          <OnlineIndicator variant="pill" />
        </div>
      </header>

      {/* Main Content Area (Desktop: 40% Left Video Column / 60% Right Column) */}
      <main className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 lg:grid lg:grid-cols-[40%_60%] lg:gap-4 lg:p-5">
        {/* ================= LEFT VIDEO COLUMN ================= */}
        <section
          aria-label="Video containers"
          className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-4"
        >
          {/* Top Video: Stranger / Remote */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-lg">
            {call.remoteStream ? (
              <StreamVideo
                stream={call.remoteStream}
                label="Stranger video"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                {(searching || peerConnecting) && (
                  <div className="flex flex-col items-center gap-3">
                    <SpinnerGap size={36} className="animate-spin text-white" />
                    <p className="text-base font-bold text-white">
                      {searching ? "Finding someone…" : "Connecting…"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Looking for someone to connect with
                    </p>
                    {searching && (
                      <button
                        type="button"
                        onClick={call.cancelSearch}
                        className="mt-3 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        Cancel search
                      </button>
                    )}
                  </div>
                )}

                {peerLeft && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400">
                      <PhoneDisconnect size={24} />
                    </div>
                    <p className="text-base font-bold text-white">
                      Stranger disconnected
                    </p>
                    <p className="text-xs text-zinc-400">
                      Ready to meet someone else?
                    </p>
                    <button
                      type="button"
                      onClick={call.findAnother}
                      className="mt-2 rounded-xl bg-white px-5 py-2.5 text-xs font-extrabold text-black transition hover:bg-zinc-200"
                    >
                      Find another
                    </button>
                  </div>
                )}

                {hasError && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                      <WarningCircle size={24} />
                    </div>
                    <p className="text-base font-bold text-white">
                      Connection interrupted
                    </p>
                    <p className="text-xs text-zinc-400">
                      {call.error || "Ready to meet someone else?"}
                    </p>
                    <button
                      type="button"
                      onClick={call.findAnother}
                      className="mt-2 rounded-xl bg-white px-5 py-2.5 text-xs font-extrabold text-black transition hover:bg-zinc-200"
                    >
                      Find another
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Badge: Stranger */}
            <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <span
                className={`h-2 w-2 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-zinc-500"
                }`}
              />
              <span>Stranger</span>
            </div>

            {/* Report Button (Top-Right) */}
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-zinc-400 backdrop-blur-md transition hover:bg-black/80 hover:text-white"
              title="Report user"
              aria-label="Report user"
            >
              <Flag size={15} />
            </button>
          </div>

          {/* Bottom Video: You / Local */}
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-lg">
            {media.cameraEnabled ? (
              <StreamVideo
                stream={media.stream}
                muted
                mirrored
                label="Your video"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500">
                <CameraSlash size={32} />
                <span className="text-xs font-medium">Camera is off</span>
              </div>
            )}

            {/* Badge: You */}
            <div className="absolute left-3.5 top-3.5 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
              You
            </div>

            {/* Media & Stop Controls (Bottom-Right overlay) */}
            <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={media.toggleMicrophone}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition ${
                  media.microphoneEnabled
                    ? "border-white/10 bg-black/60 text-white hover:bg-black/80"
                    : "border-red-500/40 bg-red-500/20 text-red-300"
                }`}
                title={media.microphoneEnabled ? "Mute microphone" : "Unmute microphone"}
                aria-label={media.microphoneEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {media.microphoneEnabled ? (
                  <Microphone size={16} weight="fill" />
                ) : (
                  <MicrophoneSlash size={16} weight="fill" />
                )}
              </button>

              <button
                type="button"
                onClick={media.toggleCamera}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition ${
                  media.cameraEnabled
                    ? "border-white/10 bg-black/60 text-white hover:bg-black/80"
                    : "border-red-500/40 bg-red-500/20 text-red-300"
                }`}
                title={media.cameraEnabled ? "Turn camera off" : "Turn camera on"}
                aria-label={media.cameraEnabled ? "Turn camera off" : "Turn camera on"}
              >
                {media.cameraEnabled ? (
                  <Camera size={16} weight="fill" />
                ) : (
                  <CameraSlash size={16} weight="fill" />
                )}
              </button>

              <button
                type="button"
                onClick={stop}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-3 text-xs font-bold text-zinc-300 backdrop-blur-md transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300"
                title="Leave and return home"
              >
                <PhoneDisconnect size={15} />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= RIGHT INTERACTION COLUMN ================= */}
        <section
          aria-label="Interaction and chat"
          className="hidden min-h-0 flex-col gap-3 lg:flex"
        >
          {/* Welcome & Community Safety Card */}
          <div className="shrink-0 rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 xl:p-5">
            <h1 className="text-lg font-bold tracking-tight text-white xl:text-xl">
              Welcome to hyStranger.
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-zinc-200">
                18+
              </span>
              <span className="text-xs font-bold text-white">
                You must be 18 or older
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0 text-zinc-400" />
                <span>No nudity, hate speech, or harassment</span>
              </div>
              <div className="flex items-center gap-2">
                <VideoCamera size={16} className="shrink-0 text-zinc-400" />
                <span>Your camera must show you live</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersThree size={16} className="shrink-0 text-zinc-400" />
                <span>Keep it respectful — treat strangers kindly</span>
              </div>
              <div className="flex items-center gap-2">
                <Prohibit size={16} className="shrink-0 text-zinc-400" />
                <span>Violators will be permanently banned</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-zinc-500">
              By using hyStranger, you agree to our{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-zinc-300 underline underline-offset-2 hover:text-white"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>

          {/* Chat & Bottom Controls */}
          <div className="flex min-h-0 flex-1 flex-col">
            <ChatPanel
              messages={call.messages}
              onSend={call.sendChat}
              onNext={call.findAnother}
              nextDisabled={searching || peerConnecting}
              connected={connected}
              searching={searching}
            />
          </div>
        </section>
      </main>

      {/* Mobile Floating Controls Bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#0c0c0c] px-4 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={call.findAnother}
          disabled={searching || peerConnecting}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white px-4 font-bold text-black transition hover:bg-zinc-200 disabled:opacity-40"
        >
          <span className="text-sm font-extrabold">Next</span>
        </button>

        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="ml-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#151515] text-white transition hover:bg-[#202020]"
          aria-label="Open text chat"
        >
          <ChatCircleDots size={20} weight="fill" />
        </button>
      </div>

      {/* Mobile Chat Bottom Sheet */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setChatOpen(false)}
        >
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <ChatPanel
              mobile
              messages={call.messages}
              onSend={call.sendChat}
              onNext={call.findAnother}
              nextDisabled={searching || peerConnecting}
              connected={connected}
              searching={searching}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Reassurance Footer Bar (Desktop) */}
      <footer className="hidden h-9 shrink-0 items-center justify-between border-t border-white/5 bg-[#080808] px-6 text-[11px] text-zinc-500 lg:flex">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          <span>Safe & anonymous</span>
        </div>

        <div className="flex items-center gap-1.5">
          <LockKey size={14} />
          <span>End-to-end encrypted</span>
        </div>

        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition"
        >
          <WarningCircle size={14} />
          <span>Report misuse</span>
        </button>
      </footer>

      {/* Report Dialog */}
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onReport={(reason: ReportReason) => {
          call.report(reason, true);
          setReportOpen(false);
        }}
        onBlock={() => {
          call.block();
          setReportOpen(false);
        }}
      />
    </div>
  );
}
