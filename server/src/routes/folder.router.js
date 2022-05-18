const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const folderController = require('../controllers/folder.controller')

router.post('/', authorize, folderController.create)
router.get('/:id', authorize, folderController.read)
router.put('/:id', authorize, folderController.update)
router.patch('/:id', authorize, folderController.delete)
router.patch('/r/:id', authorize, folderController.restore)
router.delete('/:id', authorize, folderController.deleteForever)

module.exports = router