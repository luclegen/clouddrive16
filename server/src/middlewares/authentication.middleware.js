const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
}, (email, password, done) => User.findOne({ email })
  .then(async user => user
    ? await user.authenticate(password)
      ? done(null, user)
      : done(null, false, 'Wrong password.')
    : done(null, false, 'Username not registered.'))
  .catch(err => done(err, false, 'Error'))
))

passport.serializeUser((user, done) =>
  process.nextTick(() => done(null, user.sign())))

passport.deserializeUser((user, done) =>
  process.nextTick(() => done(null, user)))

module.exports = passport.authenticate('session')
