const express = require('express');
const router = express.Router();

const controller = require('../controllers/lineupDetails.controller');

router.get('/', controller.getLineupDetails);

router.post('/', controller.createLineupDetail);

router.delete('/:id', controller.deleteLineupDetail);

module.exports = router;