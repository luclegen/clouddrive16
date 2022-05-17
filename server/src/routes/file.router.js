const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const fileCtl = require('../controllers/file.controller')
const transfer = require('../helpers/transfer')

router.post('/', authorize, transfer.upload('uploads/files').single('file'), fileCtl.create)
router.get('/d/:id', fileCtl.download)
router.get('/:id', authorize, fileCtl.read)
router.put('/:id', authorize, fileCtl.update)
router.patch('/:id', authorize, fileCtl.delete)
router.patch('/r/:id', authorize, fileCtl.restore)
router.delete('/:id', authorize, fileCtl.deleteForever)

module.exports = router