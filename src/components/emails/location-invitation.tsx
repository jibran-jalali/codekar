interface LocationInvitationEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  locationName: string;
  locationLink: string;
}

export function LocationInvitationEmail({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  locationName,
  locationLink,
}: LocationInvitationEmailProps) {
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>Workshop location</p>
          <h1 style={title}>Your location details are ready.</h1>
          <p style={lead}>Hi {name}, here is where to join <strong style={strong}>{cohortName}</strong>.</p>
        </div>

        <div style={panel}>
          <InfoRow label="Dates" value={cohortDates} />
          <InfoRow label="Time" value={cohortTime} />
          <InfoRow label="Location" value={locationName} />
        </div>

        <div style={ctaPanel}>
          <a href={locationLink} style={primaryButton}>Open Location Map</a>
          <p style={copyText}>Copy map link: {locationLink}</p>
        </div>

        <div style={notePanel}>
          <p style={bodyText}>Plan to arrive a little early so check-in is smooth.</p>
          <p style={bodyText}>If you cannot find the venue, message us on WhatsApp and we will guide you.</p>
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
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #1f2937" };
const hero = { padding: "36px 32px", textAlign: "center" as const, backgroundColor: "#050505" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#bef264", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const strong = { color: "#ffffff" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111111", border: "1px solid #1f2937", borderRadius: "20px" };
const ctaPanel = { margin: "18px 28px 0", padding: "28px 24px", textAlign: "center" as const, backgroundColor: "#111111", border: "1px solid #1f2937", borderRadius: "20px" };
const notePanel = { margin: "18px 28px 0", padding: "20px 24px", backgroundColor: "#111111", border: "1px solid #1f2937", borderRadius: "20px" };
const infoRow = { display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid #202233" };
const infoLabel = { color: "#8b95a7", fontSize: "13px", fontWeight: "bold" };
const infoValue = { color: "#ffffff", fontSize: "14px", textAlign: "right" as const };
const primaryButton = { display: "inline-block", padding: "14px 22px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "15px" };
const copyText = { margin: "16px 0 0", color: "#8b95a7", fontSize: "12px", lineHeight: "18px", wordBreak: "break-all" as const };
const bodyText = { margin: "0 0 10px", color: "#c7cedd", fontSize: "14px", lineHeight: "23px" };
const footer = { padding: "28px", textAlign: "center" as const };
const footerLink = { margin: "0 8px", color: "#e5e7eb", fontSize: "13px", textDecoration: "none", fontWeight: "bold" };
const copyright = { margin: "18px 0 0", color: "#555b6b", fontSize: "11px" };
