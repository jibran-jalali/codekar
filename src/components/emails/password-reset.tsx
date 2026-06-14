import { Body, Head, Html, Preview } from "@react-email/components";

interface PasswordResetEmailProps {
  code: string;
}

const logoUrl =
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain";

export const PasswordResetEmail = ({ code }: PasswordResetEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          body { margin: 0; padding: 0; background: #03040a; }
          @media only screen and (max-width: 620px) {
            .shell { padding: 18px 12px !important; }
            .card { width: 100% !important; border-radius: 22px !important; }
            .inner { padding: 26px 18px !important; }
            .code { font-size: 30px !important; letter-spacing: 8px !important; }
          }
        `}
      </style>
    </Head>
    <Preview>Your CodeKar admin password reset code</Preview>
    <Body style={body}>
      <div className="shell" style={shell}>
        <div className="card" style={card}>
          <div className="inner" style={inner}>
            <div style={logoWrap}>
              <img src={logoUrl} width="92" height="92" alt="CodeKar" style={logo} />
            </div>

            <p style={eyebrow}>Admin security</p>
            <h1 style={title}>Password reset code</h1>
            <p style={copy}>
              Use this one-time code to reset your CodeKar admin password. It expires
              in 10 minutes.
            </p>

            <div style={codeBox}>
              <p className="code" style={codeText}>
                {code}
              </p>
            </div>

            <div style={notice}>
              If you did not request this reset, you can ignore this email. Your
              password will stay unchanged.
            </div>
          </div>

          <div style={footer}>
            <p style={footerText}>CodeKar | Build and deploy real AI products</p>
            <p style={footerLinks}>
              <a href="https://wa.me/923390053713" style={footerLink}>
                WhatsApp
              </a>
              <span style={separator}> | </span>
              <a href="https://instagram.com/codekar_" style={footerLink}>
                Instagram
              </a>
            </p>
          </div>
        </div>
      </div>
    </Body>
  </Html>
);

const body = {
  margin: 0,
  backgroundColor: "#03040a",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const shell = {
  padding: "34px 16px",
  background:
    "radial-gradient(circle at 18% 0%, rgba(127, 90, 240, 0.34), transparent 34%), radial-gradient(circle at 85% 16%, rgba(28, 214, 255, 0.22), transparent 32%), #03040a",
};

const card = {
  width: "100%",
  maxWidth: "620px",
  margin: "0 auto",
  overflow: "hidden",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.13)",
  backgroundColor: "#080a14",
  boxShadow: "0 26px 70px rgba(0,0,0,0.46)",
};

const inner = {
  padding: "38px 34px 28px",
  textAlign: "center" as const,
};

const logoWrap = {
  margin: "0 auto 22px",
  width: "112px",
  height: "112px",
  borderRadius: "999px",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(255,255,255,0.85)",
};

const logo = {
  display: "block",
  width: "92px",
  height: "92px",
  objectFit: "contain" as const,
  margin: "10px auto",
};

const eyebrow = {
  margin: "0 0 10px",
  color: "#a7f3ff",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const title = {
  margin: "0 0 14px",
  color: "#ffffff",
  fontSize: "30px",
  lineHeight: "38px",
  fontWeight: 900,
};

const copy = {
  maxWidth: "470px",
  margin: "0 auto 24px",
  color: "#cdd5e8",
  fontSize: "16px",
  lineHeight: "25px",
};

const codeBox = {
  maxWidth: "320px",
  margin: "0 auto 22px",
  padding: "22px 16px",
  borderRadius: "20px",
  border: "1px solid rgba(167, 243, 255, 0.35)",
  background:
    "linear-gradient(135deg, rgba(127,90,240,0.22), rgba(28,214,255,0.12)), #0d1020",
};

const codeText = {
  margin: 0,
  color: "#ffffff",
  fontSize: "34px",
  lineHeight: "42px",
  fontWeight: 900,
  letterSpacing: "10px",
};

const notice = {
  maxWidth: "470px",
  margin: "0 auto",
  padding: "16px 18px",
  borderRadius: "18px",
  color: "#b8c3d9",
  fontSize: "14px",
  lineHeight: "22px",
  backgroundColor: "rgba(255,255,255,0.06)",
};

const footer = {
  padding: "20px 22px 26px",
  textAlign: "center" as const,
  borderTop: "1px solid rgba(255,255,255,0.09)",
  backgroundColor: "rgba(255,255,255,0.03)",
};

const footerText = {
  margin: "0 0 10px",
  color: "#8590a8",
  fontSize: "12px",
  lineHeight: "18px",
};

const footerLinks = {
  margin: 0,
};

const footerLink = {
  color: "#a7f3ff",
  fontSize: "13px",
  fontWeight: 700,
  textDecoration: "none",
};

const separator = {
  color: "#414b63",
};
