const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require("../models");

const secret = '258147369'; // TODO move to dotenv file

// required options for passport-jwt
const opts = {
    // how passport should find and extract the token from the request
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // secret string unique to our app
    secretOrKey: secret
}

const verify = async (jwt_payload, done) => {
    try {
        // jwt_payload is the data extracted from the token
        const user = await User.findById(jwt.jwt_payload.id);
        // done passes user onto our route. First parameter is an error so we put null since there should be no error here
        return done(null, user)
    } catch (err) {
        return done(err);
    }
}

const strategy = new Strategy(opts, verify);

passport.use(strategy);
passport.initialize();

// this holds the authenticate method so we can export it for use in our routes
const requireToken = passport.authenticate('jwt', { session: false });

const createUserToken = (req, user) => {
    // check is there is a user and that the password matches
    if (!user || !req.body.password || !bcrypt.compareSync(req.body.password, user.password)) {
        const error = new Error("Incorrect username or password.")
        error.statusCode = 422;
        throw error;
    }
    // if there was no error then create a token from the users id and return the token
    return jwt.sign({ id: user._id }, secret, { expiresIn: 36000 })
}

const handleValidateOwnership = (req, document) => {
    const ownerId = document.owner._id || document.owner;
    if (!req.user._id.equals(ownerId)) {
        throw Error("Unauthorized access")
    } else {
        return document;
    }
}

module.exports = { requireToken, createUserToken, handleValidateOwnership }