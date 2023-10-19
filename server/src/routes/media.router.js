const router = require('express').Router()
const mediaController = require('../controllers/media.controller')

router.get('/', mediaController.read)

module.exports = router
