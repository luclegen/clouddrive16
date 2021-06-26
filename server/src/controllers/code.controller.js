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
    .then(code =>
      User.findById(req._id)
        .then(user => {
          mailer.sendCode(user.email, 'Verify Email', newCode)
          user
            ? code
              ? res.status(201).send({ msg: 'Resent code.' })
              : res.status(201).send({ msg: 'Code not found.' })
            : res.status(201).send({ msg: 'User not found.' })
        })
        .catch(err => next(err))
    )
    .catch(err => next(err))
}
