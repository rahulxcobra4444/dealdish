const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendVerificationEmail = async (email, name, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"DealDish" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your DealDish account',
    html: `
      <h2>Welcome to DealDish, ${name}!</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}" style="background:#ff6b00;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
  });
};

const sendPasswordResetEmail = async (email, name, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"DealDish" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your DealDish password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, click below to reset your password:</p>
      <a href="${resetUrl}" style="background:#ff6b00;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>This link expires in 10 minutes. If you did not request this, ignore this email.</p>
    `
  });
};

const sendMonthlyReport = async (email, name, stats) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"DealDish" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Monthly DealDish Report',
    html: `
      <h2>Monthly Report for ${name}</h2>
      <p>Here is your performance summary:</p>
      <ul>
        <li>Total Offers: ${stats.totalOffers}</li>
        <li>Total Redemptions: ${stats.totalRedemptions}</li>
        <li>Total Views: ${stats.totalViews}</li>
      </ul>
      <p>Login to your dashboard for more details.</p>
    `
  });
};

const sendBroadcastEmail = async (emails, subject, message) => {
  const transporter = createTransporter();

  for (const email of emails) {
    await transporter.sendMail({
      from: `"DealDish" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: `<div>${message}</div>`
    });
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendMonthlyReport,
  sendBroadcastEmail
};