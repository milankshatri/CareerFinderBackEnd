const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // check if the token is not undefined
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;