const nodemailer = require('nodemailer');

// Validate SMTP configuration on startup
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('⚠️  WARNING: SMTP credentials not fully configured. Email sending may fail.');
  console.warn('   Missing:', {
    SMTP_HOST: !process.env.SMTP_HOST ? 'Yes' : 'Set',
    SMTP_PORT: !process.env.SMTP_PORT ? 'Yes' : 'Set',
    SMTP_USER: !process.env.SMTP_USER ? 'Yes' : 'Set',
    SMTP_PASS: !process.env.SMTP_PASS ? 'Yes' : 'Set',
  });
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const escapeHTML = (str) => {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sendEmail = async (to, subject, html) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER;
    const senderName = process.env.SENDER_NAME || 'GhummGhamm';
    
    console.log('📨 Sending email:');
    console.log('   From:', `"${senderName}" <${senderEmail}>`);
    console.log('   To:', to);
    console.log('   Subject:', subject);
    
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent successfully to', to, 'Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    console.error('   Error code:', error.code);
    console.error('   To:', to);
    console.error('   Subject:', subject);
    throw error;
  }
};

const otpTemplate = (otp, userName = 'User') => {
  const safeName = escapeHTML(userName);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email - GhummGhamm</h2>
      <p>Hi ${safeName},</p>
      <p>Your OTP for account verification is:</p>
      <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
      <p style="color: #666;">This OTP is valid for <strong>24 hours</strong>.</p>
      <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      <hr/>
      <p style="font-size: 12px; color: #999;">GhummGhamm © 2026</p>
    </div>
  `;
};

const paymentTemplate = (details) => {
  const safeName = escapeHTML(details.userName);
  const safePackage = escapeHTML(details.packageName);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">✓ Booking Confirmed</h2>
      <p>Hi ${safeName},</p>
      <p>Your booking has been confirmed! Here are your details:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Booking Reference</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${details.bookingRef}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Package</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safePackage}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Travel Date</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${details.travelDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Travelers</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${details.travelers}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>$${details.amount}</strong></td>
        </tr>
      </table>
      <p>Thank you for choosing GhummGhamm!</p>
      <hr/>
      <p style="font-size: 12px; color: #999;">GhummGhamm © 2026</p>
    </div>
  `;
};

const premiumTemplate = (details) => {
  const safeName = escapeHTML(details.userName);
  const safeTier = escapeHTML(details.tier);
  const safeBenefits = escapeHTML(details.benefits);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ffc107;">✨ Premium Subscription Confirmed</h2>
      <p>Hi ${safeName},</p>
      <p>Welcome to GhummGhamm Premium! Your subscription is now active.</p>
      <div style="background: #fff3cd; padding: 15px; border-radius: 5px;">
        <p><strong>Tier:</strong> ${safeTier}</p>
        <p><strong>Validity:</strong> ${details.validUntil}</p>
        <p><strong>Benefits:</strong> ${safeBenefits}</p>
      </div>
      <p>Enjoy exclusive discounts and features!</p>
      <hr/>
      <p style="font-size: 12px; color: #999;">GhummGhamm © 2026</p>
    </div>
  `;
};

module.exports = { sendEmail, otpTemplate, paymentTemplate, premiumTemplate };
