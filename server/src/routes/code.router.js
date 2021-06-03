const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const codeCtl = require('../controllers/code.controller')

router.post('/', jwt.private, codeCtl.create)

module.exports = router