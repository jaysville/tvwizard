const express = require('express')
const User = require('../models/user')


module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}
module.exports.renderRegister = (req, res) => {
    res.render('user/register')
}
module.exports.userLogin = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/search'
    const user = req.user
    req.flash('success', ` Welcome back, ${user.username}`)
    delete req.session.returnTo
    res.redirect(redirectUrl)
}
module.exports.userRegister = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registered = await User.register(user, password)
        req.login(registered, err => {
            if (err) return next(err)
        })
        req.flash('success', ` Welcome, ${user.username}`)
        res.redirect('/search')
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.logout = (req, res) => {
    req.logout()
    const user = req.user
    req.flash('success', 'logged out !')
    res.redirect('/')
}