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

module.exports = router;