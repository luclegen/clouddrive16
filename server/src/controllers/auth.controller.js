const { ForbiddenError } = require('@casl/ability')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const Session = require('../models/session.model')
const Code = require('../models/code.model')
const checker = require('../helpers/checker')
const catchAsync = require('../middlewares/catcher.middleware')
const createError = require('http-errors')
const maxAge = 30 * 24 * 60 * 60 * 1000

module.exports.login = catchAsync(async (req, res, next) => {
  req.i18n.changeLanguage(req.body.language)

  if (!checker.isEmail(req.body.email)) return next(createError(400, 'Invalid email.'))

  passport.authenticate('local', (err, user, info) => {
    if (err) next(err)

    if (!user) return next(info)

    req.login(user, err => {
      if (err) return next(err)

      req.session.cookie.expires = req.body.remember ? maxAge : false

      req.session.save(async err => {
        if (err) next(err)

        const session = await Session.findByIdAndUpdate(req.session.id, { _uid: user }, { new: true })

        if (session) {
          res
            .cookie('is_activate', user.is_activate.toString() || '', { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('lang', user.lang, { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('id', user._id.toString(), { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('avatar', user.avatar || '', { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('username', user.username || '', { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('first_name', user.name.first, { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('middle_name', user.name.middle || '', { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .cookie('last_name', user.name.last, { [req.body.remember ? 'maxAge' : 'expires']: req.body.remember ? maxAge : false })
            .json()
        }
      })
    })
  })(req, res)
})

module.exports.available = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email })

  if (!checker.isEmail()) {
    return next(createError(400, 'Invalid email.'))
  }

  res.status(user ? 203 : 200).json(!user)
})

module.exports.verify = catchAsync(async (req, res, next) => {
  if (req.user?.is_activate) next(createError(403, 'User verified.'))
  else {
    let code = await Code.findOne({ _uid: req.user }).accessibleBy(req.ability)

    if (code) {
      ForbiddenError.from(req.ability).throwUnlessCan('verify', code)

      if (code.attempts) {
        if (await code.verify(req.body)) {
          const user = await User.findByIdAndUpdate(req.user, { $set: { is_activate: true } }, { new: true }).accessibleBy(req.ability)

          if (user) {
            code.remove()
            req.session.token = user.sign()
            res.cookie('is_activate', user.is_activate.toString(), { expires: req.session?.cookie?.expires }).json()
          }
        } else {
          code = await Code.findByIdAndUpdate(code, { $set: { attempts: --code.attempts } }, { new: true }).accessibleBy(req.ability)

          if (code) next(createError(code?.attempts ? 403 : 429, code.attempts ? `Wrong code. You have ${code.attempts} attempts left.` : 'You tried too many. Please try again with a different verification code or change your email again.'))
          else next(createError(404, 'Code not found.'))
        }
      } else next(createError(429, 'You tried too many. Please try again with a different verification code or change your email again.'))
    } else next(createError(404, 'Code not found. Please click to "Send Code".'))
  }
})

module.exports.changePassword = catchAsync(async (req, res, next) => {
  if (!checker.isStrongPassword(req.body.new_password)) return next(createError(400, 'Please choose a new stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).'))

  if (!req.user?.authenticate(req.body.password)) return next(createError(401, 'Wrong password.'))

  ForbiddenError.from(req.ability).throwUnlessCan('changePassword', req.user)

  req.user.password = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10))
  req.user = await req.user.save()

  if (!req.user) return next(createError(404, 'User not found.'))

  res.json(req.t('Change password successfully.'))
})

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    req.session.destroy(err => {
      if (err) return next(err)
      res
        .clearCookie('session')
        .clearCookie('is_activate')
        .clearCookie('lang')
        .clearCookie('id')
        .clearCookie('avatar')
        .clearCookie('username')
        .clearCookie('first_name')
        .clearCookie('middle_name')
        .clearCookie('last_name')
        .json()
    })
  })
}
