const router = require('express').Router();
const authorize = require('../middlewares/authorize');
const imageController = require('../controllers/images.controller');

router.get('/', authorize, imageController.list);

module.exports = router;