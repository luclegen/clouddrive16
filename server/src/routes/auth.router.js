const router = require('express').Router()
const authorize = require('../middlewares/authorize')
const authController = require('../controllers/auth.controller')

router.post('/', authController.login)
router.get('/:email', authController.available)
router.put('/', authorize, authController.verify)
router.delete('/', authorize, authController.logout)

module.exports = router
