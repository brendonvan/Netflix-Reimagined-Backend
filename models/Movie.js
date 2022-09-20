const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Movie must have a title.'] },
}, { timestamps: true })

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;