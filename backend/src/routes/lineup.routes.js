const express = require('express');
const router = express.Router();

const controller = require('../controllers/lineup.controller');

router.get('/', controller.getLineups);

router.post('/', controller.createLineup);

router.put('/:id', controller.updateLineup);

router.delete('/:id', controller.deleteLineup);

module.exports = router;