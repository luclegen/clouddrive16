const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const foldersCtl = require('../controllers/folders.controller')

router.get('/', jwt.private, foldersCtl.read)

module.exports = router