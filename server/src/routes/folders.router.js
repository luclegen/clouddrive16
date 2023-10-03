const router = require('express').Router()
const foldersController = require('../controllers/folders.controller')

router
  .post('/', foldersController.create)
  .get('/:id', foldersController.read)
  .put('/:id', foldersController.update)
  .patch('/:id', foldersController.delete)
  .patch('/r/:id', foldersController.restore)
  .patch('/m/:id', foldersController.move)
  .patch('/c/:id', foldersController.copy)
  .delete('/:id', foldersController.deleteForever)
  .get('/', foldersController.list)

module.exports = router
