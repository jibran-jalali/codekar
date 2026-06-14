"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, X } from "lucide-react";

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
    content: "Hi, I'm CodeKar AI.\nAsk me about the workshop, pricing, or enrollment.",
  },
];

const quickActions = ["Show cohorts", "Help me book", "What will I build?", "Refund"];

const codeKarIconUrl = "/icon.svg";

function formatPrice(cohort: Cohort) {
  const price = cohort.sale_price ?? cohort.original_price;
  if (price === null) return "Price TBA";
  if (Number(price) === 0) return "Free";
  return `PKR ${Number(price).toLocaleString()}`;
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
        className={`fixed bottom-5 right-5 z-[80] flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white text-black shadow-[0_20px_60px_rgba(255,255,255,0.25)] transition-all hover:scale-[1.03] hover:border-cyan-200 active:scale-95 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:justify-start sm:gap-3 sm:px-3 sm:py-2.5 ${open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
        aria-label="Open CodeKar AI chat"
      >
        <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-inner ring-2 ring-black/10 sm:h-11 sm:w-11">
          <Image src={codeKarIconUrl} alt="" width={44} height={44} className="h-9 w-9 object-contain sm:h-8 sm:w-8" />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-bold leading-tight">CodeKar AI</span>
          <span className="block text-xs text-black/55">Ask about the workshop</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-4 z-[90] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px]">
          <div className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-[24px] border border-cyan-200/20 bg-[linear-gradient(145deg,#030712_0%,#050505_28%,#111827_56%,#1e1b4b_78%,#3b0764_100%)] text-white shadow-[0_30px_100px_rgba(0,0,0,0.75),0_0_80px_rgba(79,70,229,0.22)] backdrop-blur-xl">
            <div className="relative border-b border-cyan-200/15 bg-[linear-gradient(135deg,rgba(34,211,238,0.16)_0%,rgba(79,70,229,0.22)_42%,rgba(219,39,119,0.18)_100%)] p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.18)_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_36%,rgba(255,255,255,0.14)_0_1px,transparent_1.5px),radial-gradient(circle_at_44%_78%,rgba(255,255,255,0.12)_0_1px,transparent_1.5px)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#020617_0%,#111827_48%,#312e81_100%)] shadow-lg ring-2 ring-cyan-200/30">
                    <Image src={codeKarIconUrl} alt="CodeKar" width={44} height={44} className="h-10 w-10 object-contain" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold leading-tight">CodeKar AI</h2>
                    <p className="mt-1 text-xs text-white/55">Workshop, cohorts, and booking help</p>
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
                        ? "bg-[linear-gradient(135deg,#22d3ee_0%,#818cf8_48%,#f472b6_100%)] text-black font-semibold rounded-br-sm"
                        : "border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.09)_0%,rgba(79,70,229,0.12)_48%,rgba(219,39,119,0.08)_100%)] text-white/90 backdrop-blur-md rounded-bl-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {visibleCohorts.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(0,0,0,0.55)_0%,rgba(30,27,75,0.32)_55%,rgba(59,7,100,0.26)_100%)] p-3">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200">Active CodeKar cohorts</p>
                  {visibleCohorts.map((cohort) => (
                    <Link
                      key={cohort.id}
                      href="/enroll"
                      className="block rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(34,211,238,0.06)_45%,rgba(244,114,182,0.06)_100%)] p-3 transition hover:from-white/[0.12]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold">{cohort.name || "CodeKar Cohort"}</p>
                          <p className="mt-1 truncate text-xs text-white/55">{cohort.dates || "Dates TBA"} - {cohort.time || "Time TBA"}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[linear-gradient(135deg,#22d3ee,#f472b6)] px-2.5 py-1 text-[11px] font-bold text-black">
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
                    className="min-w-0 rounded-full border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(79,70,229,0.12),rgba(219,39,119,0.08))] px-3 py-2 text-xs font-medium text-white/80 transition hover:border-fuchsia-300/35 hover:text-white sm:shrink-0"
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
                className="flex items-end gap-2 rounded-2xl border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(17,24,39,0.9)_0%,rgba(30,27,75,0.72)_52%,rgba(0,0,0,0.78)_100%)] shadow-inner p-2 backdrop-blur-lg transition-all focus-within:border-fuchsia-300/45"
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#22d3ee_0%,#818cf8_48%,#f472b6_100%)] text-black shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
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
