const express = require("express");
const auth = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSignCheck = require("../middlewares/jwtsigncheck");
const requireAuth = require("../middlewares/requireAuth");
const getHeader = require("../middlewares/getHeader");
require("dotenv").config();

// User registration
auth.post("/register", async (req, res) => {
  try {
    const login = req.headers.login; // Retreive info on login
    const password = req.headers.password; // Retreive info on password
    const username = req.headers.displayname;

    if (!login || !password || !username) {
      throw new Error("No Authenticate Header");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      displayName: username,
      credentials: { login: login, password: hashedPassword },
      addedAt: new Date(),
      gamesPlayed: [],
    });

    await user.save();

    //userId => Payload res
    const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    /**
     * Generate session id
     * Add data into session
     * Save session with data
     */
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
        res.status(201).json({
          userInfo: req.session.user,
          message: "User registered successfully",
        });
      });
    });
  } catch (error) {
    console.error("Error in /register:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
auth.post("/login", async (req, res, next) => {
  try {
    // if user exist, check if token expired
    if (req?.session?.user?.OAuthToken) {
      const verifyToken = jwtSignCheck(req.session.user.OAuthToken, res);
      if (verifyToken) {
        // token not expired
        throw new Error("User already logged in!");
      }
      // else, continue with basic login
    }

    if (!req.headers.login || !req.headers.password) {
      throw new Error("No Authenticate Header");
    }
    const login = req.headers.login; // Retreive info on login
    const password = req.headers.password; // Retreive info on password

    // connect using login/password verification
    const user = await User.findOne({ "credentials.login": login });
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed, invalid credentials.",
      });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user.credentials.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Authentication failed, invalid credentials.",
      });
    }

    //userId => Payload res
    const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    /**
     * Generate session id
     * Add data into session
     * Save session with data
     */
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
    res.status(500).json({ error: error.message });
  }
});

// User logout
auth.post("/logout", requireAuth, async (req, res) => {
  /**
   * Clear session data
   * Save cleared session
   * Regenerate session id
   */

  res.clearCookie("sid");
  req.session.destroy(function (err) {
    if (err) next(err);

    res.status(200).json(req.session);
  });
});

auth.post("/log", async (req, res) => {
  console.log(">>>> Session ID", req.session.id);
  console.log(">>>> Session Info", req.session);
  console.log(
    ">>>> Request Cookie(s)",
    getHeader(req, res) ? "exist" : "inexistent"
  );

  res.status(200).json(getHeader(req, res));
});

auth.post("/preload", requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    res.status(200).json(user.displayName);
  } catch (error) {
    res.status(404).json({ error: "No session user defined." });
  }
});

module.exports = auth;
