// check if auth, not if true user
const requireAuth = (req, res, next) => {
  try {
    if (req.get("Cookie")["sid"] && req.session.user) {
      next(); // User exist, continue to next middleware
    }
  } catch (error) {
    res.status(401).json({ error: "User is not authenticated" }); // User is not authenticated
  }
};

module.exports = requireAuth;
