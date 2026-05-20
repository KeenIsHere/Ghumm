const express = require('express');
const router = express.Router();
const { getHomeSlider } = require('../controllers/siteController');

router.get('/home-slider', getHomeSlider);

module.exports = router;