const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const fileController = require('../controllers/file.controller')
const transfer = require('../helpers/transfer')

router.post('/', authorize, transfer.upload('uploads/files').single('file'), fileController.create)
router.get('/d/:id', fileController.download)
router.get('/:id', authorize, fileController.read)
router.put('/:id', authorize, fileController.update)
router.patch('/:id', authorize, fileController.delete)
router.patch('/r/:id', authorize, fileController.restore)
router.delete('/:id', authorize, fileController.deleteForever)

module.exports = router