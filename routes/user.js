const express = require('express')
const router = express.Router()
const passport = require('passport')

const catchAsync = require('../utiilities/catchAsync')

const User = require('../models/user')
const users = require('../controllers/user')
const { Passport } = require('passport/lib')
const { renderLogin, renderRegister, userLogin, userRegister, logout } = require('../controllers/user')



router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(userLogin))



router.route('/register')
    .get(renderRegister)
    .post(catchAsync(userRegister))

router.get('/logout', logout)

module.exports = router