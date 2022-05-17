const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const transfer = require('../helpers/transfer')
const filesCtl = require('../controllers/files.controller')

router.post('/', authorize, transfer.upload(process.env.FILES, 'files').array('files'), filesCtl.create)
router.get('/', authorize, filesCtl.read)

module.exports = router