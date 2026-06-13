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

interface EnrollmentEmailProps {
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  joiningType: string;
  pricePaid: number;
}

export const EnrollmentConfirmationEmail = ({
  name,
  cohortName,
  cohortDates,
  cohortTime,
  joiningType,
  pricePaid,
}: EnrollmentEmailProps) => (
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
    <Preview>Workshop Registration - Complete Your Payment</Preview>
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
          <Text style={badge}>Workshop Registration</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>Hi {name}!</Heading>
          
          <Text style={text}>
            Thank you for registering for our workshop! Your registration request has been received. Please complete the payment to confirm your spot.
          </Text>

          <Section style={detailsBox}>
            <Heading style={h3}>Workshop Details</Heading>
            <div style={detailRow}>
              <Text style={detailLabel}>Workshop:</Text>
              <Text style={detailValue}>{cohortName}</Text>
            </div>
            <div style={detailRow}>
              <Text style={detailLabel}>Dates:</Text>
              <Text style={detailValue}>{cohortDates}</Text>
            </div>
            <div style={detailRow}>
              <Text style={detailLabel}>Time:</Text>
              <Text style={detailValue}>{cohortTime}</Text>
            </div>
            <div style={detailRow}>
              <Text style={detailLabel}>Format:</Text>
              <Text style={{...detailValue, textTransform: 'capitalize'}}>{joiningType === 'inperson' ? 'In-person' : joiningType}</Text>
            </div>
            <div style={detailRow}>
              <Text style={detailLabel}>Amount:</Text>
              <Text style={{...detailValue, color: '#ffffff', fontWeight: 'bold'}}>PKR {pricePaid.toLocaleString()}</Text>
            </div>
          </Section>

          <Section style={paymentBox}>
            <Heading style={h2}>Payment Instructions</Heading>
            
            <div style={paymentItem}>
              <Text style={paymentLabel}>Bank</Text>
              <Text style={paymentValue}>Meezan Bank- SHARAH-E-FAISALBR-KHI</Text>
            </div>

            <div style={paymentItem}>
              <Text style={paymentLabel}>Account Title</Text>
              <Text style={paymentValue}>JIBRAN JALALI</Text>
            </div>

            <div style={paymentItem}>
              <Text style={paymentLabel}>Account Number</Text>
              <Text style={{...paymentValue, fontSize: '18px', letterSpacing: '1px'}}>01110110259540</Text>
            </div>

            <div style={paymentItem}>
              <Text style={paymentLabel}>IBAN</Text>
              <Text style={paymentValue}>PK75MEZN0001110110259540</Text>
            </div>
          </Section>

          <Section style={warningBox}>
            <Heading style={{...h3, color: '#f59e0b'}}>Important Next Steps</Heading>
            <Text style={smallText}>
              1. Transfer **PKR {pricePaid.toLocaleString()}** to the account above.
            </Text>
            <Text style={smallText}>
              2. Take a screenshot of the payment confirmation.
            </Text>
            <Text style={smallText}>
              3. Send the screenshot to our WhatsApp: **+92 339 0053713**.
            </Text>
            <Text style={smallText}>
              4. Wait for confirmation from our team.
            </Text>
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
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const h2 = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

const h3 = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
};

const text = {
  color: "#bbbbbb",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
  margin: "0 0 24px 0",
};

const detailsBox = {
  backgroundColor: "#111",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #1a1a1a",
  marginBottom: "24px",
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const detailLabel = {
  color: "#666",
  fontSize: "14px",
  margin: "0",
  width: "100px",
};

const detailValue = {
  color: "#bbb",
  fontSize: "14px",
  margin: "0",
  flex: "1",
};

const paymentBox = {
  backgroundColor: "#111",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #1a1a1a",
  marginBottom: "24px",
};

const paymentItem = {
  backgroundColor: "#1a1a1a",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #222",
  marginBottom: "12px",
};

const paymentLabel = {
  color: "#666",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px 0",
};

const paymentValue = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "bold",
  margin: "0",
};

const warningBox = {
  backgroundColor: "rgba(245, 158, 11, 0.05)",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid rgba(245, 158, 11, 0.1)",
  borderLeft: "4px solid #f59e0b",
};

const smallText = {
  color: "#aaa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px 0",
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
