const express = require('express');
const router = express.Router();
const controller = require('../controllers/player.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');




router.get('/', controller.getPlayers);


router.post(
    '/',
    auth,
    authorize('admin'),
    controller.createPlayer
);

router.put(
    '/:id',
    auth,
    authorize('admin'),
    controller.updatePlayer
);

router.delete(
    '/:id',
    auth,
    authorize('admin'),
    controller.deletePlayer
);

module.exports = router;