// check if auth, not if true user
const requireAuth = (req, res, next) => {
  if (req.get("Cookie") && req.session.user) {
    next(); // User exist, continue to next middleware
  } else {
    res.status(401).json({ error: "User is not authenticated" }); // User is not authenticated
  }
};

module.exports = requireAuth;
