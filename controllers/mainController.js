const express = require("express");
const { User } = require("../models");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello Netflicks movie")
})

// get current user watchlist
router.get('/watchlist', async (req, res) => {
    try {
        const watchlist = User.find({ username: req.session.currentUser.username }, 'movies').populate('movies');
        res.json(watchlist)
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

})

module.exports = router;