import nodemailer from 'nodemailer';
import React from 'react';
import { render } from '@react-email/render';
import { PaymentConfirmationEmail } from '@/components/emails/payment-confirmation';
import { EnrollmentConfirmationEmail } from '@/components/emails/enrollment-confirmation';
import { WaitlistConfirmationEmail } from '@/components/emails/waitlist-confirmation';
import { AdminNotificationEmail } from '@/components/emails/admin-notification';
import { MeetingInvitationEmail } from '@/components/emails/meeting-invitation';
import { LocationInvitationEmail } from '@/components/emails/location-invitation';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, react, attachments }: { 
  to: string; 
  subject: string; 
  react: React.ReactElement;
  attachments?: any[];
}) {
  try {
    const html = await render(react);
    
    const info = await transporter.sendMail({
      from: `"CodeKar" <${process.env.GMAIL_USER}>`,
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
}) {
  return sendEmail({
    to: data.email,
    subject: `Enrollment Received - ${data.cohortName}`,
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
  for (const email of data.adminEmails) {
    const result = await sendEmail({
      to: email,
      subject: `New Registration: ${data.studentName} - Pending Payment Verification`,
      react: React.createElement(AdminNotificationEmail, data),
    });
    return results;
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
