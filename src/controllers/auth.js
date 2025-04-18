const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const gravatar = require('gravatar');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 🔵 HR: Send registration link via email
exports.sendRegistrationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered with this email' });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '3h' });
    const link = `http://localhost:5000/register?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Complete Your Registration',
      html: `
        <h2>Welcome to the Company 🎉</h2>
        <p>Click below to register. This link is valid for 3 hours.</p>
        <a href="${link}">${link}</a>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Registration link sent successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send registration email' });
  }
};

// 🟢 Frontend: Validate token before showing form
exports.validateRegistrationToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ email: decoded.email });
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Link expired' : 'Invalid token';
    res.status(400).json({ message: msg });
  }
};

// 🟢 Register user using token
exports.registerUser = async (req, res) => {
  const { token, username, password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    const user = new User({
      email,
      username,
      password: hashed,
      avatar,
      isVerified: true
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Link expired' : 'Invalid or expired link';
    res.status(400).json({ message: msg });
  }
};

// 🟡 Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      user: {
        id: user._id,
        isAdmin: user.isAdmin
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar
      },
      expiresIn: 3600
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
