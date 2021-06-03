const passport = require('passport')
const checker = require('../helpers/checker')
const User = require('../models/user.model')
const Code = require('../models/code.model')

module.exports.available = async (req, res, next) =>
  User.findOne({ email: req.params.email })
    .then(user => res.status(user ? 203 : 200).send({ available: Boolean(user) }))
    .catch(err => next(err))

module.exports.authenticate = (req, res) => passport.authenticate('local', (err, user, info) => err ? res.status(400).json(err) : user ? res.status(200).json({ token: user.getToken() }) : res.status(404).json(info))(req, res)

module.exports.verify = async (req, res, next) =>
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
                      .then(user => user ? res.status(202).send() : res.status(404).send({ msg: 'User not found.' }))
                      .catch(err => next(err))
                    : Code.findByIdAndUpdate(code._id, { $set: { times: --code.times } }, { new: true })
                      .then(code => res.status(403).send({ msg: code.times ? `Wrong code. You have ${code.times} attempts left.` : 'You tried too hard. Please try again with a different verification code or change your email again.' }))
                      .catch(err => next(err))
                  : res.status(403).send({ msg: 'You tried too hard. Please try again with a different verification code or change your email again.' })
                : res.status(404).send({ msg: 'Code not found.' })
            )
            .catch(err => next(err))
        : res.status(404).send({ msg: 'User not found.' })
    )
    .catch(err => next(err))
