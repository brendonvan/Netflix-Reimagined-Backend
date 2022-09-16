const express = require("express");
const { User } = require("../models");
const router = express.Router();

const { User } = require("../models");

router.get('/', (req, res) => {
    res.send("Hello Netflicks movie")
})

router.get('/watchlistids', (req, res) => {
    res.send("watchlistids page");
})

module.exports = router;