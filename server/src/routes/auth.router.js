const router = require('express').Router()
const authorize = require('../middlewares/authorization.middleware')
const authController = require('../controllers/auth.controller')

router
  .post('/', authController.login)
  .get('/:email', authController.available)
  .put('/', authorize, authController.verify)
  .patch('/', authorize, authController.changePassword)
  .delete('/', authorize, authController.logout)

module.exports = router
