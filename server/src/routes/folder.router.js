const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const folderCtl = require('../controllers/folder.controller')

router.post('/', jwt.private, folderCtl.create)
router.get('/:id', jwt.private, folderCtl.read)
router.put('/:id', jwt.private, folderCtl.update)

module.exports = router