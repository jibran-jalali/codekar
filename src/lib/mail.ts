import nodemailer from 'nodemailer';
import React from 'react';
import { render } from '@react-email/render';
import { PaymentConfirmationEmail } from '@/components/emails/payment-confirmation';
import { EnrollmentConfirmationEmail } from '@/components/emails/enrollment-confirmation';
import { WaitlistConfirmationEmail } from '@/components/emails/waitlist-confirmation';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';
import { MeetingInvitationEmail } from '@/components/emails/meeting-invitation';
import { LocationInvitationEmail } from '@/components/emails/location-invitation';

type EmailAttachment = {
  filename: string;
  content: string | Buffer;
};

function getMailCredentials() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!user || !pass) {
    throw new Error("Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }

  return { user, pass };
}

function createTransporter() {
  const { user, pass } = getMailCredentials();

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendEmail({ to, subject, react, attachments }: { 
  to: string; 
  subject: string; 
  react: React.ReactElement;
  attachments?: EmailAttachment[];
}) {
  try {
    const { user } = getMailCredentials();
    const html = await render(react);
    
    const info = await createTransporter().sendMail({
      from: `"CodeKar" <${user}>`,
      to,
      subject,
      html,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    console.log('Email sent: %s', info.messageId);
    return { data: info };
  } catch (err) {
    console.error('Failed to send email:', err);
    return { error: err };
  }
}

export async function sendPaymentConfirmationEmail(data: {
  email: string;
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  joiningType: string;
  meetingLink?: string;
}) {
  return sendEmail({
    to: data.email,
    subject: `Payment Confirmed - ${data.cohortName}`,
    react: React.createElement(PaymentConfirmationEmail, data),
  });
}

export async function sendEnrollmentEmail(data: {
  email: string;
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  joiningType: string;
  pricePaid: number;
  meetingLink?: string;
  whatsappGroupLink?: string;
}) {
  const isFreeRegistration = data.pricePaid <= 0;

  return sendEmail({
    to: data.email,
    subject: `${isFreeRegistration ? "Registration Confirmed" : "Enrollment Received"} - ${data.cohortName}`,
    react: React.createElement(EnrollmentConfirmationEmail, data),
  });
}

export async function sendWaitlistEmail(data: {
  email: string;
  name: string;
  cohortName: string;
}) {
  return sendEmail({
    to: data.email,
    subject: `Waitlist Confirmation - ${data.cohortName}`,
    react: React.createElement(WaitlistConfirmationEmail, data),
  });
}

export async function sendAdminNotificationEmail(data: {
  adminEmails: string[];
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  cohortName: string;
  pricePaid: number;
  joiningType: string;
}) {
  const results = [];
  const adminEmails = [...new Set(data.adminEmails.map(email => email.trim()).filter(Boolean))];
  const isFreeRegistration = data.pricePaid <= 0;

  for (const email of adminEmails) {
    const result = await sendEmail({
      to: email,
      subject: `New Registration: ${data.studentName} - ${isFreeRegistration ? "Free Workshop Confirmed" : "Pending Payment Verification"}`,
      react: React.createElement(AdminNotificationEmail, data),
    });
    results.push({ email, ...result });
  }

  return results;
}

export async function sendMeetingInvitationEmail(data: {
  email: string;
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  meetingLink: string;
}) {
  return sendEmail({
    to: data.email,
    subject: `Meeting Link - ${data.cohortName}`,
    react: React.createElement(MeetingInvitationEmail, data),
  });
}

export async function sendLocationInvitationEmail(data: {
  email: string;
  name: string;
  cohortName: string;
  cohortDates: string;
  cohortTime: string;
  locationName: string;
  locationLink: string;
}) {
  return sendEmail({
    to: data.email,
    subject: `Workshop Location - ${data.cohortName}`,
    react: React.createElement(LocationInvitationEmail, data),
  });
}
