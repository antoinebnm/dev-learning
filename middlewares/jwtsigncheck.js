const jwt = require("jsonwebtoken");
require("dotenv").config();

var jwtSignCheck = (req, res) => {
    try {
        const { OAuthToken } = req.body;

        if (OAuthToken !== process.env.ADMIN_ACCESS) {
            jwt.verify(OAuthToken, process.env.JWT_SECRET); // Throw error if invalid token (mismatch or outdated)
        } else {
            console.log(`Admin action realised on ${req.method} ${req.url}        
            With a request body of ${req.body}`);
        }

        res.status(200).json({ message: "Valid token" });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Bad request" });
    }
};

module.exports = jwtSignCheck;
