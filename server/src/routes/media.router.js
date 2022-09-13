const router = require('express').Router();
const authorize = require('../middlewares/authorize');
const mediaController = require('../controllers/media.controller');

router.get('/', authorize, mediaController.list);

module.exports = router;