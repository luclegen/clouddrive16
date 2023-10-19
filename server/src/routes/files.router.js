const router = require('express').Router()
const transfer = require('../middlewares/transfer.middleware.js')
const filesController = require('../controllers/files.controller')

router
  .post('/', transfer.upload('files').single('file'), filesController.create)
  .post('/p', filesController.createPlaintext)
  .get('/d/:id', filesController.download)
  .get('/:id', filesController.read)
  .put('/:id', filesController.update)
  .patch('/s/:id', filesController.savePlaintext)
  .patch('/:id', filesController.delete)
  .patch('/r/:id', filesController.restore)
  .patch('/m/:id', filesController.move)
  .patch('/c/:id', filesController.copy)
  .delete('/:id', filesController.deleteForever)
  .get('/', filesController.list)

module.exports = router
