const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const transfer = require('../helpers/transfer')
const filesController = require('../controllers/files.controller')

router.post('/', authorize, transfer.upload(process.env.FILES, 'files').array('files'), filesController.create)
router.get('/', authorize, filesController.read)

module.exports = router