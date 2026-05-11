const express = require('express');
const router = express.Router();

const controller = require('../controllers/lineup.controller');

router.get('/lineups', controller.getLineups);

router.post('/lineups', controller.createLineup);

router.put('/lineups/:id', controller.updateLineup);

router.delete('/lineups/:id', controller.deleteLineup);

module.exports = router;