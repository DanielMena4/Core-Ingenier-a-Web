const express = require('express');
const router = express.Router();
const controller = require('../controllers/match.controller');

router.get('/matches', controller.getMatches);
router.post('/matches', controller.createMatch);
router.delete('/matches/:id', controller.deleteMatch);
router.put('/matches/:id', controller.updateMatch);

module.exports = router;