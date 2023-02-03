const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const session = require('express-session');
const sessionMiddleware = require('../middleware/session');


router.post('/send', sessionMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    // Generate a random OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    // Send the OTP to the user's email using nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'verner.sanford45@ethereal.email',
          pass: 'dtcv7ZyZUhhMyHHWkF'
      }
    });
    const mailOptions = {
      from: 'iamkshatrimilan@gmail.com',
      to: email,
      subject: 'OTP for email verification',
      text: `Your OTP is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
    // Save the OTP in the user's session for later verification
    req.session.otp = otp;
    console.log(req.session.otp);
    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
});

router.post('/verify', sessionMiddleware, async (req, res) => {
  try {
    const { otp } = req.body;
    // Compare the received OTP with the one in the session
    console.log(typeof otp);
    if (parseInt(req.session.otp) === otp) {
      console.log(req.session.otp);
      // OTP is correct, allow the user to register
      req.session.isVerified = true;
      return res.status(200).json({ message: 'Email verified' });
    } else {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
});

module.exports = router;