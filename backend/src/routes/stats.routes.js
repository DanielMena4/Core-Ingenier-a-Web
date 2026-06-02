const express = require('express');
const router = express.Router();

const controller = require('../controllers/stats.controller');

router.get('/', controller.getStats);

router.post('/', controller.createStat);

router.put('/:id', controller.updateStat);

router.delete('/:id', controller.deleteStat);

router.get('/match/:id', controller.getStatsByMatch);

module.exports = router;