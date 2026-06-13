import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { CertificateEmail } from "@/components/emails/certificate-email";
import * as React from "react";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, enrollmentId, certificateImage } = body;

    const host = req.headers.get("host") || "";
    
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    
    if (!baseUrl) {
      const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
      const protocol = isLocal ? "http" : "https";
      baseUrl = `${protocol}://${host}`;
    } else if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    baseUrl = baseUrl.replace(/\/$/, "");

    const base64Data = certificateImage.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const feedbackLink = `${baseUrl}/feedback?id=${enrollmentId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

const result = await sendEmail({
to: email,
subject: `Your Certificate of Completion - ${name}`,
react: React.createElement(CertificateEmail, { name, feedbackLink }),
attachments: [
{
filename: `Certificate-${name}.png`,
content: buffer,
},
],
});

if (result.error) {
return NextResponse.json({ error: result.error }, { status: 400 });
}

return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error sending certificate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
