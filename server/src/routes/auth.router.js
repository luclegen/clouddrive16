const router = require('express').Router()
const authCtl = require('../controllers/auth.controller')

router.get('/:email', authCtl.checkEmail)
router.post('/', authCtl.authenticate)

module.exports = router