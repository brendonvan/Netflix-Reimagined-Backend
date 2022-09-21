const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    movieTitle: { type: String, required: [true, 'Movie must have a title.'] },
    movieId: { type: Number, required: [true, 'You must add the movie Id from the API']},
    posterURL: { type: String, required: [true, 'You must add the URL to the poster']}
}, { timestamps: true })

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;