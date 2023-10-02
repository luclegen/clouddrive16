const router = require('express').Router()
const authorize = require('../middlewares/authorization.middleware')
const transfer = require('../middlewares/transfer.middleware')
const userController = require('../controllers/users.controller')

router
  .post('/', userController.create)
  .get('/', authorize, userController.read)
  .put('/', authorize, transfer.upload().single('avatar'), userController.update)
  .patch('/', authorize, userController.changeLang)

module.exports = router
