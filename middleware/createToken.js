require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = (user, expiredTime = "1d") => {
  return jwt.sign(
    {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    process.env.SECRET_KEY,
    { expiresIn: expiredTime }
  );
};

module.exports = createToken;
