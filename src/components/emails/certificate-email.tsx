interface CertificateEmailProps {
  name: string;
  feedbackLink: string;
}

export const CertificateEmail = ({ name, feedbackLink }: CertificateEmailProps) => {
  const logoUrl =
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

  return (
    <div style={page}>
      <div style={card}>
        <div style={hero}>
          <img src={logoUrl} alt="CodeKar" style={logo} />
          <p style={eyebrow}>Certificate issued</p>
          <h1 style={title}>Congratulations, {name}.</h1>
          <p style={lead}>
            You completed the CodeKar workshop. Your certificate is attached to this email.
          </p>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>What This Means</h2>
          <p style={bodyText}>You showed up, built, practiced, and completed the workshop requirements.</p>
          <p style={bodyText}>Keep this certificate with your project links and portfolio materials.</p>
        </div>

        <div style={ctaPanel}>
          <h2 style={sectionTitle}>Help Us Improve</h2>
          <p style={bodyText}>Your feedback helps us make the next cohort sharper and more practical.</p>
          <a href={feedbackLink} style={primaryButton}>Share Feedback</a>
        </div>

        <Footer />
      </div>
    </div>
  );
};

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
const hero = { padding: "36px 32px", textAlign: "center" as const, background: "linear-gradient(135deg,#050505,#111827 45%,#365314)" };
const logo = { width: "96px", height: "96px", objectFit: "contain" as const, borderRadius: "999px", backgroundColor: "#ffffff", marginBottom: "18px" };
const eyebrow = { margin: "0 0 12px", color: "#bef264", fontSize: "12px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" as const };
const title = { margin: "0", color: "#ffffff", fontSize: "30px", lineHeight: "38px", fontWeight: "800" };
const lead = { margin: "16px auto 0", maxWidth: "470px", color: "#d1d5db", fontSize: "16px", lineHeight: "25px" };
const panel = { margin: "28px 28px 0", padding: "24px", backgroundColor: "#111118", border: "1px solid #24243a", borderRadius: "20px" };
const ctaPanel = { margin: "18px 28px 0", padding: "28px 24px", textAlign: "center" as const, background: "linear-gradient(135deg,rgba(190,242,100,.12),rgba(34,211,238,.08))", border: "1px solid rgba(190,242,100,.22)", borderRadius: "20px" };
const sectionTitle = { margin: "0 0 16px", color: "#ffffff", fontSize: "18px", lineHeight: "24px" };
const bodyText = { margin: "0 0 10px", color: "#c7cedd", fontSize: "14px", lineHeight: "23px" };
const primaryButton = { display: "inline-block", marginTop: "10px", padding: "14px 22px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "15px" };
const footer = { padding: "28px", textAlign: "center" as const };
const footerLink = { margin: "0 8px", color: "#e5e7eb", fontSize: "13px", textDecoration: "none", fontWeight: "bold" };
const copyright = { margin: "18px 0 0", color: "#555b6b", fontSize: "11px" };
