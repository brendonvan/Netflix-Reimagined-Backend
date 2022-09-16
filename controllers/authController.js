const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { send } = require("process");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// login
router.post('/login', async (req, res, next) => {

    try {
        const foundUser = await User.findOne({ username: req.body.username });

        if (!foundUser) {
            return res.redirect('/home');
        } else {
            const match = await bcrypt.compare(req.body.password, foundUser.password);
            if (!match) return res.send("invalid password");
            req.session.currentUser = {
                id: foundUser._id,
                username: foundUser.username
            };
        }
    } catch (err) {
        console.log(err);
        next();
    }

});

// register
router.post("/register", async (res, res) => {
    try {
        const foundUser = await User.exists({ username: req.body.username });
        if (foundUser) {
            res.redirect('/login');
        } else {
            const salt = await bcrypt.genSalt(14);
            const hash = await bcrypt.hash(req.body.password, salt);

            req.body.password = hash;

            const newUser = await User.create(req.body);
            console.log(`New User: ${newUser}`);
        }
    } catch (err) {
        console.log(err);
        next();
    }
});

// logout
router.get("/logout", async (req, res) => {
    try {
        await req.session.destroy();
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;