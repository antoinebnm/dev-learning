const express = require("express");
const session = require("express-session");
const compression = require("compression");
require("dotenv").config();

const createServer = async () => {
  const app = express();
  app.use(compression());
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret_abcdef123456",
      name: "sid",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1 * 60 * 1000, // 1 minutes
        httpOnly: false,
        secure: false, // mettre à `true` en production si HTTPS est utilisé
      }, // miliseconds * seconds * minutes * hour
    })
  );

  app.use("/api/auth", require("../../api/auth"));
  app.use("/api/users", require("../../api/users"));
  console.log(app);

  const PORT = process.env.TEST_PORT || 0;
  const server = app.listen(PORT);
  return { app, server };
};

module.exports = {
  createServer,
};
