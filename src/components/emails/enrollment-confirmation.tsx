import type { ReactNode } from "react";

interface EnrollmentEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  joiningType: string;
  pricePaid: number;
  meetingLink?: string;
  whatsappGroupLink?: string;
}

export const EnrollmentConfirmationEmail = ({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  joiningType,
  pricePaid,
  meetingLink,
  whatsappGroupLink,
}: EnrollmentEmailProps) => {
  const isFreeRegistration = pricePaid <= 0;
  const hasLinks = Boolean(meetingLink || whatsappGroupLink);

  return (
    <div style={page}>
      <div style={card}>
        <div style={topBar} />

        <div style={header}>
          <p style={eyebrow}>{isFreeRegistration ? "Registration confirmed" : "Enrollment received"}</p>
          <h1 style={title}>
            Hi {name}, your seat is {isFreeRegistration ? "confirmed" : "almost confirmed"}.
          </h1>
          <p style={lead}>
            {isFreeRegistration
              ? "You are registered for the free workshop. Everything important is below."
              : "We received your registration. Complete payment to lock in your seat."}
          </p>
        </div>

        <Section title="Workshop details">
          <Row label="Workshop" value={cohortName} />
          <Row label="Dates" value={cohortDates} />
          <Row label="Time" value={cohortTime} />
          <Row label="Format" value={joiningType === "inperson" ? "In-person" : "Online"} />
          <Row label="Amount" value={isFreeRegistration ? "Free" : `PKR ${pricePaid.toLocaleString()}`} />
        </Section>

        {hasLinks && (
          <Section title="Joining links">
            <p style={bodyText}>
              Save these links now so you can join on time.
            </p>
            <div style={buttonRow}>
              {meetingLink && <a href={meetingLink} style={primaryButton}>Open meeting</a>}
              {whatsappGroupLink && <a href={whatsappGroupLink} style={secondaryButton}>Join WhatsApp</a>}
            </div>
          </Section>
        )}

        {isFreeRegistration ? (
          <Section title="Next step">
            <p style={bodyText}>
              {hasLinks
                ? "Use the links above to join the session and stay connected with the cohort."
                : "The CodeKar team will share the final joining links before the workshop starts."}
            </p>
          </Section>
        ) : (
          <Section title="Payment instructions">
            <DetailLine label="Bank" value="Meezan Bank - Sharah-e-Faisal" />
            <DetailLine label="Account title" value="Jibran Jalali" />
            <DetailLine label="Account no." value="01110110259540" />
            <DetailLine label="IBAN" value="PK75MEZN0001110110259540" />
            <div style={stepsBox}>
              <p style={stepText}>1. Transfer the amount shown above.</p>
              <p style={stepText}>2. Take a screenshot of your receipt.</p>
              <p style={stepText}>3. Send it on WhatsApp: +92 339 0053713.</p>
            </div>
          </Section>
        )}

        <Footer />
      </div>
    </div>
  );
};

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

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={detailLine}>
      <span style={detailLabel}>{label}</span>
      <span style={detailValue}>{value || "TBA"}</span>
    </div>
  );
}

function Footer() {
  return (
    <div style={footer}>
      <p style={footerText}>Need help? Reach out anytime.</p>
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

const stepsBox = {
  marginTop: "14px",
  padding: "14px",
  backgroundColor: "#0b0c11",
  borderRadius: "14px",
  border: "1px solid #232638",
};

const stepText = {
  margin: "0 0 8px",
  color: "#d1d5db",
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
