const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const codeController = require('../controllers/codes.controller')

router.post('/', authorize, codeController.create)

module.exports = router