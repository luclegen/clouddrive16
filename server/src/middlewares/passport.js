const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
}, (email, password, done) => User.findOne({ email: email })
  .then(user =>
    user
      ? user.verified(password)
        ? done(null, user)
        : done(null, false, { msg: 'Wrong password. Please try again or click "Forgotten password?"' })
      : done(null, false, { msg: 'Username not registered.' }))
  .catch(err => done(err, false, { msg: 'Username not registered.' }))
))