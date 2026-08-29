"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, ChatCircleDots, X } from "@phosphor-icons/react";
import type { ChatItem } from "@/types/signaling";

type Props = { messages: ChatItem[]; onSend: (text: string) => boolean; mobile?: boolean; onClose?: () => void };

export function ChatPanel({ messages, onSend, mobile = false, onClose }: Props) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (onSend(text)) setText("");
  };

  return (
    <section className={`flex min-h-0 flex-col bg-white ${mobile ? "h-[72vh] rounded-t-[26px] shadow-2xl" : "h-full border-l border-line"}`} aria-label="Text chat">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <div className="flex items-center gap-2.5"><ChatCircleDots size={21} weight="fill" className="text-accent" /><div><h2 className="text-sm font-bold text-ink">Chat</h2><p className="text-[11px] text-muted">Messages disappear after this call</p></div></div>
        {onClose && <button onClick={onClose} className="rounded-full p-2 text-muted hover:bg-canvas" aria-label="Close chat"><X size={19} /></button>}
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-5" aria-live="polite">
        {messages.length === 0 && <div className="my-auto px-4 text-center"><p className="text-sm font-bold text-ink">Break the ice</p><p className="mt-1 text-xs leading-5 text-muted">Say hello or ask what made their day interesting.</p></div>}
        {messages.map((message) => (
          <div key={message.id} className={`max-w-[85%] ${message.author === "you" ? "ml-auto" : "mr-auto"}`}>
            <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.author === "you" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-canvas text-ink ring-1 ring-line"}`}>{message.text}</div>
            <p className={`mt-1 text-[10px] text-muted ${message.author === "you" ? "text-right" : "text-left"}`}>{new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="shrink-0 border-t border-line p-3.5">
        <div className="flex items-end gap-2 rounded-2xl bg-canvas p-2 ring-1 ring-line focus-within:ring-ink/20">
          <textarea value={text} maxLength={500} rows={1} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(event); } }} placeholder="Type a message…" className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-muted/70" />
          <button type="submit" disabled={!text.trim()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-dark disabled:opacity-35" aria-label="Send message"><ArrowUp size={17} weight="bold" /></button>
        </div>
        <p className="mt-1.5 text-right text-[10px] text-muted">{text.length}/500</p>
      </form>
    </section>
  );
}
