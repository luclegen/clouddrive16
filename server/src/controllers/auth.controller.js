const passport = require('passport')
const checker = require('../helpers/checker')
const User = require('../models/user.model')

module.exports.available = async (req, res, next) =>
  User.findOne({ email: req.params.email })
    .then(user => res.status(user ? 203 : 200).send({ available: Boolean(user) }))
    .catch(err => next(err))

module.exports.authenticate = (req, res) => passport.authenticate('local', (err, user, info) => err ? res.status(400).json(err) : user ? res.status(200).json({ token: user.getToken() }) : res.status(404).json(info))(req, res)
