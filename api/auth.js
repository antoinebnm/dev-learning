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
    console.error("Error in /register:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
auth.post("/login", async (req, res, next) => {
  try {
    // if user exist, check if token expired
    if (req.session.user) {
      const verifyToken = jwtSignCheck(req.session.user.OAuthToken, res);
      if (verifyToken) {
        // token not expired
        throw new Error("User already logged in!");
      }
      // else, continue with basic login
    }

    const { username, password } = req.body; // Retreive info on login

    // connect using login/password verification
    const user = await User.findOne({ "credentials.login": username });
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed, invalid username.",
      });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user.credentials.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Authentication failed, invalid password.",
      });
    }

    //userId => Payload res
    const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.regenerate(function (err) {
      if (err) next(err);

      // store user information in session, typically a user id
      req.session.user = {
        OAuthToken: OAuthToken,
        displayName: user.displayName,
      };

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err);
        res.status(200).json({ userInfo: req.session.user });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// User logout
auth.post("/logout", requireAuth, async (req, res) => {
  req.session.user = null;
  res.clearCookie("Cookie");
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.status(200).redirect("/");
    });
  });
});

auth.post("/log", async (req, res) => {
  console.log(">>>> Session ID", req.session.id);
  console.log(">>>> Session Info", req.session);
  console.log(">>>> Session Cookie", req.get("Cookie"));

  res.status(200).json();
});

auth.post("/preload", requireAuth, async (req, res) => {
  try {
    const name = req.session.user.displayName;
    res.status(200).json(name);
  } catch (error) {
    res.status(404).json({ error: "No session username defined." });
  }
});

module.exports = auth;
