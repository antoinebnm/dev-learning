const express = require("express");
const router = express.Router();
const path = require("path");

/* GET users listing. */
router.get("/", (req, res, next) => {
    //res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

router.get("/scoreboard", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../static/scoreboard.html'));
});

router.use("/user/:name/:score", (req, res, next) => {
    const User = require("../../models/user");
    console.log('>>>>>>>>>>> Request Type:', req.method, '| Name:', req.params.name, '| Score:', req.params.score);
    let actualUser = new User({})
    res.redirect("/");
});

module.exports = router;