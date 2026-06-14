interface MeetingInvitationEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  meetingLink: string;
}

export function MeetingInvitationEmail({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  meetingLink,
}: MeetingInvitationEmailProps) {
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>Online workshop access</p>
          <h1 style={title}>Your meeting link is ready.</h1>
          <p style={lead}>Hi {name}, use the link below to join <strong style={strong}>{cohortName}</strong>.</p>
        </div>

        <div style={panel}>
          <InfoRow label="Dates" value={cohortDates} />
          <InfoRow label="Time" value={cohortTime} />
          <InfoRow label="Workshop" value={cohortName} />
        </div>

        <div style={ctaPanel}>
          <a href={meetingLink} style={primaryButton}>Join Online Session</a>
          <p style={copyText}>Copy link: {meetingLink}</p>
        </div>

        <div style={notePanel}>
          <p style={bodyText}>Join 5 minutes early and keep your laptop charger nearby.</p>
          <p style={bodyText}>If the link does not open, copy it into your browser.</p>
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
      <a href="https://wa.me/923390053713" style={footerLink}>WhatsApp</a>
      <a href="https://instagram.com/codekar_" style={footerLink}>Instagram</a>
      <p style={copyright}>© 2026 CodeKar. All rights reserved.</p>
    </div>
  );
}

const page = { margin: "0", padding: "32px 12px", backgroundColor: "#050505", fontFamily: "Arial, sans-serif" };
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #24243a" };
const hero = { padding: "36px 32px", textAlign: "center" as const, background: "linear-gradient(135deg,#050505,#0f172a 45%,#164e63)" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#67e8f9", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const strong = { color: "#ffffff" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111118", border: "1px solid #24243a", borderRadius: "20px" };
const ctaPanel = { margin: "18px 28px 0", padding: "28px 24px", textAlign: "center" as const, background: "linear-gradient(135deg,rgba(34,211,238,.12),rgba(79,70,229,.12))", border: "1px solid rgba(34,211,238,.24)", borderRadius: "20px" };
const notePanel = { margin: "18px 28px 0", padding: "20px 24px", backgroundColor: "#0f1016", border: "1px solid #202233", borderRadius: "20px" };
const infoRow = { display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid #202233" };
const infoLabel = { color: "#8b95a7", fontSize: "13px", fontWeight: "bold" };
const infoValue = { color: "#ffffff", fontSize: "14px", textAlign: "right" as const };
const primaryButton = { display: "inline-block", padding: "14px 22px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "15px" };
const copyText = { margin: "16px 0 0", color: "#8b95a7", fontSize: "12px", lineHeight: "18px", wordBreak: "break-all" as const };
const bodyText = { margin: "0 0 10px", color: "#c7cedd", fontSize: "14px", lineHeight: "23px" };
const footer = { padding: "28px", textAlign: "center" as const };
const footerLink = { margin: "0 8px", color: "#e5e7eb", fontSize: "13px", textDecoration: "none", fontWeight: "bold" };
const copyright = { margin: "18px 0 0", color: "#555b6b", fontSize: "11px" };
