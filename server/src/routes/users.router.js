const router = require('express').Router()
const authorize = require('../middlewares/authorization.middleware')
const userController = require('../controllers/users.controller')

router.post('/', userController.create)
router.get('/', authorize, userController.read)
router.patch('/', authorize, userController.changeLang)

module.exports = router
