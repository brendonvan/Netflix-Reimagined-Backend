const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Watchlist } = require("../models");
const { createUserToken } = require("../middleware/auth");
const { isErrored } = require("stream");
require('dotenv').config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get('/register', (req, res, next) => {
    res.send("Register Page");
})

router.post('/watchlist', async (req, res, next) => {
    try {
        console.log('I got hit');
        const foundWatchlist = await Watchlist.findOne({ username: req.body.id })
        res.status(200).json(foundWatchlist);
    } catch (err) {
        res.status(400).json({ err: err.message });
        next();
    }
})

// login
router.post('/login', async (req, res, next) => {

    try {
        const logginUser = req.body.username;
        const foundUser = await User.findOne({ username: logginUser });
        const token = await createUserToken(req, foundUser);
        res.status(200).json({
            user: foundUser,
            isLoggedIn: true,
            token,
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }

});

// create router to fetch user data res.send(currentUser)

// register
router.post('/register', async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(14);
        const hash = await bcrypt.hash(req.body.password, salt);
        const pwStore = req.body.password;

        req.body.password = hash;

        const newUser = await User.create(req.body);
        console.log(req.body)
        // TODO: CREATE WATCHLIST AND ADD TO USER MODEL
        const newWatchlist = await Watchlist.create({
            username: newUser._id,
            movies: []
        });


        if (newUser) {
            req.body.password = pwStore;
            const authenticatedUserToken = createUserToken(req, newUser);
            res.status(201).json({
                user: newUser,
                isLoggedIn: true,
                token: authenticatedUserToken,
            });
        } else {
            res.status(400).json({ error: "Something went wrong" })
        }
    } catch (err) {
        res.status(400).json({ err: err.message });
        next();
    }
});

router.put('/addWatchlist', async (req, res) => {
    try {
        const filter = { username: req.user._id };
        const updatedUser = { $push: { movies: [req.body] } };
        res.json(await User.findOneAndUpdate(filter, updatedUser, { new: true }));
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
        next();
    }
})

module.exports = router;