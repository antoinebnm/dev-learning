// check if auth, not if true user
const requireAuth = (req, res, next) => {
  try {
    if (req.session.user) {
      next(); // User connected, continue to next middleware
    } else {
      res.status(401).json({ error: "User is not authenticated" }); // User is not authenticated
    }
  } catch (error) {
    res.status(500);
  }
};

module.exports = requireAuth;
