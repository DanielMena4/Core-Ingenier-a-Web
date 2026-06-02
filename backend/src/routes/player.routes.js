const express = require('express');
const router = express.Router();
const controller = require('../controllers/player.controller');



router.get('/', controller.getPlayers);
router.post('/',controller.createPlayer);
router.put('/:id', controller.updatePlayer);
router.delete('/:id', controller.deletePlayer);

module.exports = router;