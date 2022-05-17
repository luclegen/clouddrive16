const router = require('express').Router()
const authorize = require('../middlewares/authorize')
const authCtl = require('../controllers/auth.controller')

router.get('/:email', authCtl.available)
router.post('/', authCtl.login)
router.put('/', authorize, authCtl.verify)

module.exports = router