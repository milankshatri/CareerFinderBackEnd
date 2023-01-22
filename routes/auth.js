const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

router.post('/signup', validation.validateSignup, async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const hash = await bcrypt.hashPassword(password);
    const newUser = new User({ name, email, password: hash });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, BCRYPT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: newUser.getPublicProfile(), token });
});

router.post('/login', validation.validateLogin, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.comparePassword(password, user.password);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, BCRYPT_SECRET, { expiresIn: '1h' });
    res.json({ user: user.getPublicProfile(), token });
});
