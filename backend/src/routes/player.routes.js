const express = require('express');
const router = express.Router();
const controller = require('../controllers/player.controller');



router.get('/players', controller.getPlayers);
router.post('/players',controller.createPlayer);
router.put('/players/:id', controller.updatePlayer);
router.delete('/players/:id', controller.deletePlayer);

module.exports = router;