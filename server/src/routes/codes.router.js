const router = require('express').Router()
const codeController = require('../controllers/codes.controller')

router.post('/', codeController.create)

module.exports = router
