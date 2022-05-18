const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const foldersController = require('../controllers/folders.controller')

router.get('/', authorize, foldersController.read)

module.exports = router