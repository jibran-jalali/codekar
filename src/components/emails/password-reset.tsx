import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  code: string;
}

export const PasswordResetEmail = ({ code }: PasswordResetEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          :root { color-scheme: dark; supported-color-schemes: dark; }
          body { background-color: #000000 !important; }
          .container { background-color: #0a0a0a !important; }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 20px !important;
              border-radius: 0 !important;
            }
          }
        `}
      </style>
    </Head>
    <Preview>Your password reset code for CodeKar Admin</Preview>
    <Body style={main}>
      <Container style={container} className="container">
        <Section style={header}>
          <Img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Codekar-1766840680469.png?width=400&height=400&resize=contain"
            width="120"
            height="auto"
            alt="CodeKar"
            style={logo}
          />
        </Section>

        <Section style={content}>
          <Heading style={h1}>Password Reset</Heading>
          
          <Text style={paragraph}>
            You requested a password reset for your CodeKar Admin account.
            Use the code below to reset your password:
          </Text>

          <Section style={codeBox}>
            <Text style={codeText}>{code}</Text>
          </Section>

          <Text style={warningText}>
            This code expires in 10 minutes. If you didn&apos;t request this reset, 
            please ignore this email.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            © 2025 CodeKar. All rights reserved.
          </Text>
          <div style={socialLinks}>
            <Link href="https://wa.me/923390053713" style={socialLink}>WhatsApp</Link>
            <span style={dot}>•</span>
            <Link href="https://instagram.com/codekar_" style={socialLink}>Instagram</Link>
          </div>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#0a0a0a",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "24px",
  border: "1px solid #1a1a1a",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto 16px",
  display: "block",
};

const content = {
  padding: "0 20px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const paragraph = {
  color: "#bbbbbb",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const codeBox = {
  backgroundColor: "#111",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #1a1a1a",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const codeText = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
};

const warningText = {
  color: "#888888",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#1a1a1a",
  margin: "40px 0 20px",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#444",
  fontSize: "12px",
  margin: "0 0 12px 0",
};

const socialLinks = {
  marginBottom: "16px",
};

const socialLink = {
  color: "#888",
  fontSize: "13px",
  textDecoration: "none",
  margin: "0 8px",
};

const dot = {
  color: "#222",
  fontSize: "13px",
};
