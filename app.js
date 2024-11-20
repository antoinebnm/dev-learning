/**
 * Variable Definition
 */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const compression = require("compression");
const session = require("express-session");

require("dotenv").config();

const app = express();

/**
 * Middleware Setup
 */
app.use(compression()); // Compress all routes

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000, // 10 minutes
      httpOnly: false,
      secure: false, // mettre à `true` en production si HTTPS est utilisé
    }, // miliseconds * seconds * minutes * hour
  })
);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
//const helmet = require("helmet");
//app.use(helmet());

// Set up rate limiter: max requests per windowMs
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1000, // 1 second
  max: 128,
});
// Apply rate limiter to all requests
app.use(limiter);

// public access resource setup
app.use(express.static(path.join(__dirname, "public")));

/**
 * Router Setup
 */
const aliveDate = new Date().getTime();
app.use((req, res, next) => {
  console.log(`Time elapsed since alive: ${Date.now() - aliveDate}ms`);
  console.log(
    `>>>>>>>>>>> Request Type: ${req.method} | URL: ${req.originalUrl}`
  );
  next();
});

const router = require("./public/router/routes");
app.use("/", router);

const api = require("./api/users");
app.use("/api", api);

const auth = require("./api/auth");
app.use("/api/auth", auth);

/**
 * Mongoose Connection Setup
 */
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const DBname = "learning";
const mongoDB =
  process.env.MONGODB_TOKEN +
  DBname +
  "?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));
async function main() {
  await mongoose
    .connect(mongoDB)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));
}

/**
 * Error Handler
 */

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`<h1>Error ${err.status} - ${err.message}</h1>`);
});

/**
 * Port Listen
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
