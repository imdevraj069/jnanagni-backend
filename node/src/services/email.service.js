import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper for CSS styles
const getBaseStyles = () => `
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
    .id-card { background: #f3f4f6; border-left: 5px solid #7c3aed; padding: 15px; margin: 20px 0; }
    .id-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    .id-value { font-size: 24px; font-weight: bold; color: #111827; font-family: monospace; }
    .button { display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #888; }
  </style>
`;


// --- WELCOME EMAIL TEMPLATE ---
// Updated Signature to accept 'uniqueId'
export const sendWelcomeEmail = async (email, name, uniqueId) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>${getBaseStyles()}</head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">JNANAGNI</div>
          </div>
          <div class="content">
            <h2>Welcome to the Grid, ${name}!</h2>
            <p>Your registration is confirmed. Here is your official Cadet ID:</p>
            
            <div class="id-card">
              <div class="id-label">Jnanagni ID</div>
              <div class="id-value">${uniqueId}</div>
            </div>

            <p>Use this ID for team registrations and entry verification.</p>
            <center><a href="${process.env.FRONTEND_URL}/dashboard" class="button">Access Dashboard</a></center>
          </div>
          <div class="footer">
            &copy; 2025 Jnanagni Tech Fest. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Jnanagni Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome Cadet! Your ID: ${uniqueId}`,
    html: html
  });
};

// --- NEW OTP EMAIL TEMPLATE ---
export const sendOtpEmail = async (email, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>${getBaseStyles()}</head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">JNANAGNI</div>
          </div>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the verification code below to complete the process:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>

          <p>This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          
          <div class="footer">
            &copy; 2025 Jnanagni Tech Fest.
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Jnanagni Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otp}`,
    html: html
  });
};