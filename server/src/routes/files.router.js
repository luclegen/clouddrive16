const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const transfer = require('../helpers/transfer')
const filesController = require('../controllers/files.controller')

router.post('/', authorize, transfer.upload('files').array('files'), filesController.create)
router.post('/p', authorize, filesController.createPlaintext)
router.get('/d/:id', authorize, filesController.download)
router.get('/:id', authorize, filesController.read)
router.put('/:id', authorize, filesController.update)
router.patch('/:id', authorize, filesController.delete)
router.patch('/r/:id', authorize, filesController.restore)
router.patch('/m/:id', authorize, filesController.move)
router.patch('/c/:id', authorize, filesController.copy)
router.delete('/:id', authorize, filesController.deleteForever)
router.get('/', authorize, filesController.list)

module.exports = router