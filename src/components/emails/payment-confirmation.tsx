import type { ReactNode } from "react";

interface PaymentConfirmationEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  joiningType: string;
  meetingLink?: string;
  whatsappGroupLink?: string;
}

export function PaymentConfirmationEmail({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  joiningType,
  meetingLink,
  whatsappGroupLink,
}: PaymentConfirmationEmailProps) {
  const hasLinks = Boolean(meetingLink || whatsappGroupLink);

  return (
    <div style={page}>
      <div style={card}>
        <div style={topBar} />

        <div style={header}>
          <p style={eyebrow}>Payment confirmed</p>
          <h1 style={title}>You are officially in, {name}.</h1>
          <p style={lead}>
            Your payment has been verified and your seat for the workshop is confirmed.
          </p>
        </div>

        <Section title="Workshop details">
          <Row label="Workshop" value={cohortName} />
          <Row label="Dates" value={cohortDates} />
          <Row label="Time" value={cohortTime} />
          <Row label="Format" value={joiningType === "inperson" ? "In-person" : "Online"} />
        </Section>

        {hasLinks && (
          <Section title="Joining links">
            <p style={bodyText}>
              Keep these handy before the workshop starts.
            </p>
            <div style={buttonRow}>
              {meetingLink && (
                <a href={meetingLink} style={primaryButton}>
                  Open meeting
                </a>
              )}
              {whatsappGroupLink && (
                <a href={whatsappGroupLink} style={secondaryButton}>
                  Join WhatsApp
                </a>
              )}
            </div>
          </Section>
        )}

        <Section title="What happens next">
          <p style={bodyText}>Join 5 minutes early and keep your laptop charged.</p>
          <p style={bodyText}>
            If a link is missing above, the CodeKar team will share the final access details before the workshop.
          </p>
        </Section>

        <Footer />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={section}>
      <h2 style={sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={row}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value || "TBA"}</span>
    </div>
  );
}

function Footer() {
  return (
    <div style={footer}>
      <p style={footerText}>Questions? Message CodeKar anytime.</p>
      <div style={footerLinks}>
        <a href="https://wa.me/923390053713" style={footerLink}>WhatsApp</a>
        <a href="https://instagram.com/codekar_" style={footerLink}>Instagram</a>
      </div>
      <p style={copyright}>© 2026 CodeKar. All rights reserved.</p>
    </div>
  );
}

const page = {
  margin: "0",
  padding: "28px 12px",
  backgroundColor: "#f4f5f7",
  fontFamily: "Arial, sans-serif",
};

const card = {
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: "#0b0b0f",
  color: "#ffffff",
  borderRadius: "24px",
  overflow: "hidden",
  border: "1px solid #1f2937",
  boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
};

const topBar = {
  height: "5px",
  backgroundColor: "#ffffff",
};

const header = {
  padding: "34px 30px 12px",
  textAlign: "center" as const,
};

const eyebrow = {
  margin: "0 0 10px",
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
};

const title = {
  margin: "0",
  color: "#ffffff",
  fontSize: "28px",
  lineHeight: "36px",
  fontWeight: 800,
};

const lead = {
  margin: "14px auto 0",
  maxWidth: "500px",
  color: "#d1d5db",
  fontSize: "16px",
  lineHeight: "24px",
};

const section = {
  margin: "14px 20px 0",
  padding: "20px",
  backgroundColor: "#111118",
  border: "1px solid #222433",
  borderRadius: "18px",
};

const sectionTitle = {
  margin: "0 0 14px",
  color: "#ffffff",
  fontSize: "17px",
  lineHeight: "24px",
  fontWeight: 800,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  padding: "12px 0",
  borderBottom: "1px solid #202233",
};

const labelStyle = {
  color: "#93a0b6",
  fontSize: "13px",
  fontWeight: 700,
};

const valueStyle = {
  color: "#ffffff",
  fontSize: "14px",
  textAlign: "right" as const,
  lineHeight: "20px",
};

const bodyText = {
  margin: "0",
  color: "#c7cedd",
  fontSize: "14px",
  lineHeight: "22px",
};

const buttonRow = {
  marginTop: "4px",
};

const primaryButton = {
  display: "inline-block",
  margin: "8px 10px 0 0",
  padding: "12px 18px",
  backgroundColor: "#ffffff",
  color: "#000000",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};

const secondaryButton = {
  display: "inline-block",
  margin: "8px 10px 0 0",
  padding: "12px 18px",
  backgroundColor: "#22c55e",
  color: "#031208",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};

const footer = {
  padding: "22px 20px 28px",
  textAlign: "center" as const,
};

const footerText = {
  margin: "0 0 12px",
  color: "#93a0b6",
  fontSize: "13px",
};

const footerLinks = {
  marginBottom: "10px",
};

const footerLink = {
  margin: "0 8px",
  color: "#ffffff",
  fontSize: "13px",
  textDecoration: "none",
  fontWeight: 700,
};

const copyright = {
  margin: "0",
  color: "#5b6478",
  fontSize: "11px",
};
