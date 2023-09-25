// const { AbilityBuilder, createMongoAbility, ForbiddenError } = require('@casl/ability')
const jwt = require('jsonwebtoken')
const catchAsync = require('../middlewares/catcher.middleware')
const util = require('util')

module.exports = catchAsync(async (req, res, next) => {
  req.i18n.changeLanguage(req.cookies?.lang)

  if (req.session?.passport?.user) {
    req.payload = await util.promisify(jwt.verify)(req.session?.passport?.user, process.env.SECRET)
  	next()
  } else {
    res
      .clearCookie('lang')
      .clearCookie('id')
      .clearCookie('avatar')
      .clearCookie('username')
      .clearCookie('first_name')
      .clearCookie('middle_name')
      .clearCookie('last_name')
      .status(401)
      .json(req.t('Unauthorized'))
  }
})
