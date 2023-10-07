const router = require('express').Router()
const transfer = require('../helpers/transfer')
const filesController = require('../controllers/files.controller')

router
  .post('/', transfer.upload('files').array('files'), filesController.create)
  .post('/p', filesController.createPlaintext)
  .get('/d/:id', filesController.download)
  .get('/:id', filesController.read)
  .put('/:id', filesController.update)
  .patch('/:id', filesController.delete)
  .patch('/r/:id', filesController.restore)
  .patch('/m/:id', filesController.move)
  .patch('/c/:id', filesController.copy)
  .delete('/:id', filesController.deleteForever)
  .get('/', filesController.list)

module.exports = router
