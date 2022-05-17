const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const folderCtl = require('../controllers/folder.controller')

router.post('/', authorize, folderCtl.create)
router.get('/:id', authorize, folderCtl.read)
router.put('/:id', authorize, folderCtl.update)
router.patch('/:id', authorize, folderCtl.delete)
router.patch('/r/:id', authorize, folderCtl.restore)
router.delete('/:id', authorize, folderCtl.deleteForever)

module.exports = router