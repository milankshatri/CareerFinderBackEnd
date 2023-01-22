const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};

const comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

const secret = process.env.BCRYPT_SECRET;
const hashedPassword = hashPassword(secret);

module.exports = { hashPassword, comparePasswords, hashedPassword };
