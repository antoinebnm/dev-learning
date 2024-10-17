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

router.use("/api/user/:action/:name/:score", (req, res, next) => {
    console.log('>>>>>>>>>>> Request Type:', req.method, '| Action:', req.params.action);
    switch (req.params.action) {
        case 'create':
            const actualUser = new User({ userName:req.params.name, userScore:req.params.score, dateOfEntry:new Date() });
            actualUser.save();
            //=> User.create(actualUser);
            break;

        default:
            break;
    }
    res.redirect("/");
});

// API pour récupérer les scores des utilisateurs
router.get("/api/scoreboard", async (req, res, next) => {
    try {
        const users = await User.find().sort({ userScore: -1 }); // Trie par score décroissant
        res.json(users); // Renvoie les utilisateurs en format JSON
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données" });
    }
});

module.exports = router;