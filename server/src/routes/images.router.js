const router = require('express').Router();
const imageController = require('../controllers/images.controller');

router.get('/', imageController.read);

module.exports = router;