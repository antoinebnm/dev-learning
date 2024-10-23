const express = require("express");
const api = express.Router();
const path = require("path");
const User = require("../../models/user");
const Game = require("../../models/game");

api.post("/api/users/:action/:id/:attribute?/:value?", async (req, res, next) => {
    console.log('>>>>>>>>>>> Request Type:', req.method, '| Action:', req.params.action);
    switch (req.params.action) {
        case 'add': //id here is the display name & login                           //attribute = password here -> value unused
            new User({ displayName:req.params.id, credentials:{login:req.params.id, password:req.params.attribute}, addedAt:new Date() }).save();
            break;

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
                        let gamesHistory = User.findOne({ _id:req.params.id }).get('playedGames');
                        const newGame = await Game.findById(req.params.value);
                        gamesHistory.push(newGame);
                        await User.updateOne({ _id:req.params.id }, { 
                            $set: { gamesPlayed: gamesHistory }});
                        break;
                    
                    default:
                        break;
                }
            } catch {
                res.status(400).json({ error: "Bad request" });
            }
            break;

        case 'delete': //id here is the DB id / user token
            await User.deleteOne({ _id:req.params.id });
            break;
            
        default:
            break;
    }
    res.status(200).redirect('/scoreboard');
});

// API for user score fetch
api.use("/api/scoreboard/:filtre?", async (req, res, next) => {
    try {
        const users = await User.find(); // Trouve les users
        switch (req.params.filtre) {
            case 'reverse':
                users.sort({ userScore: -1 });
                break;
        
            default:
                break;
        }
        res.json(users); // Renvoie les utilisateurs en format JSON

    } catch (error) {
        res.status(500).json({ error: "Error when retrieving data" });
    }
});

module.exports = api;