if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express();
const path = require('path')

const mongoose = require('mongoose')
const { stringify } = require('querystring');
const Movie = require('./models/movies')
const ejsMate = require('ejs-mate')
const session = require('express-session')

const passport = require('passport')
const LocalStategy = require('passport-local')
const flash = require('connect-flash')
const User = require('./models/user')
const MongoStore = require('connect-mongo')
const userRoutes = require('./routes/user')
const displayRoutes = require('./routes/display')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/tvAppupdated'
class showError extends Error {
    constructor(message, status) {
        super()
        this.message = message;
        this.status = status;
    }
}
// 

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err => {
        console.log("OH NO, MONGO ERROR!")
        console.log(err)
    })





app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
const secret = process.env.SECRET || 'thisismysecretsadly'
const store = MongoStore.create({ mongoUrl: dbUrl, secret, touchAfter: 24 * 3600 })

store.on('error', function (e) {
    console.log('Session error!!')
})

const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())



app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    next()
})





app.use('/', userRoutes)
app.use('/', displayRoutes)


app.all('*', (req, res, next) => {
    next(new showError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong :(' } = err
    res.status(status).render('error', { err })

})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
