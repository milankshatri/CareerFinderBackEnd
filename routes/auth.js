const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const bcrypt = require("../middleware/bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const path = require("path");
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { id } = require('@hapi/joi/lib/base');
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const generateRefreshToken = () => {
  const refreshToken = uuidv4();
  return refreshToken;
};

router.post('/signup', validation.validateSignup, async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const hashed = await bcrypt.hashPassword(password, 10);
    const newUser = new User( name, email, phoneNumber, hashed );
    const refreshToken = generateRefreshToken();
    newUser.refreshToken = refreshToken;
    await newUser.save();
    const accesstoken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: newUser.getPublicProfile(), accesstoken, refreshToken });
});

router.post('/login', validation.validateLogin, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.comparePasswords(password, user.password);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Logged In", email: email, token });
});

router.get('/users', auth, async (req, res) => {
    const user = req.user;
    res.json({ user });
});

module.exports = router