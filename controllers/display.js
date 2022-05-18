const express = require('express')
const Movie = require('../models/movies')
const axios = require('axios')

module.exports.renderHome = (req, res) => {
    res.render('home')
}
module.exports.renderSearch = (req, res) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in!!')
        return res.redirect('/login')
    }
    res.render('search')
}
module.exports.showMovies = async (req, res, next) => {
    const movies = await Movie.find({})
    console.log(movies[0])
    res.render('show', { movies })

}
module.exports.movieDetails = async (req, res, next) => {
    const movie = await Movie.findById(req.params.id)
    res.render('details', { movie })
}
module.exports.searchMovies = async (req, res, next) => {
    await Movie.deleteMany({})
    const { choice } = req.body
    const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${choice}`)
        .then((response) => {


            const searchedMovie = response.data
            searchedMovie.forEach(item => {
                new Movie(item.show).save()
            })
            console.log('done')
            res.redirect('/show')
        })
}