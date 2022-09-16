const express = require("express");
const { User } = require("../models");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello Netflicks movie")
})

// get current user watchlist
router.get('/watchlist', async (req, res) => {
    try {
        if (req.session.currentUser) {
            const watchlist = await User.find({ username: req.session.currentUser.username }, 'movies').populate('movies');
            res.json(watchlist)
        } else {
            res.status(400).json("Not logged in");
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});

// add movie to current user watchlist
router.put('/addtowatchlist', async (req, res) => {
    try {
        const filter = { username: req.session.currentUser.username };
        const updatedUser = { $push: { movies: [req.body] } };
        res.json(await User.findOneAndUpdate(filter, updatedUser, { new: true }));
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// remove movie from watchlist
router.put('/removefromwatchlist', async (req, res) => {
    try {
        const movieToRemove = await req.body;
        res.json(await User.updateOne({ username: req.session.currentUser.username }, { $pullAll: { movies: [movieToRemove] } }));

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;