const router = require('express').Router()

router
  .use('/auth', require('./auth.router'))
  .use('/users', require('./users.router'))
  .use('/codes', require('./codes.router'))
  .use('/folders', require('./folders.router'))
  .use('/files', require('./files.router'))
  .use('/media', require('./media.router'))

module.exports = router