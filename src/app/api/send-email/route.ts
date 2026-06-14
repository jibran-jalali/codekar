import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { EnrollmentConfirmationEmail } from "@/components/emails/enrollment-confirmation";
import { WaitlistConfirmationEmail } from "@/components/emails/waitlist-confirmation";
import { PaymentConfirmationEmail } from "@/components/emails/payment-confirmation";
import * as React from "react";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, name, data } = body;

    let emailComponent;
    let subject = "";

    if (type === "enrollment") {
      emailComponent = React.createElement(EnrollmentConfirmationEmail, {
        name,
        cohortName: data.cohortName,
        cohortDates: data.cohortDates,
        cohortTime: data.cohortTime,
        joiningType: data.joiningType || "online",
        pricePaid: data.pricePaid,
        meetingLink: data.meetingLink,
        whatsappGroupLink: data.whatsappGroupLink,
      });
      subject = `Registration Received: ${data.cohortName}`;
    } else if (type === "waitlist") {
      emailComponent = React.createElement(WaitlistConfirmationEmail, {
        name,
        cohortName: data.cohortName,
      });
      subject = `Waitlist Confirmation: ${data.cohortName}`;
    } else if (type === "payment_confirmed") {
      emailComponent = React.createElement(PaymentConfirmationEmail, {
        name,
        cohortName: data.cohortName,
        cohortDates: data.cohortDates,
        cohortTime: data.cohortTime,
        joiningType: data.joiningType || "online",
        meetingLink: data.meetingLink,
        whatsappGroupLink: data.whatsappGroupLink,
      });
      subject = `Payment Confirmed: Spot Secured for ${data.cohortName}`;
    } else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

const result = await sendEmail({
to: email,
subject: subject,
react: emailComponent,
});

if (result.error) {
return NextResponse.json({ error: result.error }, { status: 400 });
}

return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
