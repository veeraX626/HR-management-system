import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Email service stub - Configure with actual SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const emailService = {
  sendVerificationEmail: async (email, verificationLink) => {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@dayflow-hrms.com',
        to: email,
        subject: 'Email Verification - Dayflow HRMS',
        html: `
          <h1>Welcome to Dayflow HRMS</h1>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>Link expires in 24 hours.</p>
        `
      });
      logger.info(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}`, error);
      return false;
    }
  },

  sendLeaveApprovalEmail: async (email, leaveData, status) => {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@dayflow-hrms.com',
        to: email,
        subject: `Leave ${status} - Dayflow HRMS`,
        html: `
          <h2>Leave ${status}</h2>
          <p>Your leave request has been ${status.toLowerCase()}.</p>
          <p><strong>Type:</strong> ${leaveData.type}</p>
          <p><strong>Period:</strong> ${leaveData.startDate} to ${leaveData.endDate}</p>
          ${leaveData.rejectionReason ? `<p><strong>Reason:</strong> ${leaveData.rejectionReason}</p>` : ''}
        `
      });
      logger.info(`Leave ${status} email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send leave email to ${email}`, error);
      return false;
    }
  },

  sendPasswordResetEmail: async (email, resetLink) => {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@dayflow-hrms.com',
        to: email,
        subject: 'Password Reset - Dayflow HRMS',
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>Link expires in 1 hour.</p>
        `
      });
      logger.info(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}`, error);
      return false;
    }
  }
};
