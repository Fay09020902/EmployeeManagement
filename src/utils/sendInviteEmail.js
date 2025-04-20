const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const sendInviteEmail = async (email) => {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '3h' });
  const link = `http://localhost:5000/register?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Complete Your Registration',
    html: `
      <h2>You're Invited 🎉</h2>
      <p>Click below to complete your registration. This link is valid for 3 hours.</p>
      <a href="${link}">${link}</a>
    `
  });

  return token;
};

module.exports = sendInviteEmail;
