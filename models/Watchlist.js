const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    username: { type: mongoose.Types.ObjectId, ref: 'User' },
    movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' }]
}, {
    timestamps: true
});

const Watchlist = mongoose.model("Watchlist", WatchlistSchema);

module.exports = Watchlist;