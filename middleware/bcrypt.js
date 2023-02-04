const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(process.env.SECRET_KEY)
    return bcrypt.hashSync(password + process.env.SECRET_KEY, salt);
};

const comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password + process.env.SECRET_KEY, hash);
};


module.exports = { hashPassword, comparePasswords};
