const router = require('express').Router();
const authorize = require('../middlewares/authorize');
const imageController = require('../controllers/media.controller');

router.get('/', authorize, imageController.list);

module.exports = router;