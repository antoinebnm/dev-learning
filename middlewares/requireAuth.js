const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.status(401).json({ error: "User is not authenticated" }); // User is not authenticated
  }
};

module.exports = requireAuth;
