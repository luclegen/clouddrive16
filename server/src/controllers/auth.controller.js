const checker = require('../helpers/checker')
const User = require('../models/user.model')

module.exports.register = async (req, res, next) => {
  if (!checker.isDate(req.body.year, req.body.month, req.body.day)) return res.status(403).send({ msg: 'Invalid date of birth.' })

  const user = new User()

  user.name.first = req.body.firstName
  user.name.last = req.body.lastName
  user.email = req.body.email
  user.password = req.body.password
  user.dateOfBirth = new Date(req.body.year, req.body.month, req.body.day)
  user.gender = req.body.gender

  user.save()
    .then(() => res.status(200).send({ msg: 'Registered successfully.' }))
    .catch(e => e.code === 11000 ? res.status(422).send({ msg: 'Email is duplicate. Please try again.' }) : next(e))
}
