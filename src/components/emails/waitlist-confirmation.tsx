interface WaitlistEmailProps {
  name: string;
  cohortName: string;
}

export function WaitlistConfirmationEmail({ name, cohortName }: WaitlistEmailProps) {
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>Waitlist confirmed</p>
          <h1 style={title}>You are on the list, {name}.</h1>
          <p style={lead}>
            We saved your interest for <strong style={strong}>{cohortName}</strong>. If a seat opens or the next batch is announced, the CodeKar team will reach out.
          </p>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>What to Expect</h2>
          <p style={bodyText}>You do not need to submit payment right now.</p>
          <p style={bodyText}>Keep an eye on WhatsApp and email for updates about availability.</p>
          <p style={bodyText}>You can also message us directly if your schedule changes.</p>
        </div>

        <div style={ctaPanel}>
          <a href="https://wa.me/923390053713" style={primaryButton}>Message on WhatsApp</a>
          <a href="https://instagram.com/codekar_" style={secondaryButton}>Follow CodeKar</a>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={footer}>
      <p style={copyright}>© 2026 CodeKar. All rights reserved.</p>
    </div>
  );
}

const page = { margin: "0", padding: "32px 12px", backgroundColor: "#050505", fontFamily: "Arial, sans-serif" };
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #24243a" };
const hero = { padding: "36px 32px", textAlign: "center" as const, background: "linear-gradient(135deg,#050505,#111827 45%,#3b0764)" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#f0abfc", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const strong = { color: "#ffffff" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111118", border: "1px solid #24243a", borderRadius: "20px" };
const ctaPanel = { margin: "18px 28px 0", padding: "24px", textAlign: "center" as const, background: "linear-gradient(135deg,rgba(34,211,238,.10),rgba(244,114,182,.10))", border: "1px solid rgba(244,114,182,.22)", borderRadius: "20px" };
const sectionTitle = { margin: "0 0 16px", color: "#ffffff", fontSize: "18px", lineHeight: "24px" };
const bodyText = { margin: "0 0 10px", color: "#c7cedd", fontSize: "14px", lineHeight: "23px" };
const primaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const secondaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#d946ef", color: "#ffffff", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const footer = { padding: "28px", textAlign: "center" as const };
const copyright = { margin: "0", color: "#555b6b", fontSize: "11px" };
