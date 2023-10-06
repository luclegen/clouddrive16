const { ForbiddenError } = require('@casl/ability')
const fs = require('fs')
const util = require('util')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const createError = require('http-errors')
const User = require('../models/user.model')
const Profile = require('../models/profile.model')
const catchAsync = require('../middlewares/catcher.middleware')
const checker = require('../helpers/checker')

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
  profile.full_name = req.body.first_name + ' ' + req.body.last_name
  profile.birthday = new Date(req.body.year, req.body.month, req.body.day)
  profile.sex = req.body.sex

  user = await user.save()

  if (!user) return next(createError(404, 'User not found.'))

  profile._uid = user
  profile = await profile.save()

  if (!profile) {
    user.remove()

    return next(createError(404, 'Profile not found.'))
  }

  res.status(201).json(req.t('Registered successfully.'))
})

module.exports.read = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ _uid: req.user }).accessibleBy(req.ability)

  if (!profile) return next(createError(404, 'Profile not found.'))

  res.json({ ..._.pick(req.user, ['avatar', 'name.first', 'name.middle', 'name.last', 'lang', 'email']), ..._.pick(profile, ['full_name', 'birthday', 'sex']) })
})

module.exports.update = catchAsync(async (req, res, next) => {
  req.i18n.changeLanguage(req.body.lang)

  if (!checker.isDate(req.body.year, req.body.month, req.body.day)) {
    return next(createError(403, 'Invalid birthday.'))
  }

  if (req.file && req.user.avatar) await util.promisify(fs.rm)(`${process.env.UPLOADS}public${req.user.avatar}`)

  let profile = await Profile.findOne({ _uid: req.user }).accessibleBy(req.ability)

  if (req.file) req.user.avatar = `/${req.payload._id}/${req.file.filename}`
  req.user.name.first = req.body.first_name
  req.user.name.middle = req.body.middle_name
  req.user.name.last = req.body.last_name
  req.user.lang = req.body.lang
  profile.full_name = req.body.full_name
  profile.birthday = new Date(req.body.year, req.body.month, req.body.day)
  profile.sex = req.body.sex

  req.user = await req.user.save()
  if (req.user) {
    profile._uid = req.user

    profile = await profile.save()

    if (profile) {
      ForbiddenError.from(req.ability).throwUnlessCan('update', profile)

      res
        .cookie('lang', req.user.lang, { expires: req.session.cookie.expires })
        .json(req.t('Updated successfully.'))
    } else {
      next(createError(404, 'Profile not found.'))
    }
  } else {
    next(createError(404, 'User not found.'))
  }
})

module.exports.changeLang = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user).accessibleBy(req.ability)

  user.lang = req.body

  user = await user.save()

  ForbiddenError.from(req.ability).throwUnlessCan('changeLang', user)

  if (user) {
    res
      .cookie('lang', user.lang, { expires: req.session.cookie.expires })
      .json(req.t('Change language successfully.'))
  } else next(createError(404, 'User not found.'))
})
