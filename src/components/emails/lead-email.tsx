interface LeadEmailProps {
  subject: string;
  bodyContent: string;
}

export const LeadEmail = ({ subject, bodyContent }: LeadEmailProps) => {
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>CodeKar update</p>
          <h1 style={title}>{subject}</h1>
        </div>

        <div style={panel}>
          <div style={messageContent} dangerouslySetInnerHTML={{ __html: bodyContent }} />
        </div>

        <div style={ctaPanel}>
          <a href="https://wa.me/923390053713" style={primaryButton}>Message CodeKar</a>
          <a href="https://instagram.com/codekar_" style={secondaryButton}>Follow on Instagram</a>
        </div>

        <Footer />
      </div>
    </div>
  );
};

function Footer() {
  return (
    <div style={footer}>
      <p style={copyright}>© 2026 CodeKar. All rights reserved.</p>
    </div>
  );
}

const page = { margin: "0", padding: "32px 12px", backgroundColor: "#050505", fontFamily: "Arial, sans-serif" };
const card = { maxWidth: "620px", margin: "0 auto", backgroundColor: "#0b0b0f", color: "#ffffff", borderRadius: "28px", overflow: "hidden", border: "1px solid #24243a" };
const hero = { padding: "36px 32px", textAlign: "center" as const, background: "linear-gradient(135deg,#050505,#111827 45%,#312e81)" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#93c5fd", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "28px", lineHeight: "36px", fontWeight: "800" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111118", border: "1px solid #24243a", borderRadius: "20px" };
const messageContent = { color: "#c7cedd", fontSize: "15px", lineHeight: "24px" };
const ctaPanel = { margin: "18px 28px 0", padding: "24px", textAlign: "center" as const, background: "linear-gradient(135deg,rgba(34,211,238,.10),rgba(244,114,182,.10))", border: "1px solid rgba(147,197,253,.22)", borderRadius: "20px" };
const primaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const secondaryButton = { display: "inline-block", margin: "0 10px 10px 0", padding: "13px 18px", backgroundColor: "#d946ef", color: "#ffffff", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" };
const footer = { padding: "28px", textAlign: "center" as const };
const copyright = { margin: "0", color: "#555b6b", fontSize: "11px" };
