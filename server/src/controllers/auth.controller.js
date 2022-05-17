const passport = require('passport')
const User = require('../models/user.model')
const Code = require('../models/code.model')

module.exports.available = (req, res, next) =>
  User.findOne({ email: req.params.email })
    .then(user => res.status(user ? 203 : 200).send(!user))
    .catch(err => next(err))

module.exports.login = (req, res, next) =>
  passport.authenticate('local', (err, user, info) => err
    ? next(err)
    : user
      ? (req.session.cookie.expires = req.body.remember ? 365 * 24 * 60 * 60 * 1000 : false)
      + (req.session.token = user.sign())
      && res.send({
        id: user._id,
        avatar: user.avatar,
        firstName: user.name.first,
        lastName: user.name.last,
        is_activate: user.is_activate,
      })
      : res.status(401).send(info)
  )(req, res)

module.exports.verify = (req, res, next) =>
  User.findById(req._id)
    .then(user =>
      user
        ? user.activated
          ? res.status(403).send({ msg: 'User verified.' })
          : Code.findOne({ _userId: req._id })
            .then(code =>
              code
                ? code.times
                  ? code.verified(req.body.content)
                    ? User.findByIdAndUpdate(req._id, { $set: { activated: true } }, { new: true })
                      .then(user => user ? res.status(202).send({ token: user.getToken() }) : res.status(404).send({ msg: 'User not found.' }))
                      .catch(err => next(err))
                    : Code.findByIdAndUpdate(code._id, { $set: { times: --code.times } }, { new: true })
                      .then(code => res.status(403).send({ msg: code.times ? `Wrong code. You have ${code.times} attempts left.` : 'You tried too many. Please try again with a different verification code or change your email again.' }))
                      .catch(err => next(err))
                  : res.status(403).send({ msg: 'You tried too many. Please try again with a different verification code or change your email again.' })
                : res.status(404).send({ msg: 'Code not found.' })
            )
            .catch(err => next(err))
        : res.status(404).send({ msg: 'User not found.' })
    )
    .catch(err => next(err))

module.exports.logout = (req, res, next) =>
  res
    .clearCookie('connect.sid')
    .clearCookie('id')
    .clearCookie('avatar')
    .clearCookie('firstName')
    .clearCookie('lastName')
    .clearCookie('is_activate')
    .send()
