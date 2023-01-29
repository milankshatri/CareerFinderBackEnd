const jwt = require('jsonwebtoken');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '24h'});
}

module.exports = createToken;