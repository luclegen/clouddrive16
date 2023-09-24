const router = require('express').Router()
const authorize = require('../middlewares/authorization.middleware');
const codeController = require('../controllers/codes.controller')

router.post('/', authorize, codeController.create)

module.exports = router