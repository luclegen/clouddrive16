const User = require('../models/user.model')
const _ = require('lodash')
const checker = require('../helpers/checker')

module.exports.create = (req, res, next) => {
  if (!checker.isDate(req.body.year, req.body.month, req.body.day)) return res.status(403).send({ msg: 'Invalid date of birth.' })

  const user = new User()

  user.name.first = req.body.firstName
  user.name.last = req.body.lastName
  user.email = req.body.email
  user.password = req.body.password
  user.dateOfBirth = new Date(req.body.year, req.body.month, req.body.day)
  user.sex = req.body.sex

  user.save()
    .then(user => {
      res.status(201).send({ msg: 'Registered successfully.' })
      setTimeout(() =>
        User.findById(user._id)
          .then(user => {
            if (!user.activated) User.findByIdAndDelete(user._id)
              .catch(err => next(err))
          })
          .catch(err => next(err))
        , 30 * 24 * 60 * 60 * 1000)
    })
    .catch(err => err.code === 11000 ? res.status(422).send({ msg: 'Email is duplicate. Please try again.' }) : next(err))
}

module.exports.read = async (req, res, next) =>
  User.findById(req._id)
    .then(user => user ? res.status(202).json({ user: _.pick(user, ['avatar', 'name', 'fullName', 'email', 'dateOfBirth', 'sex', 'role']) }) : res.status(404).json({ msg: 'User not found.' }))
    .catch(err => next(err))
