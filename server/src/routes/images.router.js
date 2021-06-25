const router = require('express').Router();
const imageCtrl = require('../controllers/images.controller');

router.get('/', imageCtrl.read);

module.exports = router;