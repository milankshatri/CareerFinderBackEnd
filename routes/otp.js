const express = require('express');
const router = express.Router();
const path = require("path");
const otpGenerator = require('otp-generator');
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const nodemailer = require ('nodemailer');
const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post('/generateOTP',  async (req, res) => {
  try {
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    req.app.locals.OTP = OTP;

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email, // Assuming the email is provided in the request body
      subject: 'OTP Verification',
      text: `Your OTP is: ${OTP}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "OTP Sent to Email" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/verifyOTP',  async (req, res) => {
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

module.exports = router