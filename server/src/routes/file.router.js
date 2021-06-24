const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const fileCtl = require('../controllers/file.controller')
const transfer = require('../helpers/transfer')

router.post('/', jwt.private, transfer.upload('uploads/files').single('file'), fileCtl.create)

module.exports = router