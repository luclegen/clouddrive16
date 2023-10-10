const router = require('express').Router()
const authorize = require('../middlewares/authorization.middleware')

router
  .use('/auth', require('./auth.router'))
  .use('/users', require('./users.router'))
  .use('/codes', authorize, require('./codes.router'))
  .use('/folders', authorize, require('./folders.router'))
  .use('/files', authorize, require('./files.router'))
  .use('/private', authorize, require('./private.router'))
  .use('/public', require('./public.router'))

module.exports = router
