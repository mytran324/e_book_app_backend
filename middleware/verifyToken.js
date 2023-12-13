require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;


function verifyToken(req, res, next) {
    // Check for the "Authorization" header
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Please log in!' });
    }

    // Extract and verify the token
    jwt.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {

        if (err) {
            return res.status(401).json({ message: 'An error occurred during token validation', error: err.message});
        }

        // You can access the user's information in "decoded" object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = verifyToken;   