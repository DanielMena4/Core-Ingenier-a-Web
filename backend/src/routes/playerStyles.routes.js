const express = require('express');
const router = express.Router();

const playerStylesController = require('../controllers/playerStyles.controller');


router.get('/player/:id', playerStylesController.getPlayerStyles);

module.exports = router;