const router = require('express').Router()
const userCtl = require('../controllers/user.controller')

router.post('/', userCtl.create)

module.exports = router