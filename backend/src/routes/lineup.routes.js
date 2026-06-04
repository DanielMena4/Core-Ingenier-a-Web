const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const controller = require('../controllers/lineup.controller');


router.get('/', auth, controller.getLineups);
router.get('/:id', auth, controller.getLineupById);
router.post('/', auth, controller.createLineup);
router.put('/:id', auth, controller.updateLineup);
router.delete('/:id', auth, controller.deleteLineup);


router.post('/:id/players', auth, controller.addPlayerToLineup);
router.delete('/:id/players/:playerId', auth, controller.removePlayerFromLineup);

router.get('/:id/calculate', auth, controller.calculateLineup);

module.exports = router;