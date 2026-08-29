"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowClockwise, Camera, CameraSlash, ChatCircleDots, Flag, Microphone, MicrophoneSlash, PhoneDisconnect, SpinnerGap, UsersThree, X } from "@phosphor-icons/react/ssr";
import type { useMediaSetup } from "@/hooks/useMediaSetup";
import type { useRelayCall } from "@/hooks/useRelayCall";
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

  const stop = () => {
    call.stop();
    media.stopStream();
    router.push("/");
  };

  const status = connected ? "Connected" : peerConnecting ? "Connecting securely" : searching ? "Finding someone" : "Conversation ended";

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#f2f2ef] lg:h-[calc(100vh-68px)] lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-5 lg:p-6">
        <div className="mb-3 flex shrink-0 items-center justify-between sm:mb-4">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm ring-1 ring-line">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : searching || peerConnecting ? "animate-pulse bg-amber-400" : "bg-rose-400"}`} />{status}
          </div>
          <div className="flex items-center gap-1"><button onClick={() => setReportOpen(true)} disabled={!connected} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-muted transition hover:bg-white hover:text-rose-700 disabled:opacity-35"><Flag size={15} /> Report</button><button onClick={stop} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50"><X size={17} weight="bold" /> Stop</button></div>
        </div>

        <section className="relative min-h-[430px] flex-1 overflow-hidden rounded-[24px] bg-ink shadow-soft sm:min-h-[520px] lg:min-h-0">
          {call.remoteStream ? (
            <StreamVideo stream={call.remoteStream} label="Stranger video" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              {(searching || peerConnecting) && <SpinnerGap size={42} className="animate-spin text-accent" />}
              {call.phase === "peer-left" && <PhoneDisconnect size={44} weight="duotone" className="text-white/60" />}
              {call.phase === "error" && <ArrowClockwise size={44} weight="duotone" className="text-white/60" />}
              <h1 className="mt-5 text-2xl font-black tracking-[-0.03em]">{searching ? "Finding someone…" : peerConnecting ? "Making a secure connection…" : call.phase === "peer-left" ? "Stranger disconnected" : "Connection interrupted"}</h1>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">{searching ? "Hang tight. This usually only takes a moment." : peerConnecting ? "Your video stays peer-to-peer." : call.error || "Ready to meet someone else?"}</p>
              {searching && <button onClick={call.cancelSearch} className="mt-6 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">Cancel search</button>}
              {(call.phase === "peer-left" || call.phase === "error") && <button onClick={call.findAnother} className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-dark">Find another person</button>}
            </div>
          )}

          <div className="absolute right-3 top-3 aspect-[3/4] w-[92px] overflow-hidden rounded-2xl border-2 border-white/70 bg-[#263650] shadow-lg sm:right-5 sm:top-5 sm:w-36 lg:w-40">
            {media.cameraEnabled ? <StreamVideo stream={media.stream} muted mirrored label="Your video" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60"><CameraSlash size={25} /><span className="text-[10px] font-bold">Camera off</span></div>}
            <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-bold text-white">You</span>
          </div>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2.5 px-3 sm:bottom-5">
            <button onClick={media.toggleMicrophone} className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition ${media.microphoneEnabled ? "bg-white text-ink hover:bg-canvas" : "bg-rose-600 text-white"}`} aria-label={media.microphoneEnabled ? "Mute microphone" : "Unmute microphone"}>{media.microphoneEnabled ? <Microphone size={20} weight="fill" /> : <MicrophoneSlash size={20} weight="fill" />}</button>
            <button onClick={media.toggleCamera} className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition ${media.cameraEnabled ? "bg-white text-ink hover:bg-canvas" : "bg-rose-600 text-white"}`} aria-label={media.cameraEnabled ? "Turn camera off" : "Turn camera on"}>{media.cameraEnabled ? <Camera size={20} weight="fill" /> : <CameraSlash size={20} weight="fill" />}</button>
            <button onClick={call.findAnother} disabled={searching || peerConnecting} className="flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm font-black text-white shadow-lg transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"><UsersThree size={20} weight="fill" /> Next</button>
            <button onClick={() => setChatOpen(true)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-lg lg:hidden" aria-label="Open text chat"><ChatCircleDots size={20} weight="fill" /></button>
          </div>
        </section>
      </div>

      <aside className="hidden w-[340px] shrink-0 lg:block xl:w-[380px]"><ChatPanel messages={call.messages} onSend={call.sendChat} /></aside>

      {chatOpen && <div className="fixed inset-0 z-50 flex items-end bg-ink/40 lg:hidden" onClick={() => setChatOpen(false)}><div className="w-full" onClick={(event) => event.stopPropagation()}><ChatPanel mobile messages={call.messages} onSend={call.sendChat} onClose={() => setChatOpen(false)} /></div></div>}
      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} onReport={(reason: ReportReason) => { call.report(reason, true); setReportOpen(false); }} onBlock={() => { call.block(); setReportOpen(false); }} />
    </main>
  );
}
