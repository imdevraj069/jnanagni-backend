import nodemailer from 'nodemailer';
// Import Templates
import { getVerificationTemplate } from '../templates/verificationEmail.js';
import { getWelcomeTemplate } from '../templates/welcomeEmail.js';
import { getOtpTemplate } from '../templates/otpEmail.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- 1. SEND VERIFICATION EMAIL (New Registration) ---
export const sendVerificationEmail = async (email, name, jnanagniId, token) => {
  // Construct the Verify URL: /verify/:jnanagniId/:token
  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${jnanagniId}/${token}`;
  
  const html = getVerificationTemplate(name, verifyUrl);

  await transporter.sendMail({
    from: `"Jnanagni Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Action Required: Verify Your Jnanagni Account`,
    html: html
  });
};

// --- 2. SEND WELCOME EMAIL (After Verification) ---
export const sendWelcomeEmail = async (email, name, jnanagniId) => {
  const html = getWelcomeTemplate(name, jnanagniId);

  await transporter.sendMail({
    from: `"Jnanagni Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Jnanagni 2025! [ID: ${jnanagniId}]`,
    html: html
  });
};

// --- 3. SEND OTP EMAIL (Forgot Password) ---
export const sendOtpEmail = async (email, otp) => {
  const html = getOtpTemplate(otp);

  await transporter.sendMail({
    from: `"Jnanagni Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Password Reset Code: ${otp}`,
    html: html
  });
};