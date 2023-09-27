const { AbilityBuilder, createMongoAbility } = require('@casl/ability')
const jwt = require('jsonwebtoken')
const util = require('util')
const catchAsync = require('../middlewares/catcher.middleware')
const User = require('../models/user.model')
const roles = require('../models/roles.json')

const defineAbilitiesFor = user => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  for (const role of user.roles) {
    const permissions = roles[role]
    for (const p of permissions) {
      if (p?.fields) { p.fields = Object.fromEntries(Object.entries(p?.fields).map((v, i) => [v[0], v[1] === 'mine' ? user._id : v[1]])) }
      if (p.can) can(p.action, p.subject, p.fields)
      else cannot(p.action, p.subject, p.fields)
    }
  }

  return build()
}

module.exports = catchAsync(async (req, res, next) => {
  req.i18n.changeLanguage(req.cookies?.lang)

  if (req.session?.passport?.user) {
    req.payload = await util.promisify(jwt.verify)(req.session?.passport?.user, process.env.SECRET)
    req.user = await User.findById(req.payload)
    req.ability = defineAbilitiesFor(req.user || null)
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
      .json(req.t('Unauthorized.'))
  }
})
