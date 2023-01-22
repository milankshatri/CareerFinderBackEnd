const jwt = require('jsonwebtoken');
const secret = require('../config/secret');

router.post('/signup', validation.validateSignup, async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const hash = await bcrypt.hashPassword(password);
    const newUser = new User({ name, email, password: hash });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '1h' });
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
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.json({ user: user.getPublicProfile(), token });
});
