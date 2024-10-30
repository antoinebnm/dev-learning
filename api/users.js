const express = require("express");
const api = express.Router();
const User = require("../models/user");
const Game = require("../models/game");
const fetchData = require("../middlewares/fetchData");
require('dotenv').config();

api.post("/users/:action/:id/:attribute?/:value?", async (req, res, next) => {
    switch (req.params.action) {
        case 'update': //id here is the DB id / user token
            try {
                switch (req.params.attribute) {
                    case 'displayName':
                        await User.updateOne({ _id:req.params.id }, { 
                            $set: { displayName: req.params.value }});
                        break;
                    
                    case 'password':
                        await User.updateOne({ _id:req.params.id }, { 
                            $set: { password: req.params.value }});
                        break;
                        
                    case 'games':
                        let gamesHistory = await User.findOne({ _id:req.params.id }).get('gamesPlayed');
                        const newGame = await Game.findById(req.params.value);
                        gamesHistory.push(newGame);
                        await User.updateOne({ _id:req.params.id }, { 
                            $set: { gamesPlayed: gamesHistory }});
                        break;
                    
                    default:
                        next();
                        break;
                }
            } catch {
                res.status(400).json({ error: "Bad request" });
            }
            break;

        case 'delete': //id here is the DB id / user token
            try {
                await User.deleteOne({ _id:req.params.id });
                res.status(200).redirect("/");
            } catch (error) {
                res.status(500).json({ error: "Error when retrieving data" });
            }
            break;

        case 'read':
            try {
                if (req.params.id == 'all') {
                    const users = await User.find(); // Trouve les users
                    res.status(200).json(users);
                    
                } else {
                    const user = await User.findOne({ 'credentials.login':req.params.id });
                    if (req.params.attribute === undefined) {
                        res.status(400).json({ error: "Bad request" });

                    } else if (user.credentials.password == req.params.attribute) {
                        res.status(200).json(user._id);

                    } else {
                        res.status(401).json({ error: "Unauthorized" });
                    }
                }
            } catch (error) {
                res.status(500).json({ error: "Error when retrieving data" });
            }
            
        default:
            break;
    }
});

api.post('/users/update', async (req, res, next) => {
    try {
        const { userLogin, OAuthToken, param, newValue } = req.body;

        const verifyToken = await fetchData(req, `/auth/jwtsigncheck`, { 'OAuthToken': OAuthToken });
        if (!verifyToken) { 
            throw new Error("Token verification failed");
        }

        if (param == 'gamesPlayed') {
            throw new Error("Games update unsupported for now.");
            
        }

        await User.findOneAndUpdate({ 'credentials.login': userLogin }, { [param]: newValue }, { returnOriginal:false })
        .then(() => {
            res.status(200).json({ message: "User document updated" });
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Bad request" });
    }
});

// API for user score fetch
api.use("/scoreboard/:gameType?/:filtre?", async (req, res, next) => {
    const gameType = req.params.gameType || 'chrono';
    const filter = req.params.filtre || 'reverse';
    console.log(`Game: ${gameType} | Filter: ${filter}`);
    try {
        switch (filter) {
            case 'reverse':
                //users.sort({ userScore: -1 });
                break;
        
            default:
                break;
        }
        //res.json(users); // Renvoie les utilisateurs en format JSON

    } catch (error) {
        res.status(500).json({ error: "Error when retrieving data" });
    }
});

module.exports = api;