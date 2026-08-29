"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChatCircleDots,
  Flag,
  Heart,
  LockKey,
  PhoneDisconnect,
  Question,
  ShieldCheck,
} from "@phosphor-icons/react/ssr";
import type { useMediaSetup } from "@/hooks/useMediaSetup";
import type { useRelayCall } from "@/hooks/useRelayCall";
import type { ReportReason } from "@/types/signaling";

import { Logo } from "@/components/Logo";
import { OnlineIndicator } from "@/components/OnlineIndicator";
import { ThemeToggle } from "./ThemeToggle";
import { StrangerVideoPanel } from "./StrangerVideoPanel";
import { LocalVideoPanel } from "./LocalVideoPanel";
import { WelcomeCard } from "./WelcomeCard";
import { ChatPanel } from "./ChatPanel";
import { DeviceSettingsModal } from "./DeviceSettingsModal";
import { ReportDialog } from "./ReportDialog";
import { SafetyEntryDialog } from "@/components/SafetyEntryDialog";

type MediaController = ReturnType<typeof useMediaSetup>;
type CallController = ReturnType<typeof useRelayCall>;
type Props = { media: MediaController; call: CallController };

export function RelayExperience({ media, call }: Props) {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [safetyInfoOpen, setSafetyInfoOpen] = useState(false);

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
        if (settingsOpen) {
          setSettingsOpen(false);
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
  }, [call, connected, searching, peerLeft, hasError, reportOpen, settingsOpen, chatOpen]);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#f8f9fa] text-neutral-900 transition-colors dark:bg-[#080808] dark:text-white select-none overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex h-13 shrink-0 items-center justify-between border-b border-neutral-200/80 bg-white/90 px-3.5 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-[#080808]/90 sm:h-15 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Pill */}
          <ThemeToggle />

          {/* Real Live Online Count */}
          <OnlineIndicator variant="pill" />

          {/* Safety Rules / Info Button */}
          <button
            type="button"
            onClick={() => setSafetyInfoOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-100/90 text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-white/10 dark:bg-[#121212] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
            title="Safety guidelines"
            aria-label="Safety guidelines"
          >
            <ShieldCheck size={17} weight="bold" />
          </button>
        </div>
      </header>

      {/* ================= DESKTOP VIEW (>= 1024px) ================= */}
      <main className="hidden min-h-0 flex-1 p-4 lg:grid lg:grid-cols-[40%_60%] lg:gap-4 lg:overflow-hidden">
        {/* Left Video Column */}
        <section
          aria-label="Video surfaces"
          className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden"
        >
          {/* Top: Stranger Video Panel */}
          <StrangerVideoPanel
            stream={call.remoteStream}
            phase={call.phase}
            error={call.error}
            onFindAnother={call.findAnother}
            onCancelSearch={call.cancelSearch}
            onReport={() => setReportOpen(true)}
            onStop={stop}
          />

          {/* Bottom: Local / Self Video Panel */}
          <LocalVideoPanel
            stream={media.stream}
            loading={media.loading}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </section>

        {/* Right Interaction Column */}
        <section
          aria-label="Interaction panel"
          className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden"
        >
          {/* Top: Welcome & Principles Card */}
          <WelcomeCard className="shrink-0" />

          {/* Bottom: Chat Card with Persistent Action Bar */}
          <ChatPanel
            messages={call.messages}
            onSend={call.sendChat}
            onNext={call.findAnother}
            onReport={() => setReportOpen(true)}
            onStop={stop}
            nextDisabled={searching || peerConnecting}
            connected={connected}
            searching={searching}
          />
        </section>
      </main>

      {/* ================= MOBILE VIEW (< 1024px) ================= */}
      <div className="flex min-h-0 flex-1 flex-col p-2.5 pb-24 overflow-hidden lg:hidden">
        {/* Unified Mobile Video Stage */}
        <StrangerVideoPanel
          stream={call.remoteStream}
          phase={call.phase}
          error={call.error}
          onFindAnother={call.findAnother}
          onCancelSearch={call.cancelSearch}
          onReport={() => setReportOpen(true)}
          onStop={stop}
          className="h-full w-full"
        >
          {/* Floating PiP Self Camera Preview */}
          <LocalVideoPanel
            pip
            stream={media.stream}
            loading={media.loading}
            className="absolute top-3 right-3 z-20"
          />
        </StrangerVideoPanel>
      </div>

      {/* ================= ELEVATED FULL MOBILE BOTTOM ACTION BAR ================= */}
      <div className="fixed bottom-4 inset-x-3 sm:inset-x-6 z-30 flex items-center gap-2.5 rounded-[28px] border-2 border-neutral-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-[#121212]/95 lg:hidden">
        {/* Prominent Full Next Button */}
        <button
          type="button"
          onClick={call.findAnother}
          disabled={searching || peerConnecting}
          className="flex h-16 flex-1 items-center justify-between rounded-2xl bg-neutral-950 px-6 text-white shadow-xl transition hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          <div className="flex flex-col items-start text-left">
            <span className="flex items-center gap-2 text-lg font-black leading-tight">
              Next <ArrowRight size={18} weight="bold" />
            </span>
            <span className="text-xs font-bold text-neutral-300 dark:text-neutral-600">
              Find new match
            </span>
          </div>
        </button>

        {/* Chat Drawer Toggle Button */}
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-neutral-200/90 bg-neutral-100 text-neutral-900 shadow-sm transition active:scale-95 dark:border-white/15 dark:bg-[#1c1c1c] dark:text-white"
          aria-label="Open chat"
          title="Open chat"
        >
          <ChatCircleDots size={26} weight="bold" />
          {call.messages.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white shadow-md dark:bg-white dark:text-black">
              {call.messages.length}
            </span>
          )}
        </button>

        {/* Report Button */}
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-neutral-200/90 bg-neutral-100 text-neutral-800 shadow-sm transition active:scale-95 dark:border-white/15 dark:bg-[#1c1c1c] dark:text-zinc-200"
          title="Report stranger"
          aria-label="Report stranger"
        >
          <Flag size={22} weight="bold" />
        </button>

        {/* Leave / Disconnect */}
        <button
          type="button"
          onClick={stop}
          className="flex h-16 w-15 shrink-0 items-center justify-center rounded-2xl border-2 border-red-200 bg-red-100 text-red-600 shadow-sm transition hover:bg-red-200 active:scale-95 dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-400"
          title="Leave chat"
          aria-label="Leave chat"
        >
          <PhoneDisconnect size={22} weight="bold" />
        </button>
      </div>

      {/* ================= MOBILE CHAT BOTTOM SHEET ================= */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="w-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatPanel
              mobile
              messages={call.messages}
              onSend={call.sendChat}
              onNext={call.findAnother}
              onReport={() => {
                setChatOpen(false);
                setReportOpen(true);
              }}
              onStop={() => {
                setChatOpen(false);
                stop();
              }}
              nextDisabled={searching || peerConnecting}
              connected={connected}
              searching={searching}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Reassurance Footer Bar */}
      <footer className="hidden h-9 shrink-0 items-center justify-between border-t border-neutral-200/60 bg-white/50 px-6 text-[11px] text-neutral-500 dark:border-white/5 dark:bg-[#080808] dark:text-zinc-500 lg:flex">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <LockKey size={13} weight="bold" />
            <span>No account required</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} weight="bold" />
            <span>Direct peer-to-peer</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Heart size={13} weight="fill" className="text-neutral-400 dark:text-zinc-500" />
            <span>Be kind</span>
          </div>

          <button
            type="button"
            onClick={() => setSafetyInfoOpen(true)}
            className="flex items-center gap-1 text-neutral-500 transition hover:text-neutral-900 dark:text-zinc-500 dark:hover:text-white"
          >
            <Question size={13} weight="bold" />
            <span>Help</span>
          </button>
        </div>
      </footer>

      {/* Device Settings Modal */}
      <DeviceSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        media={media}
      />

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

      {/* Safety Info Dialog */}
      <SafetyEntryDialog
        open={safetyInfoOpen}
        onClose={() => setSafetyInfoOpen(false)}
        onAccept={() => setSafetyInfoOpen(false)}
      />
    </div>
  );
}
