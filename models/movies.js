const mongoose = require('mongoose')





const movieSchema = new mongoose.Schema({
    name: String,
    id: Number,
    summary: String,
    language: String,
    genres: [{
        type: String,

    }],
    image: {
        medium: String
    },
    rating: {
        average: Number,
    }
    ,
    premiered: String

})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie

