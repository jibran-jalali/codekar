interface AdminNotificationEmailProps {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  cohortName: string;
  pricePaid: number;
  joiningType: string;
}

export const AdminNotificationEmail = ({
  studentName,
  studentEmail,
  studentPhone,
  cohortName,
  pricePaid,
  joiningType,
}: AdminNotificationEmailProps) => {
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";
  const isFreeRegistration = pricePaid <= 0;

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={{ ...eyebrow, color: isFreeRegistration ? "#86efac" : "#fbbf24" }}>New registration</p>
          <h1 style={title}>{isFreeRegistration ? "Free workshop confirmed" : "Payment needs verification"}</h1>
          <p style={lead}>
            {isFreeRegistration
              ? "A student registered for a free cohort and was moved directly to confirmed enrollments."
              : "A student submitted registration and payment confirmation. Please verify the payment in the dashboard."}
          </p>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>Student Details</h2>
          <InfoRow label="Name" value={studentName} />
          <InfoRow label="Email" value={studentEmail} />
          <InfoRow label="Phone" value={studentPhone} />
          <InfoRow label="Workshop" value={cohortName} />
          <InfoRow label="Format" value={joiningType === "inperson" ? "In-person" : "Online"} />
          <InfoRow label="Amount" value={isFreeRegistration ? "Free" : `PKR ${pricePaid.toLocaleString()}`} />
        </div>

        <div style={ctaPanel}>
          <a href="https://codekar.co/admin/dashboard" style={primaryButton}>
            {isFreeRegistration ? "Open Dashboard" : "Verify in Dashboard"}
          </a>
          <p style={copyText}>
            {isFreeRegistration
              ? "View this student in the paid/confirmed enrollments list."
              : "Open the pending enrollments tab and mark the student paid after verification."}
          </p>
        </div>

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
      <p style={copyright}>Automated CodeKar admin notification.</p>
    </div>
  );
}

const page = { margin: "0", padding: "32px 12px", backgroundColor: "#050505", fontFamily: "Arial, sans-serif" };
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #24243a" };
const hero = { padding: "36px 32px", textAlign: "center" as const, background: "linear-gradient(135deg,#050505,#111827 45%,#3b0764)" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111118", border: "1px solid #24243a", borderRadius: "20px" };
const ctaPanel = { margin: "18px 28px 0", padding: "28px 24px", textAlign: "center" as const, background: "linear-gradient(135deg,rgba(245,158,11,.12),rgba(244,114,182,.08))", border: "1px solid rgba(245,158,11,.22)", borderRadius: "20px" };
const sectionTitle = { margin: "0 0 16px", color: "#ffffff", fontSize: "18px", lineHeight: "24px" };
const infoRow = { display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid #202233" };
const infoLabel = { color: "#8b95a7", fontSize: "13px", fontWeight: "bold" };
const infoValue = { color: "#ffffff", fontSize: "14px", textAlign: "right" as const };
const primaryButton = { display: "inline-block", padding: "14px 22px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "15px" };
const copyText = { margin: "16px 0 0", color: "#8b95a7", fontSize: "12px", lineHeight: "18px" };
const footer = { padding: "28px", textAlign: "center" as const };
const copyright = { margin: "0", color: "#555b6b", fontSize: "11px" };
