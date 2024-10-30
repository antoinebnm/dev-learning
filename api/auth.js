const express = require("express");
const auth = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User registration
auth.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ displayName:username, credentials:{login:username, password: hashedPassword}, addedAt:new Date(), gamesPlayed:[] });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
auth.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ 'credentials.login':username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed, invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.credentials.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed, invalid username or password.' });
        }

                                    //userId => Payload res
        const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        const OAuthRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_REFRESH, {
            expiresIn: '24h',
        });
        res.status(200).json({ OAuthToken, OAuthRefreshToken });

    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }});

auth.post('/jwtsigncheck', (req, res, next) => {
    try {
        const { OAuthToken } = req.body;

        if (OAuthToken !== process.env.ADMIN_ACCESS) {
            jwt.verify(OAuthToken, process.env.JWT_SECRET); // Throw error if invalid token (mismatch or outdated)
        } else {
            console.log(`Admin action realised on ${req.method} ${req.url}        
            With a request body of ${req.body}`)
        }
        res.status(200).json({ message: "Valid token" });

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Bad request" });
    }
})

module.exports = auth;