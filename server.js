require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const { User } = require('./models');
const photoRoutes = require('./routers/photo-route');
const userRoutes = require('./routers/user-router');
const captionRoutes = require('./routers/caption-route');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { defaults } = require('pg');
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
    },
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://photo-caption-contest-mnpm.onrender.com/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const [user] = await User.findOrCreate({
          where: { githubId: profile.id },
          defaults: {
            username: profile.username,
            githubId: profile.id,
          },
        });

        done(null, user);
      } catch (error) {
        console.error('Error during GitHub authentication:', error); // Додано лог для помилок
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        const [user] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            username: profile.displayName,
            googleId: profile.id,
            email: email,
          },
        });

        done(null, user);
      } catch (error) {
        console.error('Error during Google authentication:', error); // Додано лог для помилок
        done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/facebook/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      const [user] = await User.findOrCreate({
        where : { facebookId: profile.id },
        defaults  : {
          username: profile.displayName,
          facebookId: profile.id,
          email: email,
        },
      });
    } catch (error) {
      console.error('Error during Facebook authentication:', error);
      done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Роути для аутентифікації
app.get('/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/auth/main' }),
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/auth/main' }),
);


app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/auth/main' }),
);

// Використання маршрутизаторів
app.use('/auth', userRoutes);
app.use('/auth', photoRoutes);
app.use('/auth', captionRoutes);

app.get('/', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
