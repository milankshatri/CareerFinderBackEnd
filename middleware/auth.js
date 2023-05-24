const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const refreshToken = req.header('Refresh-Token');

        if (!token && !refreshToken) {
            throw new Error();
        }

        if (token) {
            // Handle access token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            req.tokenType = 'access';
        } else if (refreshToken) {
            // Handle refresh token
            const user = await User.findOne({ refreshToken });
            if (!user) {
                throw new Error();
            }
            req.user = user;
            req.tokenType = 'refresh';
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;