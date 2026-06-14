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
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";
  const isFreeRegistration = pricePaid <= 0;
  const hasLinks = Boolean(meetingLink || whatsappGroupLink);

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>{isFreeRegistration ? "Registration confirmed" : "Enrollment received"}</p>
          <h1 style={title}>Hi {name}, your seat is {isFreeRegistration ? "confirmed" : "almost confirmed"}.</h1>
          <p style={lead}>
            {isFreeRegistration
              ? "You are registered for the free workshop. Save the details below."
              : "We received your registration. Complete payment to lock in your seat."}
          </p>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>Workshop Details</h2>
          <InfoRow label="Workshop" value={cohortName} />
          <InfoRow label="Dates" value={cohortDates} />
          <InfoRow label="Time" value={cohortTime} />
          <InfoRow label="Format" value={joiningType === "inperson" ? "In-person" : "Online"} />
          <InfoRow label="Amount" value={isFreeRegistration ? "Free" : `PKR ${pricePaid.toLocaleString()}`} />
        </div>

        {isFreeRegistration && (
          <div style={successPanel}>
            <h2 style={sectionTitle}>Next Step</h2>
            <p style={bodyText}>
              {hasLinks
                ? "Use the links below to join the session and stay connected with the cohort."
                : "The CodeKar team will share final joining links before the workshop starts."}
            </p>
            {hasLinks && (
              <div style={buttonRow}>
                {meetingLink && <a href={meetingLink} style={primaryButton}>Open Meeting Link</a>}
                {whatsappGroupLink && <a href={whatsappGroupLink} style={whatsappButton}>Join WhatsApp Group</a>}
              </div>
            )}
          </div>
        )}

        {!isFreeRegistration && (
          <div style={paymentPanel}>
            <h2 style={sectionTitle}>Payment Instructions</h2>
            <InfoRow label="Bank" value="Meezan Bank - Sharah-e-Faisal" />
            <InfoRow label="Account Title" value="Jibran Jalali" />
            <InfoRow label="Account No." value="01110110259540" />
            <InfoRow label="IBAN" value="PK75MEZN0001110110259540" />
            <div style={stepsBox}>
              <p style={bodyText}>1. Transfer the amount shown above.</p>
              <p style={bodyText}>2. Take a screenshot of your payment receipt.</p>
              <p style={bodyText}>3. Send it on WhatsApp: +92 339 0053713.</p>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <span style={infoValue}>{value || "TBA"}</span>
    </div>
  );
}

function Footer() {
  return (
    <div style={footer}>
      <p style={footerText}>Need help? Reach out anytime.</p>
      <a href="https://wa.me/923390053713" style={footerLink}>WhatsApp</a>
      <a href="https://instagram.com/codekar_" style={footerLink}>Instagram</a>
      <p style={copyright}>© 2026 CodeKar. All rights reserved.</p>
    </div>
  );
}

const page = { margin: "0", padding: "32px 12px", backgroundColor: "#050505", fontFamily: "Arial, sans-serif" };
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #24243a" };
const hero = { padding: "36px 32px", textAlign: "center" as const, background: "linear-gradient(135deg,#050505,#111827 45%,#312e81)" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#93c5fd", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111118", border: "1px solid #24243a", borderRadius: "20px" };
const successPanel = { margin: "18px 28px 0", padding: "24px", background: "linear-gradient(135deg,rgba(34,197,94,.12),rgba(34,211,238,.08))", border: "1px solid rgba(34,197,94,.24)", borderRadius: "20px" };
const paymentPanel = { margin: "18px 28px 0", padding: "24px", background: "linear-gradient(135deg,rgba(245,158,11,.10),rgba(255,255,255,.04))", border: "1px solid rgba(245,158,11,.20)", borderRadius: "20px" };
const sectionTitle = { margin: "0 0 16px", color: "#ffffff", fontSize: "18px", lineHeight: "24px" };
const infoRow = { display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid #202233" };
const infoLabel = { color: "#8b95a7", fontSize: "13px", fontWeight: "bold" };
const infoValue = { color: "#ffffff", fontSize: "14px", textAlign: "right" as const };
const bodyText = { margin: "0 0 10px", color: "#c7cedd", fontSize: "14px", lineHeight: "23px" };
const stepsBox = { marginTop: "18px", padding: "16px", backgroundColor: "rgba(0,0,0,.22)", borderRadius: "14px", border: "1px solid rgba(255,255,255,.08)" };
const buttonRow = { marginTop: "14px" };
const primaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const whatsappButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#22c55e", color: "#031208", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const footer = { padding: "28px", textAlign: "center" as const };
const footerText = { margin: "0 0 12px", color: "#8b95a7", fontSize: "13px" };
const footerLink = { margin: "0 8px", color: "#e5e7eb", fontSize: "13px", textDecoration: "none", fontWeight: "bold" };
const copyright = { margin: "18px 0 0", color: "#555b6b", fontSize: "11px" };
