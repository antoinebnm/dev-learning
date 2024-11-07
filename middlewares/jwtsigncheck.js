const jwt = require("jsonwebtoken");
require("dotenv").config();

var jwtSignCheck = (OAuthToken, res) => {
  try {
    if (OAuthToken !== process.env.ADMIN_ACCESS) {
      jwt.verify(OAuthToken, process.env.JWT_SECRET); // Throw error if invalid token (mismatch or outdated)
    } else {
      console.log(`Admin action realised on ${req.method} ${req.url}        
With a request body of ${req.body}`);
    }
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = jwtSignCheck;
