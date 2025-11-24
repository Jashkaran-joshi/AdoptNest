const nodemailer = require('nodemailer');
const config = require('../config');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

// Send email
const sendEmail = async (options) => {
  try {
    const message = {
      from: config.email.from,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${config.frontend.url}/reset-password/${token}`;
  
  const message = `
    <h2>Password Reset Request</h2>
    <p>Hello ${user.name},</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    html: message
  });
};

// Send email verification email
const sendEmailVerificationEmail = async (user, token) => {
  const verifyUrl = `${config.frontend.url}/verify-email/${token}`;
  
  const message = `
    <h2>Verify Your Email</h2>
    <p>Hello ${user.name},</p>
    <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Verify Your Email Address',
    html: message
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail
};

