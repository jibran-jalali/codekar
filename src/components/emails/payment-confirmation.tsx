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
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";
  const hasLinks = Boolean(meetingLink || whatsappGroupLink);

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>Payment confirmed</p>
          <h1 style={title}>You are officially in, {name}.</h1>
          <p style={lead}>
            Your payment has been verified and your seat for the workshop is confirmed.
          </p>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>Workshop Details</h2>
          <InfoRow label="Workshop" value={cohortName} />
          <InfoRow label="Dates" value={cohortDates} />
          <InfoRow label="Time" value={cohortTime} />
          <InfoRow label="Format" value={joiningType === "inperson" ? "In-person" : "Online"} />
        </div>

        {hasLinks && (
          <div style={accentPanel}>
            <h2 style={sectionTitle}>Joining Links</h2>
            <p style={mutedText}>Save these links before the workshop starts.</p>
            <div style={buttonRow}>
              {meetingLink && (
                <a href={meetingLink} style={primaryButton}>
                  Open Meeting Link
                </a>
              )}
              {whatsappGroupLink && (
                <a href={whatsappGroupLink} style={secondaryButton}>
                  Join WhatsApp Group
                </a>
              )}
            </div>
          </div>
        )}

        <div style={nextPanel}>
          <h2 style={sectionTitle}>What Happens Next</h2>
          <p style={bodyText}>Join 5 minutes early, keep your laptop charged, and use a stable internet connection.</p>
          <p style={bodyText}>
            If links are not shown above, the CodeKar team will share final access details before the workshop.
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}

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
      <p style={footerText}>Questions? Message CodeKar anytime.</p>
      <a href="https://wa.me/923390053713" style={footerLink}>WhatsApp</a>
      <a href="https://instagram.com/codekar_" style={footerLink}>Instagram</a>
      <p style={copyright}>© 2026 CodeKar. All rights reserved.</p>
    </div>
  );
}

const page = { margin: "0", padding: "32px 12px", backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #1f2937" };
const hero = { padding: "36px 32px", textAlign: "center" as const, backgroundColor: "#050505" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#93c5fd", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111111", border: "1px solid #1f2937", borderRadius: "20px" };
const accentPanel = { margin: "18px 28px 0", padding: "24px", backgroundColor: "#111111", border: "1px solid #1f2937", borderRadius: "20px" };
const nextPanel = { margin: "18px 28px 0", padding: "24px", backgroundColor: "#111111", border: "1px solid #1f2937", borderRadius: "20px" };
const sectionTitle = { margin: "0 0 16px", color: "#ffffff", fontSize: "18px", lineHeight: "24px" };
const infoRow = { display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid #202233" };
const infoLabel = { color: "#8b95a7", fontSize: "13px", fontWeight: "bold" };
const infoValue = { color: "#ffffff", fontSize: "14px", textAlign: "right" as const };
const mutedText = { margin: "0 0 18px", color: "#aab2c5", fontSize: "14px", lineHeight: "22px" };
const bodyText = { margin: "0 0 10px", color: "#c7cedd", fontSize: "14px", lineHeight: "23px" };
const buttonRow = { marginTop: "14px" };
const primaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const secondaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#22c55e", color: "#031208", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const footer = { padding: "28px", textAlign: "center" as const };
const footerText = { margin: "0 0 12px", color: "#8b95a7", fontSize: "13px" };
const footerLink = { margin: "0 8px", color: "#e5e7eb", fontSize: "13px", textDecoration: "none", fontWeight: "bold" };
const copyright = { margin: "18px 0 0", color: "#555b6b", fontSize: "11px" };
