import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { CertificateEmail } from "@/components/emails/certificate-email";
import * as React from "react";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createCertificateSvg(data: {
  name: string;
  certificateId?: string;
  cohortName?: string;
  customDate?: string;
}) {
  const name = escapeXml(data.name);
  const certificateId = escapeXml(data.certificateId || "CODEKAR-CERT");
  const cohortName = escapeXml(data.cohortName || "CodeKar Workshop");
  const date = escapeXml(data.customDate || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
  <rect width="1000" height="700" fill="#ffffff"/>
  <rect x="42" y="42" width="916" height="616" fill="none" stroke="#111111" stroke-width="4"/>
  <rect x="64" y="64" width="872" height="572" fill="none" stroke="#a3e635" stroke-width="2"/>
  <text x="500" y="130" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#111111">CODEKAR</text>
  <text x="500" y="185" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="5" fill="#666666">CERTIFICATE OF COMPLETION</text>
  <text x="500" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="58" font-weight="700" fill="#111111">${name}</text>
  <text x="500" y="340" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#444444">has successfully completed</text>
  <text x="500" y="395" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#111111">${cohortName}</text>
  <text x="500" y="475" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#555555">Completion Date: ${date}</text>
  <text x="500" y="530" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" letter-spacing="2" fill="#777777">Certificate ID: ${certificateId}</text>
  <line x1="365" y1="585" x2="635" y2="585" stroke="#111111" stroke-width="2"/>
  <text x="500" y="615" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#444444">CodeKar Team</text>
</svg>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, enrollmentId, certificateImage, certificateId, cohortName, customDate } = body;

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

    const hasCertificateImage = typeof certificateImage === "string" && certificateImage.trim().length > 0;
    const buffer = hasCertificateImage
      ? Buffer.from(certificateImage.replace(/^data:image\/\w+;base64,/, ""), "base64")
      : Buffer.from(createCertificateSvg({ name, certificateId, cohortName, customDate }), "utf8");
    const filename = hasCertificateImage ? `Certificate-${name}.png` : `Certificate-${name}.svg`;

    const feedbackLink = `${baseUrl}/feedback?id=${enrollmentId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

const result = await sendEmail({
to: email,
subject: `Your Certificate of Completion - ${name}`,
react: React.createElement(CertificateEmail, { name, feedbackLink }),
attachments: [
{
filename,
content: buffer,
},
],
});

if (result.error) {
return NextResponse.json({ error: result.error }, { status: 400 });
}

return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Error sending certificate:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
