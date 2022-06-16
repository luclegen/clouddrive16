const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const foldersController = require('../controllers/folders.controller')

router.post('/', authorize, foldersController.create)
router.get('/:id', authorize, foldersController.read)
router.put('/:id', authorize, foldersController.update)
router.patch('/:id', authorize, foldersController.delete)
router.patch('/r/:id', authorize, foldersController.restore)
router.patch('/m/:id', authorize, foldersController.move)
router.patch('/c/:id', authorize, foldersController.copy)
router.delete('/:id', authorize, foldersController.deleteForever)
router.get('/', authorize, foldersController.list)

module.exports = router