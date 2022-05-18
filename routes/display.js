const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utiilities/catchAsync')
const Movie = require('../models/movies')
const { renderHome, renderSearch, showMovies, movieDetails, searchMovies } = require('../controllers/display')



router.get('/', renderHome)

router.get('/search', renderSearch)

router.route('/show')
    .get(catchAsync(showMovies))
    .post(catchAsync(searchMovies))

router.get('/show/:id', catchAsync(movieDetails))




module.exports = router