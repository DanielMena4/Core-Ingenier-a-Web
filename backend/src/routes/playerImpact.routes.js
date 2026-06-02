const express = require('express');
const router = express.Router();

const controller = require('../controllers/playerImpact.controller');

router.get('/', controller.getPlayerImpact);

module.exports = router;