import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const verifyToken = (req, res, next) => {
  // Check for the "Authorization" header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Please log in!" });
  }

  // Extract and verify the token
  jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "An error occurred during token validation",
        error: err.message,
      });
    }

    // You can access the user's information in "decoded" object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};

export default verifyToken;
