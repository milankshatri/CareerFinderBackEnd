const express = require('express');
const router = express.Router();
const path = require("path");
const otpGenerator = require('otp-generator');
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

router.post('/generateOTP',  async (req, res) => {
  try {
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    req.app.locals.OTP = OTP;
    return res.status(201).json({ code: OTP });
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
      req.app.locals.resetSession = true; // Start session for reset password
      return res.status(201).json({ msg: 'Verification Successful!' });
    }

    return res.status(400).json({ error: 'Invalid OTP' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router