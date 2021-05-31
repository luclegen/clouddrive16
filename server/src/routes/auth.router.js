const router = require('express').Router()
const authCtl = require('../controllers/auth.controller')

router.post('/check-email', authCtl.checkEmail)
router.post('/authenticate', authCtl.authenticate)

module.exports = router