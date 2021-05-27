const router = require('express').Router()
const authCtl = require('../controllers/auth.controller')

router.post('/register', authCtl.register)

module.exports = router