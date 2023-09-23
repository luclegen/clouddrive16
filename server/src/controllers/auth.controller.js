const passport = require('passport')
const User = require('../models/user.model')
const Code = require('../models/code.model')

module.exports.available = (req, res, next) =>
  User.findOne({ email: req.params.email })
    .then(user => res.status(user ? 203 : 200).json(!user))
    .catch(err => next(err))

module.exports.login = (req, res, next) =>
  passport.authenticate('local', (err, user, info) => err
    ? next(err)
    : user
      ? (req.session.cookie.expires = req.body.remember ? 365 * 24 * 60 * 60 * 1000 : false)
      + (req.session.token = user.sign())
      && res.json({
        id: user._id,
        avatar: user.avatar,
        first_name: user.name.first,
        last_name: user.name.last,
        is_activate: user.is_activate,
      })
      : res.status(401).json(info)
  )(req, res)

module.exports.verify = (req, res, next) => User.findById(req.payload)
  .then(user => user
    ? user.is_activate
      ? res.status(403).json('User verified.')
      : Code.findOne({ _uid: req.payload })
        .then(async code => code
          ? code.attempts
            ? await code.verify(req.body.code)
              ? User.findByIdAndUpdate(req.payload, { $set: { is_activate: true } }, { new: true })
                .then(user => user
                  ? code.remove()
                    .then(() => (req.session.token = user.sign())
                      && res.cookie('is_activate', true, { expires: req.session?.cookie?.expires }).json())
                    .catch(err => next(err))
                  : res.status(404).json('User not found.'))
                .catch(err => next(err))
              : Code.findByIdAndUpdate(code, { $set: { attempts: --code.attempts } }, { new: true })
                .then(code => res.status(code.attempts ? 400 : 429).json(code.attempts ? `Wrong code. You have ${code.attempts} attempts left.` : 'You tried too many. Please try again with a different verification code or change your email again.'))
                .catch(err => next(err))
            : res.status(429).json('You tried too many. Please try again with a different verification code or change your email again.')
          : res.status(404).json('Code not found. Please click to \"Send Code\".'))
        .catch(err => next(err))
    : res.status(404).json('User not found.')
  )
  .catch(err => next(err))

module.exports.logout = (req, res) =>
  res
    .clearCookie('connect.sid')
    .clearCookie('id')
    .clearCookie('avatar')
    .clearCookie('first_name')
    .clearCookie('last_name')
    .clearCookie('is_activate')
    .json()
