const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { createUserToken } = require("../middleware/auth");
const { isErrored } = require("stream");
require('dotenv').config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get('/register', (req, res, next) => {
    res.send("Register Page");
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

// register
router.post('/register', async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(14);
        const hash = await bcrypt.hash(req.body.password, salt);
        const pwStore = req.body.password;

        req.body.password = hash;

        const newUser = await User.create(req.body);
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

module.exports = router;