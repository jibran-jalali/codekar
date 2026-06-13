import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import React from "react";
import { render } from "@react-email/render";
import { PasswordResetEmail } from "@/components/emails/password-reset";

const ADMIN_EMAIL = "k245620@nu.edu.pk";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  try {
    const { data: admin, error: adminError } = await supabase
      .from("admin_credentials")
      .select("id, email")
      .eq("email", ADMIN_EMAIL)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: "Password reset is not available" },
        { status: 400 }
      );
    }

    await supabase
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("admin_id", admin.id)
      .eq("used", false);

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: tokenError } = await supabase
      .from("password_reset_tokens")
      .insert({
        admin_id: admin.id,
        token: code,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Token insert error:", tokenError);
      return NextResponse.json(
        { error: "Failed to generate reset code" },
        { status: 500 }
      );
    }

    const html = await render(React.createElement(PasswordResetEmail, { code }));

    await transporter.sendMail({
      from: `"CodeKar" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "Password Reset Code - CodeKar Admin",
      html: html,
    });

    return NextResponse.json({
      success: true,
      message: "Reset code sent to admin email",
    });
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
