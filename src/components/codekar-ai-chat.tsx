"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot, Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Cohort = {
  id: string;
  name: string | null;
  dates: string | null;
  time: string | null;
  original_price: number | null;
  sale_price: number | null;
  total_spots: number | null;
  delivery_type: string | null;
  description: string | null;
};

const starterMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hi! I'm CodeKar AI 👋\nAsk me anything about the workshop, pricing, or how to enroll.",
  },
];

const quickActions = ["Show cohorts", "Help me book", "What will I build?", "Refund"];

const codeKarLogoUrl =
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

function formatPrice(cohort: Cohort) {
  const price = cohort.sale_price || cohort.original_price;
  return price ? `PKR ${Number(price).toLocaleString()}` : "Price TBA";
}

export default function CodeKarAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleCohorts = useMemo(() => cohorts.slice(0, 2), [cohorts]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, cohorts, loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/codekar-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (Array.isArray(data.cohorts)) {
        setCohorts(data.cohorts);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "I'm here to help! Ask me about the workshop, pricing, or enrollment.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I had trouble connecting. You can still open enrollment or message CodeKar on WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCohorts() {
    try {
      const response = await fetch("/api/codekar-ai");
      const data = await response.json();
      if (Array.isArray(data.cohorts)) {
        setCohorts(data.cohorts);
      }
    } catch {
      setCohorts([]);
    }
  }

  function openChat() {
    setOpen(true);
    loadCohorts();
  }

  return (
    <>
      <button
        type="button"
        onClick={openChat}
        className={`fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-[#a3e635]/30 bg-[#0b0b0b] text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all hover:scale-[1.03] hover:border-[#a3e635]/60 active:scale-95 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:justify-start sm:gap-3 sm:px-4 sm:py-3 ${open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
        aria-label="Open CodeKar AI chat"
      >
        <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white sm:h-10 sm:w-10">
          <Image src={codeKarLogoUrl} alt="" width={40} height={40} className="h-full w-full object-contain p-1" />
          <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#a3e635] text-black ring-2 ring-[#0b0b0b]">
            <Bot className="h-2.5 w-2.5" />
          </span>
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-bold leading-tight">CodeKar AI</span>
          <span className="block text-xs text-[#a3e635]">Official workshop assistant</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-4 z-[90] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px]">
          <div className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-[24px] border border-[#a3e635]/20 bg-[#0b0b0b]/95 text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <div className="relative border-b border-white/10 bg-gradient-to-br from-[#a3e635]/15 via-white/[0.06] to-white/[0.025] p-4">
              <div className="absolute right-6 top-0 h-20 w-20 rounded-full bg-[#a3e635]/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                    <Image src={codeKarLogoUrl} alt="CodeKar" width={48} height={48} className="h-full w-full object-contain p-1.5" />
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#a3e635] text-black ring-2 ring-[#0b0b0b]">
                      <Sparkles className="h-3 w-3" />
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 inline-flex items-center rounded-full border border-[#a3e635]/25 bg-[#a3e635]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a3e635]">
                      Official CodeKar
                    </div>
                    <h2 className="text-base font-bold leading-tight">CodeKar AI</h2>
                    <p className="text-xs text-white/55">Workshop guidance, cohorts, and booking help</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close CodeKar AI chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="chat-scrollbar max-h-[48vh] min-h-[300px] space-y-3 overflow-y-auto overflow-x-hidden p-4 pr-3 sm:max-h-[430px]">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-[#a3e635] to-[#65a30d] text-black font-semibold rounded-br-sm"
                        : "border border-[#a3e635]/15 bg-white/[0.06] text-white/90 backdrop-blur-md rounded-bl-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {visibleCohorts.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-white/10 bg-black/35 p-3">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#a3e635]">Active CodeKar cohorts</p>
                  {visibleCohorts.map((cohort) => (
                    <Link
                      key={cohort.id}
                      href="/enroll"
                      className="block rounded-2xl bg-white/[0.06] p-3 transition hover:bg-white/[0.1]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold">{cohort.name || "CodeKar Cohort"}</p>
                          <p className="mt-1 truncate text-xs text-white/55">{cohort.dates || "Dates TBA"} - {cohort.time || "Time TBA"}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#a3e635] px-2.5 py-1 text-[11px] font-bold text-black">
                          {formatPrice(cohort)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-sm backdrop-blur-md rounded-bl-sm">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="no-scrollbar mb-3 grid grid-cols-2 gap-2 sm:flex sm:overflow-x-auto sm:pb-1">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => sendMessage(action)}
                    className="min-w-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.1] hover:text-white sm:shrink-0"
                  >
                    {action}
                  </button>
                ))}
              </div>



              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#121212]/80 shadow-inner p-2 backdrop-blur-lg focus-within:border-white/30 focus-within:bg-[#1a1a1a]/90 transition-all"
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about cohorts, booking, refund..."
                  className="max-h-24 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a3e635] text-black shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
