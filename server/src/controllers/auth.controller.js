const passport = require('passport')
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

    if (user) {
      req.login(user, err => {
        if (err) next(err)

        req.session.cookie.expires = req.body.remember ? maxAge : false

        req.session.save(async err => {
          if (err) next(err)

          const session = await Session.findByIdAndUpdate(req.session.id, { _uid: user }, { new: true })

          if (session) {
            res
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
    } else next(info)
  })(req, res)
})

module.exports.available = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email })

  if (!checker.isEmail()) {
    return next(createError(400, 'Invalid email.'))
  }

  res.status(user ? 203 : 200).json(!user)
})

module.exports.verify = (req, res, next) => User.findById(req.payload)
  .then(user => user
    ? user.is_activate
      ? res.status(403).json('User verified.')
      : Code.findOne({ _uid: req.payload })
        .then(async code => code
          ? code.attempts
            ? await code.verify(req.body.code)
              ? User.findByIdAndUpdate(req.payload, { $set: { is_activate: true } }, { new: true })
                .then(user => user
                  ? code.remove()
                    .then(() => (req.session.token = user.sign()) &&
                      res.cookie('is_activate', true, { expires: req.session?.cookie?.expires }).json())
                    .catch(err => next(err))
                  : res.status(404).json('User not found.'))
                .catch(err => next(err))
              : Code.findByIdAndUpdate(code, { $set: { attempts: --code.attempts } }, { new: true })
                .then(code => res.status(code.attempts ? 400 : 429).json(code.attempts ? `Wrong code. You have ${code.attempts} attempts left.` : 'You tried too many. Please try again with a different verification code or change your email again.'))
                .catch(err => next(err))
            : res.status(429).json('You tried too many. Please try again with a different verification code or change your email again.')
          : res.status(404).json('Code not found. Please click to "Send Code".'))
        .catch(err => next(err))
    : res.status(404).json('User not found.')
  )
  .catch(err => next(err))

module.exports.logout = (req, res) =>
  res
    .clearCookie('avatar')
    .clearCookie('first_name')
    .clearCookie('id')
    .clearCookie('lang')
    .clearCookie('last_name')
    .clearCookie('middle_name')
    .clearCookie('session')
    .clearCookie('username')
    .json()
