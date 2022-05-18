const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const userController = require('../controllers/users.controller')

router.post('/', userController.create)
router.get('/', authorize, userController.read)

module.exports = router