const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const filesCtl = require('../controllers/files.controller')

router.get('/', jwt.private, filesCtl.read)

module.exports = router