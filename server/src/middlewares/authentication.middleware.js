const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')
const createError = require('http-errors')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
}, (email, password, done) => User.findOne({ email })
  .then(async user => user
    ? await user.authenticate(password)
      ? done(null, user)
      : done(null, false, createError(401, 'Wrong password.'))
    : done(null, false, createError(404, 'Username not registered.')))
  .catch(err => done(err, false))
))

passport.serializeUser((user, done) =>
  process.nextTick(() => done(null, user.sign())))

passport.deserializeUser((user, done) =>
  process.nextTick(() => done(null, user)))

module.exports = passport.authenticate('session')
