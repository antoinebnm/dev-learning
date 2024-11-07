// chheck if auth, not if true user
const requireAuth = (req, res, next) => {
  console.log("userId:", req.session.userId, "CookieSid:", req.get("Cookie"));
  if (req.session.userId || req.get("Cookie")) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.status(401).json({ error: "User is not authenticated" }); // User is not authenticated
  }
};

module.exports = requireAuth;
