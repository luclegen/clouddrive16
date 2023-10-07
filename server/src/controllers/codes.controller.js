const { ForbiddenError } = require('@casl/ability')
const nodemailer = require('nodemailer')
const Code = require('../models/code.model')
const generator = require('../helpers/generator')
const mailer = require('../helpers/mailer')
const catchAsync = require('../middlewares/catcher.middleware')

module.exports.create = catchAsync(async (req, res, next) => {
  let code = await Code.findOne({ _uid: req.user })
  const body = generator.genCode(6)

  if (!code) {
    code = new Code()
    code._uid = req.user
  }

  code.body = body
  code.attempts = 3

  ForbiddenError.from(req.ability).throwUnlessCan('create', code)

  code = await code.save()

  res.status(201).send(req.app.get('env') === 'production' ? nodemailer.getTestMessageUrl(await mailer.sendCode(req.user.email, 'Verify Code', body)) : body)
})
