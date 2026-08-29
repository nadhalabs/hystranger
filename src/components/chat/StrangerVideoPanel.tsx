"use client";

import { useEffect, useState } from "react";
import {
  DotsThree,
  Flag,
  PhoneDisconnect,
  WarningCircle,
  WifiSlash,
} from "@phosphor-icons/react/ssr";
import { StreamVideo } from "./StreamVideo";
import type { CallPhase } from "@/types/signaling";

type Props = {
  stream: MediaStream | null;
  phase: CallPhase;
  error: string | null;
  onFindAnother: () => void;
  onCancelSearch: () => void;
  onReport: () => void;
  onStop: () => void;
  children?: React.ReactNode;
  className?: string;
};

export function StrangerVideoPanel({
  stream,
  phase,
  error,
  onFindAnother,
  onCancelSearch,
  onReport,
  onStop,
  children,
  className = "",
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!navigator.onLine);

    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const connected = phase === "connected";
  const searching = phase === "searching" || phase === "connecting-signal";
  const peerConnecting = phase === "connecting-peer";
  const peerLeft = phase === "peer-left";
  const hasError = phase === "error";

  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-black shadow-sm transition-all dark:border-white/10 sm:rounded-3xl ${className}`}
    >
      {stream && connected && !isOffline ? (
        <StreamVideo
          stream={stream}
          label="Stranger video"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
          {isOffline ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/15 text-red-400 animate-pulse">
                <WifiSlash size={28} weight="bold" />
              </div>
              <p className="text-base font-bold text-white">No internet connection</p>
              <p className="max-w-xs text-xs text-neutral-400">
                Please check your network. hyStranger will reconnect once you are back online.
              </p>
              <button
                type="button"
                onClick={onFindAnother}
                className="mt-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              >
                Retry connection
              </button>
            </div>
          ) : (
            <>
              {(searching || peerConnecting) && (
                <div className="flex flex-col items-center gap-3">
                  {/* Subtle radar pulse */}
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/20" />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20">
                      <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {searching ? "Looking for someone..." : "Connecting..."}
                  </p>
                  <p className="max-w-xs text-xs text-neutral-400">
                    {searching
                      ? "Hang tight. Finding someone new."
                      : "Establishing secure peer connection."}
                  </p>
                  {searching && (
                    <button
                      type="button"
                      onClick={onCancelSearch}
                      className="mt-3 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-neutral-200 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              {peerLeft && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-neutral-400">
                    <PhoneDisconnect size={24} />
                  </div>
                  <p className="text-base font-bold text-white">They left the chat.</p>
                  <p className="text-xs text-neutral-400">Ready to meet someone else?</p>
                  <button
                    type="button"
                    onClick={onFindAnother}
                    className="mt-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-black transition hover:bg-neutral-200 active:scale-95"
                  >
                    Meet someone else
                  </button>
                </div>
              )}

              {hasError && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                    <WarningCircle size={24} />
                  </div>
                  <p className="text-base font-bold text-white">Connection interrupted</p>
                  <p className="max-w-xs text-xs text-neutral-400">
                    {error || "We couldn’t reach the peer connection."}
                  </p>
                  <button
                    type="button"
                    onClick={onFindAnother}
                    className="mt-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-black transition hover:bg-neutral-200 active:scale-95"
                  >
                    Meet someone else
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Top-Left Badge: Stranger + Audio Wave */}
      <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
        <span>Stranger</span>
        <span className="flex items-center gap-0.5 opacity-80" aria-hidden="true">
          <span className={`h-2.5 w-0.5 rounded-full bg-white ${connected && !isOffline ? "animate-pulse" : ""}`} />
          <span className={`h-3.5 w-0.5 rounded-full bg-white ${connected && !isOffline ? "animate-pulse delay-75" : ""}`} />
          <span className={`h-2 w-0.5 rounded-full bg-white ${connected && !isOffline ? "animate-pulse delay-150" : ""}`} />
        </span>
      </div>

      {/* Optional Children (e.g. Mobile PiP floating window) */}
      {children}

      {/* Top-Right Report Button (Desktop only if no PiP) */}
      {!children && (
        <button
          type="button"
          onClick={onReport}
          className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md transition hover:bg-black/80 hover:text-white"
          title="Report stranger"
          aria-label="Report stranger"
        >
          <Flag size={16} />
        </button>
      )}

      {/* Bottom-Right More Options Button */}
      <div className="absolute bottom-3.5 right-3.5 z-10">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md transition hover:bg-black/80 hover:text-white"
          title="More options"
          aria-label="More options"
        >
          <DotsThree size={20} weight="bold" />
        </button>

        {menuOpen && (
          <div
            className="absolute bottom-11 right-0 w-36 overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/95 p-1 text-xs text-white shadow-xl backdrop-blur-md"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onReport();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-neutral-200 hover:bg-white/10 hover:text-white"
            >
              <Flag size={14} /> Report
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onStop();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-red-400 hover:bg-red-500/15"
            >
              <PhoneDisconnect size={14} /> Leave
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
