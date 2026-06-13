import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

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
}: AdminNotificationEmailProps) => (
  <Html>
    <Head>
      <style>
        {`
          :root { color-scheme: dark; supported-color-schemes: dark; }
          body { background-color: #000000 !important; }
          .container { background-color: #0a0a0a !important; }
        `}
      </style>
    </Head>
    <Preview>New Registration: {studentName} - Pending Payment Verification</Preview>
    <Body style={main}>
      <Container style={container} className="container">
        <Section style={header}>
          <Text style={badge}>New Registration Alert</Text>
          <Heading style={h1}>Payment Pending Verification</Heading>
        </Section>

        <Section style={content}>
          <Section style={alertBox}>
            <Text style={alertText}>
              A new student has registered and claims to have made payment. Please verify in the dashboard.
            </Text>
          </Section>

          <Section style={detailsBox}>
            <Heading style={h3}>Student Details</Heading>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={labelCell}>Name</td>
                  <td style={valueCell}>{studentName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Email</td>
                  <td style={valueCell}>{studentEmail}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Phone</td>
                  <td style={valueCell}>{studentPhone}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Workshop</td>
                  <td style={valueCell}>{cohortName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Format</td>
                  <td style={valueCell}>{joiningType === 'inperson' ? 'In-person' : 'Online'}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Amount</td>
                  <td style={{...valueCell, color: '#22c55e', fontWeight: 'bold'}}>PKR {pricePaid.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={ctaBox}>
            <Link href="https://codekar.co/admin/dashboard" style={ctaButton}>
              Open Dashboard to Verify
            </Link>
          </Section>

          <Text style={smallText}>
            Go to the Enrollments tab → Pending section to verify and mark this payment as confirmed.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            This is an automated notification from CodeKar Admin System.
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

const badge = {
  color: "#f59e0b",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 8px 0",
};

const content = {
  padding: "0 20px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0",
};

const h3 = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
};

const alertBox = {
  backgroundColor: "rgba(245, 158, 11, 0.1)",
  padding: "16px 20px",
  borderRadius: "12px",
  border: "1px solid rgba(245, 158, 11, 0.2)",
  marginBottom: "24px",
};

const alertText = {
  color: "#f59e0b",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  textAlign: "center" as const,
};

const detailsBox = {
  backgroundColor: "#111",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #1a1a1a",
  marginBottom: "24px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  color: "#666",
  fontSize: "13px",
  padding: "8px 0",
  width: "100px",
  verticalAlign: "top" as const,
};

const valueCell = {
  color: "#fff",
  fontSize: "14px",
  padding: "8px 0",
  fontWeight: "500",
};

const ctaBox = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#ffffff",
  color: "#000000",
  padding: "14px 32px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};

const smallText = {
  color: "#666",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
  margin: "0",
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
  fontSize: "11px",
  margin: "0",
};
