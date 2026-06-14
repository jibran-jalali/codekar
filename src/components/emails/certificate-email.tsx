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
  Button,
} from "@react-email/components";
import * as React from "react";

interface CertificateEmailProps {
  name: string;
  feedbackLink: string;
}

export const CertificateEmail = ({
  name,
  feedbackLink,
}: CertificateEmailProps) => (
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
    <Preview>Your Certificate of Completion from CodeKar</Preview>
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
          <Text style={badge}>Workshop Accomplishment</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>Congratulations, {name}!</Heading>
          
          <Text style={text}>
            It&apos;s a proud moment! You&apos;ve successfully completed the **CodeKar Workshop**. Your dedication to learning and building is truly inspiring.
          </Text>

          <div style={thankYouBox}>
            <Text style={thankYouText}>
              &quot;Thank you for being part of this journey. We hope this workshop has equipped you with the tools to build something amazing.&quot;
            </Text>
          </div>

          <Text style={text}>
            Please find your **Certificate of Completion** attached to this email. It serves as a testament to your hard work and new skills.
          </Text>

          <Section style={feedbackSection}>
            <Heading style={h2}>Help us shape the future</Heading>
            <Text style={smallText}>
              Your feedback is the most valuable thing we can receive. It helps us improve and provide even better experiences for the next generation of builders.
            </Text>
            <Button href={feedbackLink} style={button}>
              Share Your Feedback
            </Button>
          </Section>
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
          <Text style={tagline}>
            Empowering the next generation of builders.
          </Text>
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

const badge = {
  color: "#888",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0",
};

const content = {
  padding: "0 20px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
  letterSpacing: "-0.5px",
};

const h2 = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 12px 0",
};

const text = {
  color: "#bbbbbb",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
  margin: "0 0 20px 0",
};

const smallText = {
  color: "#888",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const thankYouBox = {
  backgroundColor: "#111",
  borderLeft: "4px solid #ffffff",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "24px",
};

const thankYouText = {
  color: "#ffffff",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "0",
  lineHeight: "24px",
};

const feedbackSection = {
  margin: "40px 0 0",
  textAlign: "center" as const,
  backgroundColor: "#111",
  padding: "32px",
  borderRadius: "20px",
  border: "1px solid #1a1a1a",
};

const button = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
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

const tagline = {
  color: "#555",
  fontSize: "12px",
  margin: "0",
  fontStyle: "italic",
};
