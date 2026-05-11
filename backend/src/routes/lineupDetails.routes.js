const express = require('express');
const router = express.Router();

const controller = require('../controllers/lineupDetails.controller');

router.get('/lineup-details', controller.getLineupDetails);

router.post('/lineup-details', controller.createLineupDetail);

router.delete('/lineup-details/:id', controller.deleteLineupDetail);

module.exports = router;