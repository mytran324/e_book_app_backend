import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
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

export default createToken;
