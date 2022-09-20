const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: [true, 'Username already taken'], required: [true, 'Please enter a username'] },
    password: { type: String, required: [true, 'You must enter a password'] },
    Watchlist: { type: mongoose.Types.ObjectId, ref: 'Watchlist' }
}, {
    timestamps: true, toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            return ret;
        }
    }, id: false
});

const User = mongoose.model("User", UserSchema);

module.exports = User;