const express = require("express");
const auth = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSignCheck = require("../middlewares/jwtsigncheck");
const requireAuth = require("../middlewares/requireAuth");
require("dotenv").config();

// User registration
auth.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      displayName: username,
      credentials: { login: username, password: hashedPassword },
      addedAt: new Date(),
      gamesPlayed: [],
    });
    await user.save();
    req.session.userId = user._id; // Set session identifier
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
auth.post("/login", async (req, res) => {
  try {
    const { username, password, token } = req.body; // Retreive info on login
    if (token) {
      // if cookie session log, then token exist => verify token and connect
      try {
        console.log(req.body);
        const verifyToken = jwtSignCheck(token, res);
        if (!verifyToken) {
          throw new Error("Token verification failed");
        }

        const payload = jwt.decode(token);
        console.log(payload);
        // connect user using _id from payload
        var user = await User.findById(payload["userId"]);
      } catch (error) {
        console.log(error);
      }
    } else {
      // else connect using login/password verification
      var user = await User.findOne({ "credentials.login": username });
      if (!user) {
        return res.status(401).json({
          error: "Authentication failed, invalid username or password.",
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.credentials.password
      );
      if (!passwordMatch) {
        return res.status(401).json({
          error: "Authentication failed, invalid username or password.",
        });
      }
    }

    //userId => Payload res
    const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const OAuthRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_REFRESH,
      {
        expiresIn: "24h",
      }
    );

    req.session.userId = OAuthToken; // user._id; // Set session identifier
    res.status(200).json({ OAuthToken, OAuthRefreshToken });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// User logout
auth.post("/logout", requireAuth, async (req, res) => {
  req.session.userId = null;
  res.status(200).redirect("/");
});

module.exports = auth;
