// chheck if auth, not if true user
const requireAuth = (req, res, next) => {
  console.log(req.session);
  if (req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.status(401).json({ error: "User is not authenticated" }); // User is not authenticated
  }
};

module.exports = requireAuth;
