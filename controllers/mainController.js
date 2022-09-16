const express = require("express");
const { User } = require("../models");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello Netflicks movie")
})

// get current user watchlist
router.get('/watchlist', async (req, res) => {
    try {
        const watchlist = await User.find({ username: req.session.currentUser.username }, 'movies').populate('movies');
        res.json(watchlist)
    } catch (err) {
        console.log(err);
        res.send('Not currently logged in');
        res.status(400).json(err);
    }

});

router.put('/addtowatchlist', async (req, res) => {
    try {
        const filter = { username: req.session.currentUser.username };
        const updatedUser = { $push: { movies: [req.body] } };
        res.json(await User.findOneAndUpdate(filter, updatedUser, { new: true }));
        res.send('Logged out.');
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;