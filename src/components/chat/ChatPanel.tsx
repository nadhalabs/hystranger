"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { PaperPlaneRight, X } from "@phosphor-icons/react/ssr";
import type { ChatItem } from "@/types/signaling";

type Props = {
  messages: ChatItem[];
  onSend: (text: string) => boolean;
  onNext?: () => void;
  nextDisabled?: boolean;
  connected?: boolean;
  searching?: boolean;
  mobile?: boolean;
  onClose?: () => void;
};

export function ChatPanel({
  messages,
  onSend,
  onNext,
  nextDisabled = false,
  connected = false,
  searching = false,
  mobile = false,
  onClose,
}: Props) {
  const [text, setText] = useState("");
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

  return (
    <section
      className={`flex min-h-0 flex-1 flex-col ${
        mobile
          ? "h-[80vh] rounded-t-[24px] border-t border-white/10 bg-[#0f0f0f] p-4 shadow-2xl"
          : "h-full"
      }`}
      aria-label="Text chat"
    >
      {mobile && (
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-sm font-bold text-white">Chat</span>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c0c] p-4"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="my-auto text-center px-4">
            <p className="text-xs font-medium text-zinc-500">
              {connected
                ? "Say hello! Messages disappear when the call ends."
                : searching
                ? "Searching for a stranger..."
                : "Messages will appear here once connected."}
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
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-5 break-words ${
                    isYou
                      ? "rounded-br-sm bg-white text-[#080808] font-medium"
                      : "rounded-bl-sm bg-[#181818] text-zinc-100 border border-white/5"
                  }`}
                >
                  {message.text}
                </div>
                <p
                  className={`mt-1 text-[10px] text-zinc-500 ${
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

      {/* Bottom Controls: Next Button + Message Input */}
      <div className="mt-3 flex items-stretch gap-3">
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="flex h-14 min-w-[96px] flex-col items-center justify-center rounded-xl bg-white px-5 text-center font-bold text-black transition hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            title="Find another person (Esc)"
          >
            <span className="text-sm font-extrabold leading-tight">Next</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Esc
            </span>
          </button>
        )}

        <form
          onSubmit={submit}
          className="flex h-14 flex-1 items-center rounded-xl border border-white/10 bg-[#0c0c0c] px-4 transition focus-within:border-white/30"
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            maxLength={500}
            disabled={!connected}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              connected ? "Type a message…" : "Waiting for connection…"
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={!connected || !text.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Send message"
          >
            <PaperPlaneRight size={18} weight="bold" />
          </button>
        </form>
      </div>
    </section>
  );
}
