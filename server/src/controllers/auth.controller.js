const checker = require('../helpers/checker')
const User = require('../models/user.model')

module.exports.checkEmail = async (req, res, next) =>
  User.findOne({ email: req.body.email })
    .then(user => res.status(user ? 203 : 200).send({ available: !Boolean(user) }))
    .catch(err => console.warn(err))

module.exports.register = (req, res, next) => {
  if (!checker.isDate(req.body.year, req.body.month, req.body.day)) return res.status(403).send({ msg: 'Invalid date of birth.' })

  const user = new User()

  user.name.first = req.body.firstName
  user.name.last = req.body.lastName
  user.email = req.body.email
  user.password = req.body.password
  user.dateOfBirth = new Date(req.body.year, req.body.month, req.body.day)
  user.sex = req.body.sex

  user.save()
    .then(() => res.status(200).send({ msg: 'Registered successfully.' }))
    .catch(e => e.code === 11000 ? res.status(422).send({ msg: 'Email is duplicate. Please try again.' }) : next(e))
}
