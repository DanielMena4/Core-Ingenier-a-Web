const express = require('express');
const router = express.Router();

const leagueController = require('../controllers/leagueAnalytics.controller');

router.get('/league', leagueController.getLeague);

module.exports = router;