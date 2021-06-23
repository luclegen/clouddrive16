const router = require('express').Router()
const jwt = require('../middlewares/jwt');
const folderCtl = require('../controllers/folder.controller')

router.post('/', jwt.private, folderCtl.create)

module.exports = router