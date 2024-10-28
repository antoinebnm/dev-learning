/**
 * Variable Definition
 */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

/**
 * Middleware Setup
 */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// public access resource setup
app.use(express.static(path.join(__dirname, "public")));

/**
 * Router Setup
 */
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    console.log(`>>>>>>>>>>> Request Type: ${req.method} | URL: /${req.originalUrl}`);
    next()
})

const router = require("./public/routes/router");
app.use('/', router);

const api = require("./public/routes/api");
app.use('/api', api);

const auth = require("./public/routes/auth");
app.use('/auth', auth);

/**
 * Mongoose Connection Setup
 */
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require('dotenv').config();
const DBname = "learning";
const mongoDB = process.env.MONGODB_TOKEN + DBname + "?retryWrites=true&w=majority&appName=Cluster0" ;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
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