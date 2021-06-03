const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const authCtl = require('../controllers/auth.controller')

router.get('/:email', authCtl.available)
router.post('/', authCtl.authenticate)
router.put('/', jwt.private, authCtl.verify)

module.exports = router