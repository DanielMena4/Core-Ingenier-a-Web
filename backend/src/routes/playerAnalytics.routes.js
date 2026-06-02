const express = require('express');
const router = express.Router();

const controller = require('../controllers/playerAnalytics.controller');

router.get('/:id', controller.getPlayerAnalytics);

module.exports = router;