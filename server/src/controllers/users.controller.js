const { ForbiddenError } = require('@casl/ability')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const createError = require('http-errors')
const Session = require('../models/session.model')
const User = require('../models/user.model')
const Profile = require('../models/profile.model')
const Lang = require('../models/lang.enum')
const catchAsync = require('../middlewares/catcher.middleware')
const checker = require('../helpers/checker')
const maxAge = 30 * 24 * 60 * 60 * 1000

module.exports.create = catchAsync(async (req, res, next) => {
  req.i18n.changeLanguage(req.body.lang)

  if (!checker.isDate(req.body.year, req.body.month, req.body.day)) return next(createError(403, 'Invalid birthday.'))
  if (!checker.isStrongPassword(req.body.password)) return next(createError(400, 'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).'))

  let user = new User()
  let profile = new Profile()

  user.name.first = req.body.first_name
  user.name.last = req.body.last_name
  user.email = req.body.email
  user.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  user.roles = ['User']
  user.lang = req.body.lang
  profile.full_name = user.lang === Lang.VI ? req.body.last_name + ' ' + req.body.first_name : req.body.first_name + ' ' + req.body.last_name
  profile.birthday = new Date(req.body.year, req.body.month, req.body.day)
  profile.sex = req.body.sex

  user = await user.save()

  if (!user) return next(createError(404, 'User not found.'))

  profile._uid = user
  // profile = await profile.save()

  profile
    .save()
    .then(profile => {
      if (!profile) {
        user.remove()

        return next(createError(404, 'Profile not found.'))
      }

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
              .status(201)
              .json(req.t('Registered successfully.'))
          }
        })
      })
    })
    .catch(err => {
      user.remove()
      next(err)
    })
})

module.exports.read = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ _uid: req.user }).accessibleBy(req.ability)

  if (!profile) return next(createError(404, 'Profile not found.'))

  res.json({ ..._.pick(req.user, ['avatar', 'name.first', 'name.middle', 'name.last', 'lang', 'email']), ..._.pick(profile, ['full_name', 'birthday', 'sex']) })
})

module.exports.update = catchAsync(async (req, res, next) => {
  req.i18n.changeLanguage(req.body.lang)

  if (!checker.isDate(req.body.year, req.body.month, req.body.day)) return next(createError(403, 'Invalid birthday.'))

  if (req.file && req.user.avatar) fs.rmSync(`${process.env.UPLOADS}public${req.user.avatar}`)

  let profile = await Profile.findOne({ _uid: req.user }).accessibleBy(req.ability)

  if (req.file) req.user.avatar = `/${req.payload._id}/${req.file.filename}`
  req.user.name.first = req.body.first_name
  req.user.name.middle = req.body.middle_name
  req.user.name.last = req.body.last_name
  req.user.lang = req.body.lang
  profile.full_name = req.body.full_name
  profile.birthday = new Date(req.body.year, req.body.month, req.body.day)
  profile.sex = req.body.sex

  ForbiddenError.from(req.ability).throwUnlessCan('update', req.user)

  req.user = await req.user.save()
  if (!req.user) return next(createError(404, 'User not found.'))

  profile._uid = req.user

  ForbiddenError.from(req.ability).throwUnlessCan('update', profile)

  profile = await profile.save()

  if (!profile) return next(createError(404, 'Profile not found.'))

  res
    .cookie('lang', req.user.lang, { expires: req.session.cookie.expires })
    .json(req.t('Updated successfully.'))
})

module.exports.changeLang = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user).accessibleBy(req.ability)

  user.lang = req.body

  ForbiddenError.from(req.ability).throwUnlessCan('changeLang', user)

  user = await user.save()

  if (!user) return next(createError(404, 'User not found.'))

  res
    .cookie('lang', user.lang, { expires: req.session.cookie.expires })
    .json(req.t('Change language successfully.'))
})
