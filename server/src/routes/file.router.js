const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const fileCtl = require('../controllers/file.controller')
const transfer = require('../helpers/transfer')

router.post('/', jwt.private, transfer.upload('uploads/files').single('file'), fileCtl.create)
router.get('/d/:id', fileCtl.download)
router.get('/:id', jwt.private, fileCtl.read)
router.put('/:id', jwt.private, fileCtl.update)
router.patch('/:id', jwt.private, fileCtl.delete)
router.patch('/r/:id', jwt.private, fileCtl.restore)
router.delete('/:id', jwt.private, fileCtl.deleteForever)

module.exports = router