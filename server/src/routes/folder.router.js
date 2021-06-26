const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const folderCtl = require('../controllers/folder.controller')

router.post('/', jwt.private, folderCtl.create)
router.get('/:id', jwt.private, folderCtl.read)
router.put('/:id', jwt.private, folderCtl.update)
router.patch('/:id', jwt.private, folderCtl.delete)
router.patch('/r/:id', jwt.private, folderCtl.restore)

module.exports = router