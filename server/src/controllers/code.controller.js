const User = require('../models/user.model')
const Code = require('../models/code.model')
const _ = require('lodash')
const generator = require('../helpers/generator')
const mailer = require('../helpers/mailer')
const cleaner = require('../helpers/cleaner')

module.exports.create = (req, res, next) => {
  const code = new Code()
  const newCode = generator.genCode(6)

  code._userId = req._id
  code.content = newCode

  cleaner.deleteCode(req._id)

  code.save()
    .then(() => {
      User.findById(req._id)
        .then(user => {
          mailer.sendCode(user.email, 'Verify Email', newCode)
          return res.status(201).send({ msg: 'Resent code.' })
        })
        .catch(err => next(err))
    })
    .catch(e => next(e))
}
