const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const transfer = require('../helpers/transfer')
const filesCtl = require('../controllers/files.controller')

router.post('/', jwt.private, transfer.upload(process.env.FILES, 'files').array('files'), filesCtl.create)
router.get('/', jwt.private, filesCtl.read)

module.exports = router