const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { User, Watchlist, Movie } = require("../models");
const { createUserToken } = require("../middleware/auth");
const { isErrored } = require("stream");
require('dotenv').config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/checkWatchlist', async (req, res, next) => {
    try {
        const movie = await Movie.findOne({movieId: req.body.movieId});
        const inWatchList = await Watchlist.exists({$and: [{ username: req.body.userId }, { movies: movie._id }]})

        if (inWatchList) {
             res.status(200).json(true);
        } else {
             res.status(200).json(false);
        }

        
    } catch(err) {
        res.status(400).json({err: err.message});
    }
})

router.post('/watchlist', async (req, res, next) => {
    try {

        const foundWatchlist = await Watchlist.findOne({ username: req.body.id }).populate('movies');
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
        const newWatchlist = await Watchlist.create({
            username: newUser._id,
            movies: []
        });
        
        req.body.watchlist = newWatchlist._id;


        await User.findByIdAndUpdate(newUser._id, req.body, { new: true })

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

router.put('/addToWatchlist', async (req, res, next) => {
    try {
        const foundMovie = await Movie.exists({ movieId: req.body.movie.movieId})
        if (!foundMovie){
            const createdMovie = await Movie.create(req.body.movie);
            await Watchlist.findOneAndUpdate({ username: req.body.id}, { $push: { movies: createdMovie._id } }, { new: true } );
            res.status(200);
        } else {
            const movie = await Movie.findOne({movieId: req.body.movie.movieId});
            let movieExistInWatchlist = await Watchlist.exists({ $and: [ { username: req.body.id }, { movies: movie._id } ] });
            
            //console.log(movieExistInWatchlist);
            if (!movieExistInWatchlist) {
                await Watchlist.findOneAndUpdate({ username: req.body.id}, { $push: { movies: movie._id } }, { new: true } );
                res.status(200);
            } 
        }
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
        next();
    }
})

module.exports = router;