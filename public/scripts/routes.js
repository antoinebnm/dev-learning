const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../../models/user");

/* GET users listing. */
router.get("/", (req, res, next) => {
    //res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

router.get("/scoreboard", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../static/scoreboard.html'));
});

router.use("/api/users/:action/:name/:score", async (req, res, next) => {
    console.log('>>>>>>>>>>> Request Type:', req.method, '| Action:', req.params.action);
    switch (req.params.action) {
        case 'add':
            new User({ userName:req.params.name, userScore:req.params.score, dateOfEntry:new Date() }).save();
            break;

        case 'update':
            await User.updateOne({ userName:req.params.name }, { 
                $set: { userScore: req.params.score }}); // Find if user already exist
            break;

        case 'delete':
            await User.deleteOne({ userName:req.params.name });
            break;
            
        default:
            break;
    }
    res.status(204).redirect('/scoreboard');
});

// API for user score fetch
router.use("/api/scoreboard", async (req, res, next) => {
    try {
        const users = await User.find().sort({ userScore: -1 }); // Trie par score décroissant
        res.json(users); // Renvoie les utilisateurs en format JSON
    } catch (error) {
        res.status(500).json({ error: "Error when retrieving data" });
    }
});

module.exports = router;