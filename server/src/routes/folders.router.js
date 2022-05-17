const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const foldersCtl = require('../controllers/folders.controller')

router.get('/', authorize, foldersCtl.read)

module.exports = router