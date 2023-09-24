const i18next = require('i18next')
const middleware = require('i18next-http-middleware')
const Lang = require('../models/lang.enum')

i18next.use(require('i18next-fs-backend')).use(middleware.LanguageDetector).init({
  preload: Object.values(Lang),
  fallbackLng: Lang.EN,
  backend: { loadPath: './src/locales/{{lng}}.json' }
})

module.exports = middleware.handle(i18next, { ignoreRoutes: [] })
