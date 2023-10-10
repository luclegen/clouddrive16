const router = require('express').Router()
const privateController = require('../controllers/private.controller')

router.get('/', privateController.list)

module.exports = router
