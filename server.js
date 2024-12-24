const express = require('express')
const PORT  = 3000;
const app = express()
const path = require('path')
const helmet = require('helmet')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const session = require('express-session')
const {User} = require('./models')
require('dotenv').config()
const photoRoutes = require('./routers/photo-route');
const userRoutes = require('./routers/user-router');
const bcrypt = require('bcrypt')
const cors = require('cors');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
         sameSite: 'lax',
         httpOnly: true,
    },
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({where: {username}});
                if (!user) {
                    return done(null, false, {message: 'Uses not found'})
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user);
            } catch (err) {
                return done(err)
            }
        }
    ))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error)
    }
})

app.use(photoRoutes)
app.use('/auth', userRoutes)

app.get('/', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login');
  })

app.get('/register',  (req, res) => {
    res.render('register')
})


app.listen(PORT, () => {
    console.log(`Server is listening on web: http://localhost:3000`)
})

