const express = require('express');
const router = express.Router();

const controller =
    require('../controllers/lineupOptimizer.controller');

router.get('/team/:teamId', controller.getOptimalLineup);

module.exports = router;