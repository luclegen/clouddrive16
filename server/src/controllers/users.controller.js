const User = require('../models/user.model')
const Profile = require('../models/profile.model')
const _ = require('lodash')
const checker = require('../helpers/checker')

module.exports.create = (req, res, next) => {
  if (!checker.isDate(req.body.year, req.body.month, req.body.day))
    return res.status(403).send('Invalid date of birth.')

  const user = new User()
  const profile = new Profile()

  user.name.first = req.body.firstName
  user.name.last = req.body.lastName
  user.email = req.body.email
  user.password = req.body.password
  profile.name = req.body.firstName + ' ' + req.body.lastName
  profile.dob = new Date(req.body.year, req.body.month, req.body.day)
  profile.sex = req.body.sex

  user.save()
    .then(user => user
      ? new Promise(() => profile._uid = user) && profile.save()
        .then(profile => profile
          ? res.status(201).send('Registered successfully.')
          : res.status(404).send('Profile not found.'))
        .catch(err => user.remove() && next(err))
      : res.status(404).send('User not found.'))
    .catch(err => next(err))
}

module.exports.read = (req, res, next) =>
  User.findById(req.payload)
    .then(user =>
      Profile.findOne({ _uid: req.payload })
        .then(profile => user
          ? res.send({ ..._.pick(user, ['avatar', 'email', 'is_activate']), ..._.pick(profile, ['name', 'dob', 'sex']) })
          : res.status(404).json({ msg: 'User not found.' })))
    .catch(err => next(err))
