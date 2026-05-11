const express = require('express');
const router = express.Router();

const controller = require('../controllers/stats.controller');

router.get('/stats', controller.getStats);

router.post('/stats', controller.createStat);

router.put('/stats/:id', controller.updateStat);

router.delete('/stats/:id', controller.deleteStat);

module.exports = router;