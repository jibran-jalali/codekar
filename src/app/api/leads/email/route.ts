import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import React from "react";
import { render } from "@react-email/render";
import { LeadEmail } from "@/components/emails/lead-email";
import { supabaseAdmin as supabase } from "@/lib/supabase";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, body: emailBody, recipient_emails } = body;

    if (!subject || !emailBody || !recipient_emails || recipient_emails.length === 0) {
      return NextResponse.json(
        { error: "Subject, body, and at least one recipient are required" },
        { status: 400 }
      );
    }

    const html = await render(React.createElement(LeadEmail, { subject, bodyContent: emailBody }));

    const results = [];
    for (const email of recipient_emails) {
      try {
        const info = await transporter.sendMail({
          from: `"CodeKar" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: subject,
          html: html,
        });
        results.push({ email, success: true, id: info.messageId });
      } catch (err: any) {
        console.error("Email send error for", email, ":", err.message);
        results.push({ email, success: false, error: err.message });
      }
    }

    try {
      const { error: logError } = await supabase.from("lead_email_logs").insert([
        {
          subject,
          body: emailBody,
          recipient_emails,
          sent_by: "Admin",
        },
      ]);

      if (logError) {
        console.error("Failed to log email:", logError);
      }
    } catch (logErr: any) {
      console.error("Log insert error:", logErr.message);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Lead email API error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("lead_email_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
