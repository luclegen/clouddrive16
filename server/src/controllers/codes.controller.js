const { ForbiddenError } = require('@casl/ability')
const nodemailer = require('nodemailer')
const createError = require('http-errors')
const User = require('../models/user.model')
const Code = require('../models/code.model')
const generator = require('../helpers/generator')
const mailer = require('../helpers/mailer')
const catchAsync = require('../middlewares/catcher.middleware')

module.exports.create = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user).accessibleBy(req.ability)

  if (user) {
    let code = await Code.findOne({ _uid: user })
    const body = generator.genCode(6)

    if (!code) {
      code = new Code()
      code._uid = user
    }

    code.body = body
    code.attempts = 3

    code = await code.save()

    ForbiddenError.from(req.ability).throwUnlessCan('create', code)

    res.status(201).send(req.app.get('env') === 'production' ? nodemailer.getTestMessageUrl(await mailer.sendCode(req.user.email, 'Verify Code', body)) : body)
  } else next(createError(404, 'User not found.'))
})
