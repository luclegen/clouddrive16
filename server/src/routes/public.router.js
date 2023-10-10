const router = require('express').Router()
const publicController = require('../controllers/public.controller')

router.get('/', publicController.list)

module.exports = router
