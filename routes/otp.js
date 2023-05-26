const express = require('express');
const router = express.Router();
const path = require('path');
const Mailgen = require('mailgen');
const otpGenerator = require('otp-generator');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');
const User = require('../models/user');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'OTP',
    link: 'https://mailgen.js/',
  },
});

router.post('/generateOTP', async (req, res) => {
  try {
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    req.app.locals.OTP = OTP;

    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already in use' });
    }


    const emailBody = `
      <p>Hi</p>
      <p>Your OTP is: ${OTP}</p>
      <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
      
      <p>Yours truly</p>
      <p>CareerFinder Team</p>
    `;


    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'OTP Verification',
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: `OTP Sent to Email` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/verifyOTP', async (req, res) => {
  try {
    const { code } = req.query;
    const storedOTP = req.app.locals.OTP;

    if (parseInt(storedOTP) === parseInt(code)) {
      req.app.locals.OTP = null; // Reset the OTP value
      req.app.locals.resetSession = true;
      return res.status(201).json({ msg: 'Verification Successful!' });
    }

    return res.status(400).json({ error: 'Invalid OTP' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/verifyIOTP', async (req, res) => {
  console.log(req.app.locals.OTP)
});

module.exports = router;