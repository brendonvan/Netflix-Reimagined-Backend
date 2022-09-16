const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: [true, 'Username already taken'], required: [true, 'please enter a username'] },
    password: { type: String, required: [true, 'You must enter a password'] },
    movies: [{ type: Number }] //movie id
}, { timestamps: true });

const User = mongoose.model("People", UserSchema);

module.exports = User;