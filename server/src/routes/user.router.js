const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const userCtl = require('../controllers/user.controller')

router.post('/', userCtl.create)
router.get('/', jwt.private, userCtl.read)

module.exports = router