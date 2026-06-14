import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

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

const FALLBACK_REPLY =
  "I can help with CodeKar workshop details, cohorts, booking steps, pricing, refund guarantee, and what you will build. Ask me what you want to know, or tap one of the quick actions.";

async function getActiveCohorts() {
  try {
    const { data, error } = await supabase
      .from("cohorts")
      .select("id,name,dates,time,original_price,sale_price,total_spots,delivery_type,description")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data || []) as Cohort[];
  } catch {
    return [];
  }
}

function formatCohortContext(cohorts: Cohort[]) {
  if (cohorts.length === 0) {
    return "No active cohorts are currently available in the database. Tell users to open /enroll or contact WhatsApp for the next batch.";
  }

  return cohorts
    .map((cohort, index) => {
      const price = cohort.sale_price ?? cohort.original_price;
      const priceLabel = price === null ? "Price TBA" : Number(price) === 0 ? "Free" : `PKR ${Number(price).toLocaleString()}`;
      return `${index + 1}. ${cohort.name || "CodeKar Cohort"} | ${cohort.dates || "dates TBA"} | ${cohort.time || "time TBA"} | ${cohort.delivery_type || "online"} | ${priceLabel} | ${cohort.total_spots || "limited"} seats`;
    })
    .join("\n");
}

function fallbackForMessage(message: string, cohorts: Cohort[]) {
  const lower = message.toLowerCase();
  if (lower.includes("cohort") || lower.includes("batch") || lower.includes("date")) {
    if (cohorts.length === 0) {
      return "I do not see an active cohort listed right now. You can still open the enrollment page or WhatsApp CodeKar to ask for the next batch.";
    }

    return `Here are the active cohorts I found:\n\n${formatCohortContext(cohorts)}\n\nTap "Open Enrollment" and choose the batch that fits your schedule.`;
  }

  if (lower.includes("book") || lower.includes("register") || lower.includes("enroll")) {
    return "To book your seat: 1) open the enrollment page, 2) pick an active online cohort, 3) enter your details, 4) confirm your spot. If a cohort is full, join the waitlist and the team will follow up.";
  }

  if (lower.includes("refund") || lower.includes("guarantee")) {
    return "The risk reducer is simple: full refund if you do not walk away with a working, deployed chatbot.";
  }

  if (lower.includes("build") || lower.includes("chatbot")) {
    return "You will build a real AI-powered customer support chatbot for a business, the kind local shops, salons, clinics, and online sellers can use for customer questions.";
  }

  return FALLBACK_REPLY;
}

export async function GET() {
  const cohorts = await getActiveCohorts();
  return NextResponse.json({ cohorts });
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages?: ChatMessage[] };
    const safeMessages = (messages || [])
      .filter((message) => message.role === "user" || message.role === "assistant")
      .slice(-8);
    const lastUserMessage = [...safeMessages].reverse().find((message) => message.role === "user")?.content || "";
    const cohorts = await getActiveCohorts();

    if (!lastUserMessage.trim()) {
      return NextResponse.json({ reply: FALLBACK_REPLY, cohorts });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: fallbackForMessage(lastUserMessage, cohorts),
        cohorts,
        source: "fallback",
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.35,
        max_tokens: 450,
        messages: [
          {
            role: "system",
            content: `You are CodeKar AI, the customer support assistant for CodeKar.

Tone: direct, helpful, anti-hype, concise, Pakistan-friendly.
Audience: non-technical 19-26 year olds in Pakistan interested in freelancing and online income.

CodeKar offer:
- A 2-day live online workshop.
- Students build a real AI customer support chatbot.
- No coding required for beginners.
- Goal: leave with a working deployed chatbot and a path to first freelance client.
- Full refund if they do not walk away with a working, deployed chatbot.
- CTA route: /enroll.
- Useful sections: #whatYouNeed, #reviews, #faq.
- Contact: Instagram @codekar_, WhatsApp +92 339 0053713.

Active cohort context:
${formatCohortContext(cohorts)}

Rules:
- Do not claim it is in-person or Karachi venue based.
- If asked to book, guide them to /enroll and explain the steps.
- If asked about cohorts, summarize the active cohorts above.
- If unsure about exact internal tools, say the team will confirm the exact stack during onboarding. Do not invent tool names.
- Keep answers under 120 words unless the user asks for detail.`,
          },
          ...safeMessages,
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        reply: fallbackForMessage(lastUserMessage, cohorts),
        cohorts,
        source: "fallback",
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || fallbackForMessage(lastUserMessage, cohorts);

    return NextResponse.json({ reply, cohorts, source: "groq" });
  } catch {
    return NextResponse.json(
      { reply: "I had trouble responding. Please try again or open the enrollment page.", cohorts: [] },
      { status: 200 }
    );
  }
}
