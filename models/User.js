const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: [true, 'Username already taken'], required: [true, 'Please enter a username'] },
    password: { type: String, required: [true, 'You must enter a password'] },
    movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' }] //movies saved in users watchlist
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;