const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const foldersController = require('../controllers/folders.controller')

router.post('/', authorize, foldersController.create)
router.get('/:id', authorize, foldersController.read)
router.put('/:id', authorize, foldersController.update)
router.get('/', authorize, foldersController.list)

module.exports = router