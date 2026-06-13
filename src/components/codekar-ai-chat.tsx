"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bot, CalendarDays, ChevronRight, MessageCircle, Minimize2, Send, Sparkles, X } from "lucide-react";

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
    content:
      "Hi, I am CodeKar AI. I can help you see cohorts, understand the chatbot workshop, book your seat, or find the right section on this page.",
  },
];

const quickActions = [
  "Show active cohorts",
  "Help me book",
  "What will I build?",
  "Refund guarantee",
];

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

  const visibleCohorts = useMemo(() => cohorts.slice(0, 3), [cohorts]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

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
          content: data.reply || "I can help with cohorts, booking, pricing, and what you will build.",
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
        className={`fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-full border border-white/15 bg-white text-black px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all hover:scale-[1.03] active:scale-95 sm:bottom-6 sm:right-6 ${open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
        aria-label="Open CodeKar AI chat"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
          <Bot className="h-5 w-5" />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-bold leading-tight">CodeKar AI</span>
          <span className="block text-xs text-black/60">Ask before booking</span>
        </span>
        <MessageCircle className="h-4 w-4 sm:hidden" />
      </button>

      {open && (
        <div className="fixed inset-x-3 bottom-3 z-[90] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[410px]">
          <div className="overflow-hidden rounded-[28px] border border-white/15 bg-[#0b0b0b]/95 text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <div className="relative border-b border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-4">
              <div className="absolute right-10 top-0 h-24 w-24 rounded-full bg-[#a3e635]/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold leading-tight">CodeKar AI</h2>
                    <p className="text-xs text-white/60">Cohorts, booking, chatbot help</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                    aria-label="Minimize CodeKar AI chat"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessages(starterMessages);
                      setOpen(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close CodeKar AI chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="max-h-[52vh] min-h-[320px] space-y-4 overflow-y-auto p-4 sm:max-h-[500px]">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/enroll" className="group rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:bg-white/[0.1]">
                  <CalendarDays className="mb-2 h-4 w-4 text-[#a3e635]" />
                  <span className="block text-xs font-bold">Open Enrollment</span>
                  <span className="mt-1 flex items-center text-[11px] text-white/50">
                    Pick a cohort <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
                <a href="#faq" className="group rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:bg-white/[0.1]">
                  <MessageCircle className="mb-2 h-4 w-4 text-[#a3e635]" />
                  <span className="block text-xs font-bold">Jump to FAQs</span>
                  <span className="mt-1 flex items-center text-[11px] text-white/50">
                    Fast answers <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </a>
              </div>

              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/[0.06] text-white/85"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {visibleCohorts.length > 0 && (
                <div className="space-y-2 rounded-3xl border border-white/10 bg-black/40 p-3">
                  <p className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">Active cohorts</p>
                  {visibleCohorts.map((cohort) => (
                    <Link
                      key={cohort.id}
                      href="/enroll"
                      className="block rounded-2xl bg-white/[0.06] p-3 transition hover:bg-white/[0.1]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">{cohort.name || "CodeKar Cohort"}</p>
                          <p className="mt-1 text-xs text-white/55">{cohort.dates || "Dates TBA"} · {cohort.time || "Time TBA"}</p>
                        </div>
                        <span className="rounded-full bg-[#a3e635] px-2.5 py-1 text-[11px] font-bold text-black">
                          {formatPrice(cohort)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/60">
                    CodeKar AI is thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => sendMessage(action)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.1] hover:text-white"
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
                className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2"
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
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a3e635] text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
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
