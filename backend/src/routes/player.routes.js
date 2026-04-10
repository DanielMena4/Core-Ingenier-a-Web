const express = require('express');
const router = express.Router();
const controller = require('../controllers/player.controller');
const verifyToken = require('../middleware/auth');


router.get('/players', verifyToken, controller.getPlayers);
router.post('/players', verifyToken, controller.createPlayer);
router.put('/players/:id', verifyToken, controller.updatePlayer);
router.delete('/players/:id', verifyToken, controller.deletePlayer);

module.exports = router;