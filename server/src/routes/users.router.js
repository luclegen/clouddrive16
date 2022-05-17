const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const userCtl = require('../controllers/users.controller')

router.post('/', userCtl.create)
router.get('/', authorize, userCtl.read)

module.exports = router