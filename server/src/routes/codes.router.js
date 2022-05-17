const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const codeCtl = require('../controllers/codes.controller')

router.post('/', authorize, codeCtl.create)

module.exports = router