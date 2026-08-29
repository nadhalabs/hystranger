"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChatCircleDots,
  DotsThree,
  Flag,
  PaperPlaneRight,
  PhoneDisconnect,
  Smiley,
  X,
} from "@phosphor-icons/react/ssr";
import type { ChatItem } from "@/types/signaling";

type Props = {
  messages: ChatItem[];
  onSend: (text: string) => boolean;
  onNext?: () => void;
  onReport?: () => void;
  onStop?: () => void;
  nextDisabled?: boolean;
  connected?: boolean;
  searching?: boolean;
  mobile?: boolean;
  onClose?: () => void;
  className?: string;
};

export function ChatPanel({
  messages,
  onSend,
  onNext,
  onReport,
  onStop,
  nextDisabled = false,
  connected = false,
  searching = false,
  mobile = false,
  onClose,
  className = "",
}: Props) {
  const [text, setText] = useState("");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = (event?: FormEvent) => {
    if (event) event.preventDefault();
    if (!text.trim()) return;
    if (onSend(text)) {
      setText("");
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <section
      className={`flex min-h-0 flex-1 flex-col rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-[#121212] sm:rounded-3xl sm:p-5 ${
        mobile
          ? "h-[85vh] rounded-t-[32px] border-t border-neutral-200/80 shadow-2xl dark:border-white/15 dark:bg-[#121212]"
          : "h-full"
      } ${className}`}
      aria-label="Text chat"
    >
      {/* Mobile Drag Indicator */}
      {mobile && (
        <div className="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      )}

      {/* Header */}
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-neutral-900 dark:text-white">
            Chat
          </h2>
          {messages.length > 0 && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-extrabold text-neutral-700 dark:bg-white/10 dark:text-zinc-300">
              {messages.length}
            </span>
          )}
        </div>

        {mobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white transition"
            aria-label="Close chat"
          >
            <X size={20} weight="bold" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-neutral-50/60 p-3 transition-colors dark:bg-[#0c0c0c] sm:p-4"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-neutral-800 shadow-sm dark:bg-white/5 dark:text-zinc-300">
              <ChatCircleDots size={28} weight="duotone" />
            </div>
            <p className="mt-3.5 text-base font-black text-neutral-900 dark:text-white">
              Say hello!
            </p>
            <p className="mt-1 max-w-xs text-xs font-medium text-neutral-500 dark:text-zinc-400">
              {connected
                ? "Start a conversation with your match."
                : searching
                ? "Searching for a conversation partner..."
                : "Say something friendly once connected."}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isYou = message.author === "you";
            return (
              <div
                key={message.id}
                className={`max-w-[85%] ${isYou ? "ml-auto" : "mr-auto"}`}
              >
                <div
                  className={`rounded-2xl px-4.5 py-3 text-sm leading-relaxed break-words shadow-sm ${
                    isYou
                      ? "rounded-br-sm bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium"
                      : "rounded-bl-sm border border-neutral-200/70 bg-white text-neutral-900 dark:border-white/5 dark:bg-[#1c1c1c] dark:text-neutral-100"
                  }`}
                >
                  {message.text}
                </div>
                <p
                  className={`mt-1 text-[11px] font-medium text-neutral-400 dark:text-zinc-500 ${
                    isYou ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(message.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Persistent Enlarged Action Bar */}
      <div className="relative mt-3.5 flex items-center gap-2.5 sm:gap-3.5">
        {/* Substantial Next Button (Desktop) */}
        {!mobile && onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="flex h-15 min-w-[155px] shrink-0 items-center justify-between rounded-2xl bg-neutral-900 px-5 text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            title="Next match (Esc)"
          >
            <div className="flex flex-col items-start text-left">
              <span className="flex items-center gap-1.5 text-base font-black leading-tight">
                Next <ArrowRight size={16} weight="bold" />
              </span>
              <span className="text-[11px] font-semibold text-neutral-300 dark:text-neutral-600">
                Find new match
              </span>
            </div>
          </button>
        )}

        {/* Message Input with Emoji Button & Solid Send Button */}
        <form
          onSubmit={submit}
          className="flex h-15 flex-1 items-center gap-2 rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 transition focus-within:border-neutral-400 focus-within:ring-4 focus-within:ring-neutral-200/40 dark:border-white/10 dark:bg-[#181818] dark:focus-within:border-white/30 dark:focus-within:ring-white/5"
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            maxLength={500}
            disabled={!connected}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              connected ? "Type a message..." : "Waiting for match..."
            }
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:placeholder:text-neutral-500 dark:text-white dark:placeholder:text-zinc-500"
          />

          <button
            type="button"
            disabled={!connected}
            onClick={() => insertEmoji(" 👋")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-200/60 hover:text-neutral-900 disabled:opacity-30 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-white"
            title="Wave hello"
            aria-label="Wave hello"
          >
            <Smiley size={21} weight="bold" />
          </button>

          <button
            type="submit"
            disabled={!connected || !text.trim()}
            className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-md transition hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-25 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            aria-label="Send message"
          >
            <PaperPlaneRight size={18} weight="bold" />
          </button>
        </form>

        {/* Substantial Report Button (Desktop) */}
        {!mobile && onReport && (
          <button
            type="button"
            onClick={onReport}
            className="hidden h-15 shrink-0 items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-5 text-sm font-extrabold text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-95 dark:border-white/10 dark:bg-[#181818] dark:text-zinc-300 dark:hover:bg-[#222] md:flex"
            title="Report stranger"
            aria-label="Report stranger"
          >
            <Flag size={17} weight="bold" />
            <span>Report</span>
          </button>
        )}

        {/* Substantial More Options Button (Desktop) */}
        {!mobile && onStop && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="flex h-15 w-14 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-95 dark:border-white/10 dark:bg-[#181818] dark:text-zinc-300 dark:hover:bg-[#222]"
              title="More actions"
              aria-label="More actions"
            >
              <DotsThree size={26} weight="bold" />
            </button>

            {moreMenuOpen && (
              <div
                className="absolute bottom-18 right-0 z-20 w-48 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-1.5 text-xs shadow-2xl transition-colors dark:border-white/15 dark:bg-[#181818]"
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                {onReport && (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onReport();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left font-bold text-neutral-800 transition hover:bg-neutral-100 dark:text-zinc-200 dark:hover:bg-white/10"
                  >
                    <Flag size={16} weight="bold" /> Report stranger
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onStop();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/15"
                >
                  <PhoneDisconnect size={16} weight="bold" /> Leave chat
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
